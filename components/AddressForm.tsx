"use client";

import { FormEvent, useState, useEffect } from "react";
import Button from "./Button";

type Address = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};

type Props = {
  onSubmit?: (address: Address) => void;
  isLoading?: boolean;
  resetForm?: boolean;
};

const AddressForm = ({ onSubmit, isLoading, resetForm }: Props) => {
  const [form, setForm] = useState<Address>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    country: ""
  });

  const handleChange = (key: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (resetForm) {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postal: "",
        country: ""
      });
    }
  }, [resetForm]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Full name" value={form.name} onChange={(v) => handleChange("name", v)} required />
        <InputField label="Email" type="email" value={form.email} onChange={(v) => handleChange("email", v)} required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} required />
        <InputField label="PIN Code" value={form.postal} onChange={(v) => handleChange("postal", v)} required />
      </div>
      <InputField label="Street address" value={form.address} onChange={(v) => handleChange("address", v)} required />
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="City" value={form.city} onChange={(v) => handleChange("city", v)} required />
        <InputField label="State" value={form.state} onChange={(v) => handleChange("state", v)} required />
      </div>
      <InputField label="Country" value={form.country} onChange={(v) => handleChange("country", v)} required />
      <div className="pt-2">
        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
          {isLoading ? "Processing..." : "Continue to payment"}
        </Button>
      </div>
    </form>
  );
};

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
};

const InputField = ({ label, value, onChange, type = "text", required }: InputProps) => (
  <label className="block text-sm text-white/70">
    <span className="mb-2 block text-white">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
    />
  </label>
);

export type { Address };
export default AddressForm;
