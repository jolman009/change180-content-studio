import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import {
  CONTENT_PILLARS,
  PLATFORM_GOALS,
  PLATFORM_TONES,
  PLATFORMS,
} from "../../lib/constants";
import { getAvailableContentTypes } from "../../lib/contentDraft";

export default function ContentForm({
  form,
  fieldErrors,
  onChange,
  onGenerate,
  onMediaSelect,
  onMediaRemove,
  mediaPreviewUrl,
  isUploadingMedia,
  loading,
  error,
}) {
  const fileInputRef = useRef(null);
  const availableContentTypes = getAvailableContentTypes(form.platform);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file && onMediaSelect) {
      onMediaSelect(file);
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <Input label="Topic" name="topic" value={form.topic} onChange={onChange} />
      {fieldErrors.topic ? <p className="text-sm text-red-600">{fieldErrors.topic}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Platform" name="platform" value={form.platform} onChange={onChange}>
          {PLATFORMS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>

        <Select
          label="Content Type"
          name="contentType"
          value={form.contentType}
          onChange={onChange}
        >
          {availableContentTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>
      {fieldErrors.platform ? <p className="text-sm text-red-600">{fieldErrors.platform}</p> : null}
      {fieldErrors.contentType ? (
        <p className="text-sm text-red-600">{fieldErrors.contentType}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Pillar" name="pillar" value={form.pillar} onChange={onChange}>
          {CONTENT_PILLARS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>

        <Select label="Goal" name="goal" value={form.goal} onChange={onChange}>
          {PLATFORM_GOALS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>
      {fieldErrors.pillar ? <p className="text-sm text-red-600">{fieldErrors.pillar}</p> : null}

      <Select label="Tone" name="tone" value={form.tone} onChange={onChange}>
        {PLATFORM_TONES.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </Select>

      <Textarea
        label="Additional Context"
        name="context"
        value={form.context}
        onChange={onChange}
        placeholder="Ex: this post should feel grounded, hopeful, and invite coaching inquiry."
      />

      {/* Image upload */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
          Image (optional)
        </label>
        {mediaPreviewUrl ? (
          <div className="relative inline-block">
            <img
              src={mediaPreviewUrl}
              alt="Upload preview"
              className="h-32 w-32 rounded-xl border border-[var(--border)] object-cover"
            />
            {onMediaRemove ? (
              <button
                type="button"
                onClick={onMediaRemove}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingMedia}
            className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-gray-500 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <ImagePlus size={18} />
            {isUploadingMedia ? "Uploading..." : "Attach image"}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button className="w-full sm:w-auto" onClick={onGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Content"}
      </Button>
    </div>
  );
}
