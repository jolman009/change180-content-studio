import { corsHeaders } from "../_shared/cors.ts";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-5-mini";

type GenerateRequest = {
  mode: "generate";
  input: {
    topic: string;
    platform: string;
    contentType: string;
    pillar: string;
    goal: string;
    tone: string;
    context?: string | null;
  };
  brandProfile?: {
    brandName?: string | null;
    audience?: string | null;
    mission?: string | null;
    toneRules?: string | null;
    preferredCtas?: string | null;
    bannedPhrases?: string | null;
  } | null;
};

type RewriteRequest = {
  mode: "rewrite";
  input: GenerateRequest["input"];
  currentOutput: {
    hook: string;
    caption: string;
    cta: string;
    hashtags: string[];
    visual: string;
  };
  action?: {
    id?: string | null;
    instruction?: string | null;
  } | null;
  brandProfile?: GenerateRequest["brandProfile"];
};

type GenerateContentRequest = GenerateRequest | RewriteRequest;

type OpenAIResponsesPayload = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function buildSystemPrompt(body: GenerateContentRequest) {
  const brand = body.brandProfile;
  const brandContext = brand
    ? [
        `Brand: ${brand.brandName ?? "Unknown brand"}`,
        `Audience: ${brand.audience ?? "Unknown audience"}`,
        `Mission: ${brand.mission ?? "Unknown mission"}`,
        `Tone rules: ${brand.toneRules ?? "None provided"}`,
        `Preferred CTAs: ${brand.preferredCtas ?? "None provided"}`,
        `Banned phrases: ${brand.bannedPhrases ?? "None provided"}`,
      ].join("\n")
    : "No brand profile was provided.";

  const baseInstructions = [
    "You are writing polished social content for a coaching brand.",
    "Return only valid JSON matching the requested schema.",
    "Avoid banned phrases and generic self-help cliches.",
    "Keep the copy aligned to the brand profile and platform context.",
    brandContext,
  ].join("\n\n");

  if (body.mode === "rewrite") {
    return `${baseInstructions}\n\nRewrite the provided content using the requested transformation while preserving the original message intent.`;
  }

  return `${baseInstructions}\n\nGenerate a fresh structured social draft from the planning inputs.`;
}

function buildUserPrompt(body: GenerateContentRequest) {
  const inputSummary = [
    `Topic: ${body.input.topic}`,
    `Platform: ${body.input.platform}`,
    `Content type: ${body.input.contentType}`,
    `Pillar: ${body.input.pillar}`,
    `Goal: ${body.input.goal}`,
    `Tone: ${body.input.tone}`,
    `Context: ${body.input.context || "None provided"}`,
  ].join("\n");

  if (body.mode === "rewrite") {
    return [
      inputSummary,
      `Rewrite action: ${body.action?.id ?? "rewrite"}`,
      `Rewrite instruction: ${body.action?.instruction ?? "Improve the content while keeping the same intent."}`,
      `Current hook: ${body.currentOutput.hook}`,
      `Current caption: ${body.currentOutput.caption}`,
      `Current CTA: ${body.currentOutput.cta}`,
      `Current hashtags: ${(body.currentOutput.hashtags ?? []).join(" ")}`,
      `Current visual: ${body.currentOutput.visual}`,
    ].join("\n\n");
  }

  return inputSummary;
}

async function callOpenAI(body: GenerateContentRequest) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured for the edge function.");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: buildSystemPrompt(body) }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: buildUserPrompt(body) }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "generated_content",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              output: {
                type: "object",
                additionalProperties: false,
                properties: {
                  hook: { type: "string" },
                  caption: { type: "string" },
                  cta: { type: "string" },
                  hashtags: {
                    type: "array",
                    items: { type: "string" },
                  },
                  visual: { type: "string" },
                },
                required: ["hook", "caption", "cta", "hashtags", "visual"],
              },
            },
            required: ["output"],
          },
        },
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as OpenAIResponsesPayload & {
    error?: { message?: string };
    message?: string;
  };

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      "OpenAI request failed.";
    throw new Error(message);
  }

  const outputText =
    payload.output_text ??
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text" && typeof item.text === "string")
      ?.text;

  if (!outputText) {
    throw new Error("OpenAI response did not contain output_text.");
  }

  const parsed = JSON.parse(outputText);

  if (!parsed?.output) {
    throw new Error("OpenAI response JSON did not match the expected shape.");
  }

  return parsed;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed." }, 405);
  }

  // Verify JWT — reject unauthenticated requests
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ message: "Missing authorization token." }, 401);
  }

  try {
    const body = (await request.json()) as GenerateContentRequest;

    if (!body?.mode || !body?.input?.topic) {
      return jsonResponse(
        { message: "Invalid request body for generate-content." },
        400,
      );
    }

    const result = await callOpenAI(body);
    return jsonResponse(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected edge function error.";

    return jsonResponse({ message }, 500);
  }
});
