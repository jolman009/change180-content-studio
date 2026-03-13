import { useState } from "react";
import BrandProfileForm from "../../components/brand/BrandProfileForm";

const initialForm = {
  brand_name: "Change180",
  target_audience: "Adults seeking clarity, growth, and life direction",
  mission: "Help people renew mindset, gain clarity, and take practical steps toward lasting change.",
  tone_rules: "Grounded, hopeful, direct, reflective, practical. Avoid fluff and hype.",
  preferred_ctas: "Book a session, reflect on this, save this post, share with someone who needs it.",
  banned_phrases: "Boss babe, hustle harder, healing vibes only, manifest it all",
};

export default function BrandProfilePage() {
  const [form, setForm] = useState(initialForm);

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSave() {
    console.log("save brand profile", form);
    alert("Brand profile saved locally for now.");
  }

  return <BrandProfileForm form={form} onChange={onChange} onSave={onSave} />;
}