import { hasSupabaseEnv } from "../lib/runtime";
import { supabase } from "../lib/supabaseClient";

const TEMPLATES_STORAGE_KEY = "change180.contentTemplates";

function getStoredTemplates() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(TEMPLATES_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function setStoredTemplates(templates) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
}

function toRecord(template) {
  return {
    name: template.name,
    platform: template.platform,
    content_type: template.contentType,
    pillar: template.pillar,
    tone: template.tone,
    prompt_template: template.promptTemplate ?? "",
    hook_template: template.hookTemplate ?? "",
    cta_template: template.ctaTemplate ?? "",
  };
}

function fromRecord(record) {
  return {
    id: record.id,
    name: record.name ?? "",
    platform: record.platform ?? "",
    contentType: record.content_type ?? "",
    pillar: record.pillar ?? "",
    tone: record.tone ?? "",
    promptTemplate: record.prompt_template ?? "",
    hookTemplate: record.hook_template ?? "",
    ctaTemplate: record.cta_template ?? "",
    createdAt: record.created_at ?? "",
  };
}

const TEMPLATE_SELECT =
  "id, name, platform, content_type, pillar, tone, prompt_template, hook_template, cta_template, created_at";

export async function getTemplates() {
  if (!hasSupabaseEnv || !supabase) {
    return { data: getStoredTemplates().map(fromRecord), source: "local" };
  }

  const { data, error } = await supabase
    .from("content_templates")
    .select(TEMPLATE_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { data: data.map(fromRecord), source: "supabase" };
}

export async function saveTemplate(template) {
  if (!hasSupabaseEnv || !supabase) {
    const record = {
      id: `local-${Date.now()}`,
      ...toRecord(template),
      created_at: new Date().toISOString(),
    };
    const stored = getStoredTemplates();
    setStoredTemplates([record, ...stored]);
    return { data: fromRecord(record), source: "local" };
  }

  const { data, error } = await supabase
    .from("content_templates")
    .insert(toRecord(template))
    .select(TEMPLATE_SELECT)
    .single();

  if (error) throw error;
  return { data: fromRecord(data), source: "supabase" };
}

export async function deleteTemplate(templateId) {
  if (!hasSupabaseEnv || !supabase) {
    const stored = getStoredTemplates().filter((t) => t.id !== templateId);
    setStoredTemplates(stored);
    return { data: null, source: "local" };
  }

  const { error } = await supabase
    .from("content_templates")
    .delete()
    .eq("id", templateId);

  if (error) throw error;
  return { data: null, source: "supabase" };
}
