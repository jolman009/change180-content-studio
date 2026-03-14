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
  loading,
  error,
}) {
  const availableContentTypes = getAvailableContentTypes(form.platform);

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

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button className="w-full sm:w-auto" onClick={onGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Content"}
      </Button>
    </div>
  );
}
