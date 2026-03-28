import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { BRAND_PROFILE_LABELS } from "../../lib/brandProfile";

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600">{message}</p>;
}

export default function BrandProfileForm({
  form,
  fieldErrors,
  isSaving,
  onChange,
  onSave,
}) {
  return (
    <Card
      title="Brand Brain"
      subtitle="This is where the voice of Change180 is stored."
      className="max-w-4xl"
    >

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Input
            label={BRAND_PROFILE_LABELS.brand_name}
            name="brand_name"
            value={form.brand_name}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.brand_name} />
        </div>
        <div className="space-y-2">
          <Input
            label={BRAND_PROFILE_LABELS.target_audience}
            name="target_audience"
            value={form.target_audience}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.target_audience} />
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Textarea
            label={BRAND_PROFILE_LABELS.mission}
            name="mission"
            value={form.mission}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.mission} />
        </div>
        <div className="space-y-2">
          <Textarea
            label={BRAND_PROFILE_LABELS.tone_rules}
            name="tone_rules"
            value={form.tone_rules}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.tone_rules} />
        </div>
        <div className="space-y-2">
          <Textarea
            label={BRAND_PROFILE_LABELS.preferred_ctas}
            name="preferred_ctas"
            value={form.preferred_ctas}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.preferred_ctas} />
        </div>
        <div className="space-y-2">
          <Textarea
            label={BRAND_PROFILE_LABELS.banned_phrases}
            name="banned_phrases"
            value={form.banned_phrases}
            onChange={onChange}
          />
          <FieldError message={fieldErrors.banned_phrases} />
        </div>
      </div>

      <div className="mt-5">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Brand Profile"}
        </Button>
      </div>
    </Card>
  );
}
