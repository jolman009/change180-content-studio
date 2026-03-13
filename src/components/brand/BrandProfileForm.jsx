import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function BrandProfileForm({ form, onChange, onSave }) {
  return (
    <Card
      title="Brand Brain"
      subtitle="This is where the voice of Change180 is stored."
      className="max-w-4xl"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Brand Name"
          name="brand_name"
          value={form.brand_name}
          onChange={onChange}
        />
        <Input
          label="Target Audience"
          name="target_audience"
          value={form.target_audience}
          onChange={onChange}
        />
      </div>

      <div className="mt-4 space-y-4">
        <Textarea
          label="Mission"
          name="mission"
          value={form.mission}
          onChange={onChange}
        />
        <Textarea
          label="Tone Rules"
          name="tone_rules"
          value={form.tone_rules}
          onChange={onChange}
        />
        <Textarea
          label="Preferred Calls to Action"
          name="preferred_ctas"
          value={form.preferred_ctas}
          onChange={onChange}
        />
        <Textarea
          label="Phrases to Avoid"
          name="banned_phrases"
          value={form.banned_phrases}
          onChange={onChange}
        />
      </div>

      <div className="mt-5">
        <Button onClick={onSave}>Save Brand Profile</Button>
      </div>
    </Card>
  );
}