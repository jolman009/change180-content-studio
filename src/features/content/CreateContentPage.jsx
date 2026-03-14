import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import ContentForm from "../../components/content/ContentForm";
import GeneratedOutput from "../../components/content/GeneratedOutput";
import {
  createContentDraftInput,
  createContentPost,
  getAvailableContentTypes,
  getPlatformDefaults,
  normalizeGeneratedContent,
  validateContentDraftInput,
  validateGeneratedContent,
} from "../../lib/contentDraft";
import { getBrandProfile } from "../../services/brandService";
import { generateContent } from "../../services/aiService";
import { saveContentPost } from "../../services/contentService";

export default function CreateContentPage() {
  const [form, setForm] = useState(createContentDraftInput);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [outputErrors, setOutputErrors] = useState({});
  const [generateError, setGenerateError] = useState("");
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [brandProfile, setBrandProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBrandContext() {
      try {
        const result = await getBrandProfile();
        if (isMounted) {
          setBrandProfile(result.data);
        }
      } catch {
        if (isMounted) {
          setBrandProfile(null);
        }
      }
    }

    loadBrandContext();

    return () => {
      isMounted = false;
    };
  }, []);

  function onChange(e) {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "platform") {
        const platformDefaults = getPlatformDefaults(value);
        const availableContentTypes = getAvailableContentTypes(value);
        const nextContentType = availableContentTypes.includes(prev.contentType)
          ? prev.contentType
          : availableContentTypes[0];

        return {
          ...prev,
          platform: value,
          contentType: nextContentType,
          goal: platformDefaults.goal,
          tone: platformDefaults.tone,
        };
      }

      return { ...prev, [name]: value };
    });

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setGenerateError("");
  }

  function onOutputChange(e) {
    const { name, value } = e.target;

    setOutput((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [name]:
          name === "hashtags"
            ? value
                .split(/\s+/)
                .map((item) => item.trim())
                .filter(Boolean)
            : value,
      };
    });

    setOutputErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSaveStatus({ type: "", message: "" });
  }

  async function onGenerate() {
    const nextErrors = validateContentDraftInput(form);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setGenerateError("Fill the required planning fields before generating content.");
      setOutput(null);
      return;
    }

    setLoading(true);
    setGenerateError("");
    setFieldErrors({});
    setSaveStatus({ type: "", message: "" });

    try {
      const generated = await generateContent(form, brandProfile);
      setOutput(normalizeGeneratedContent(generated));
    } catch (err) {
      setOutput(null);
      setGenerateError(err.message || "Unable to generate content.");
    } finally {
      setLoading(false);
    }
  }

  async function onSaveDraft() {
    if (!output) {
      setSaveStatus({
        type: "error",
        message: "Generate content before saving a draft.",
      });
      return;
    }

    const nextFormErrors = validateContentDraftInput(form);
    const nextOutputErrors = validateGeneratedContent(output);

    if (Object.keys(nextFormErrors).length > 0 || Object.keys(nextOutputErrors).length > 0) {
      setFieldErrors(nextFormErrors);
      setOutputErrors(nextOutputErrors);
      setSaveStatus({
        type: "error",
        message: "Fix the missing draft fields before saving.",
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus({ type: "", message: "" });

    try {
      const draft = createContentPost(form, output);
      const result = await saveContentPost(draft);

      setSaveStatus({
        type: "success",
        message:
          result.source === "supabase"
            ? "Draft saved to Supabase."
            : "Draft saved in local mock storage.",
      });
    } catch (err) {
      setSaveStatus({
        type: "error",
        message: err.message || "Unable to save the draft.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <Card title="Create Content" subtitle="Turn a coaching idea into a usable social asset">
        <ContentForm
          form={form}
          fieldErrors={fieldErrors}
          onChange={onChange}
          onGenerate={onGenerate}
          loading={loading}
          error={generateError}
        />
      </Card>

      <GeneratedOutput
        output={output}
        loading={loading}
        error={generateError}
        fieldErrors={outputErrors}
        saveStatus={saveStatus}
        isSaving={isSaving}
        onChange={onOutputChange}
        onSaveDraft={onSaveDraft}
      />
    </div>
  );
}
