import { hasSupabaseEnv } from "../lib/runtime";
import { supabase } from "../lib/supabaseClient";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function validateMediaFile(file) {
  if (!file) return "No file selected.";
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG, GIF, and WebP images are supported.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image must be under 5MB.";
  }
  return null;
}

export async function uploadMedia(file) {
  const validationError = validateMediaFile(file);
  if (validationError) throw new Error(validationError);

  if (!hasSupabaseEnv || !supabase) {
    // Mock mode: create a local object URL
    const localUrl = URL.createObjectURL(file);
    return {
      url: localUrl,
      type: file.type,
      source: "local",
    };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `post-media/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("post-media")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("post-media")
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    type: file.type,
    source: "supabase",
  };
}
