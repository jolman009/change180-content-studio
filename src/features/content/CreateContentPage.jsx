import { useState } from "react";
import Card from "../../components/ui/Card";
import ContentForm from "../../components/content/ContentForm";
import GeneratedOutput from "../../components/content/GeneratedOutput";
import { mockContentForm, mockGeneratedContent } from "../../lib/mockData";

export default function CreateContentPage() {
  const [form, setForm] = useState(mockContentForm);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onGenerate() {
    setLoading(true);
    setError("");

    try {
      if (!form.topic.trim()) {
        throw new Error("Add a topic before generating content.");
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      setOutput(mockGeneratedContent);
    } catch (err) {
      setOutput(null);
      setError(err.message || "Unable to generate content.");
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
          error={error}
        />
      </Card>

      <GeneratedOutput output={output} loading={loading} error={error} />
    </div>
  );
}
