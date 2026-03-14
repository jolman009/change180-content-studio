import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import {
  CONTENT_PILLARS,
  CONTENT_TYPES,
  PLATFORM_GOALS,
  PLATFORM_TONES,
  PLATFORMS,
} from "../../lib/constants";

export default function ContentForm({ form, onChange, onGenerate, loading, error }) {
  return (
    <div className="space-y-4">
      <Input label="Topic" name="topic" value={form.topic} onChange={onChange} />

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
          {CONTENT_TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>

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

      <Button onClick={onGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Content"}
      </Button>
    </div>
  );
}
