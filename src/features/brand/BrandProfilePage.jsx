import { useEffect, useState } from "react";
import BrandProfileForm from "../../components/brand/BrandProfileForm";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { createBrandProfile, validateBrandProfile } from "../../lib/brandProfile";
import { getBrandProfile, saveBrandProfile } from "../../services/brandService";

export default function BrandProfilePage() {
  const [form, setForm] = useState(createBrandProfile);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadBrandProfile() {
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const result = await getBrandProfile();

      setForm(result.data);
      setStatus({
        type: "info",
        message:
          result.source === "supabase"
            ? "Loaded saved brand profile from Supabase."
            : "Loaded brand profile from local mock storage.",
      });
    } catch (error) {
      setForm(createBrandProfile());
      setStatus({
        type: "error",
        message: error.message || "Unable to load the brand profile.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBrandProfile();
  }, []);

  function onChange(e) {
    const { name } = e.target;

    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const next = { ...prev };
      delete next[name];
      return next;
    });
    setStatus((prev) => (prev.type === "error" ? { type: "", message: "" } : prev));
  }

  async function onSave() {
    const nextErrors = validateBrandProfile(form);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setStatus({
        type: "error",
        message: "Fill the required brand voice fields before saving.",
      });
      return;
    }

    setIsSaving(true);
    setFieldErrors({});
    setStatus({ type: "", message: "" });

    try {
      const result = await saveBrandProfile(form);

      setForm(result.data);
      setStatus({
        type: "success",
        message:
          result.source === "supabase"
            ? "Brand profile saved to Supabase."
            : "Brand profile saved in local mock storage.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save the brand profile.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Brand Profile"
        description="Pulling the current voice settings into the editor."
      />
    );
  }

  if (status.type === "error" && !form) {
    return (
      <ErrorState
        title="Brand Profile"
        message={status.message}
      />
    );
  }

  return (
    <BrandProfileForm
      form={form}
      fieldErrors={fieldErrors}
      status={status}
      isSaving={isSaving}
      onChange={onChange}
      onSave={onSave}
    />
  );
}
