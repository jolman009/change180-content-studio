import { useState } from "react";
import Card from "../../components/ui/Card";
import ContentForm from "../../components/content/ContentForm";
import GeneratedOutput from "../../components/content/GeneratedOutput";

const initialForm = {
  topic: "",
  platform: "Instagram",
  contentType: "Caption Post",
  pillar: "Mindset Shifts",
  goal: "Engagement",
  tone: "Grounded, hopeful, direct",
  context: "",
};

export default function CreateContentPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onGenerate() {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setOutput({
        hook: "You do not need a new life overnight. You need one honest step today.",
        caption:
          "Growth is rarely loud. Sometimes it looks like a hard conversation, a boundary kept, or a quiet choice to stop betraying yourself. Change begins when clarity becomes action.\n\nIf this is your season to reset, do not wait for perfect conditions. Start with truth. Start with one turn in the right direction.",
        cta: "Save this for the day you need a reset, and message Change180 if you're ready for guided growth.",
        hashtags: [
          "#Change180",
          "#MindsetShift",
          "#LifeCoaching",
          "#PersonalGrowth",
          "#HealingJourney",
        ],
        visual:
          "Clean branded quote graphic with soft cream background, teal headline, and warm accent line.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <Card title="Create Content" subtitle="Turn a coaching idea into a usable social asset">
        <ContentForm
          form={form}
          onChange={onChange}
          onGenerate={onGenerate}
          loading={loading}
        />
      </Card>

      <GeneratedOutput output={output} />
    </div>
  );
}