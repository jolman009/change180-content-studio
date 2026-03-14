import { useState } from "react";
import BrandProfileForm from "../../components/brand/BrandProfileForm";
import { mockBrandProfile } from "../../lib/mockData";

export default function BrandProfilePage() {
  const [form, setForm] = useState(mockBrandProfile);

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSave() {
    console.log("save brand profile", form);
    alert("Brand profile saved locally for now.");
  }

  return <BrandProfileForm form={form} onChange={onChange} onSave={onSave} />;
}
