import { useEffect, useState } from "react";
import { toast } from "sonner";
import BrandProfileForm from "../../components/brand/BrandProfileForm";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { createBrandProfile, validateBrandProfile } from "../../lib/brandProfile";
import { getBrandProfile, saveBrandProfile } from "../../services/brandService";

export default function BrandProfilePage() {
  const [form, setForm] = useState(createBrandProfile);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadBrandProfile() {
    setIsLoading(true);
    setLoadError("");

    try {
      const result = await getBrandProfile();
      setForm(result.data);
      if (result.source !== "supabase") {
        toast.info("Loaded brand profile from local mock storage.");
      }
    } catch (error) {
      setForm(createBrandProfile());
      setLoadError(error.message || "Unable to load the brand profile.");
      toast.error(error.message || "Unable to load the brand profile.");
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
  }

  async function onSave() {
    const nextErrors = validateBrandProfile(form);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      toast.error("Fill the required brand voice fields before saving.");
      return;
    }

    setIsSaving(true);
    setFieldErrors({});

    try {
      const result = await saveBrandProfile(form);
      setForm(result.data);
      if (result.source === "supabase") {
        toast.success("Brand profile saved.");
      } else {
        toast.info("Brand profile saved in local mock storage.");
      }
    } catch (error) {
      toast.error(error.message || "Unable to save the brand profile.");
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

  if (loadError && !form) {
    return (
      <ErrorState
        title="Brand Profile"
        message={loadError}
      />
    );
  }

  return (
    <BrandProfileForm
      form={form}
      fieldErrors={fieldErrors}
      isSaving={isSaving}
      onChange={onChange}
      onSave={onSave}
    />
  );
}
