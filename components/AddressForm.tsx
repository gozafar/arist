"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";

// Dynamically import components
const Button = dynamic(() => import("./Button"), { ssr: false });
const InputField = dynamic(() => import("./InputField"), { ssr: false });
const SelectField = dynamic(() => import("./SelectField"), { ssr: false });
const PhoneInputField = dynamic(() => import("./PhoneInputField"), { ssr: false });

// -------------------- Types --------------------
export type Address = {
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
  onSubmit?: (address: Address) => Promise<void>;
  isLoading?: boolean;
  resetForm?: boolean;
};

type BackendError =
  | { errors?: Record<string, string> }
  | { errors?: { field: keyof Address; message: string }[] }
  | { message?: string }
  | string;

// -------------------- Helper --------------------
const detectCountryFromPhone = (phone: string) => {
  const clean = phone.replace(/\D/g, "");
  if (!clean) return null;
  const countries = Country.getAllCountries();
  const sorted = [...countries].sort((a, b) => b.phonecode.length - a.phonecode.length);
  return sorted.find((c) => clean.startsWith(c.phonecode)) || null;
};

// -------------------- Component --------------------
const AddressForm = ({ onSubmit, isLoading, resetForm }: Props) => {
  const [form, setForm] = useState<Address>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    country: "IN", // Default to India
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => (form.country ? State.getStatesOfCountry(form.country) : []), [form.country]);
  const cities = useMemo(() => (form.country && form.state ? City.getCitiesOfState(form.country, form.state) : []), [form.country, form.state]);

  // -------------------- Helpers --------------------
  const updateForm = (patch: Partial<Address>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    if (Object.keys(formErrors).length > 0) setFormErrors({});
  };

  // -------------------- Effects --------------------
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
        country: "",
      });
      setFormErrors({});
    }
  }, [resetForm]);

  // -------------------- Submit --------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    await onSubmit?.(form);
  };

  // -------------------- Render --------------------
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Name & Email */}
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Full name" value={form.name} onChange={(v) => updateForm({ name: v })} required error={formErrors.name} />
        <InputField label="Email" type="email" value={form.email} onChange={(v) => updateForm({ email: v })} required error={formErrors.email} />
      </div>

      {/* Phone & Postal */}
      <div className="grid gap-4 md:grid-cols-2">
        <PhoneInputField
          phone={form.phone}
          country={form.country}
          onPhoneChange={(phone) => {
            const detected = detectCountryFromPhone(phone);
            updateForm({ phone, ...(detected && detected.isoCode !== form.country ? { country: detected.isoCode, state: "", city: "" } : {}) });
          }}
          onCountryChange={(iso) => updateForm({ country: iso, state: "", city: "" })}
          required
          error={formErrors.phone}
        />
        <InputField label="Postal Code" value={form.postal} onChange={(v) => updateForm({ postal: v })} required error={formErrors.postal} />
      </div>

      {/* Address */}
      <InputField label="Street address" value={form.address} onChange={(v) => updateForm({ address: v })} required error={formErrors.address} />

      {/* Country */}
      <SelectField
        label="Country"
        value={form.country}
        onChange={(v) => updateForm({ country: v, state: "", city: "" })}
        options={countries.map((c) => ({ value: c.isoCode, label: c.name }))}
        required
        error={formErrors.country}
      />

      {/* State & City */}
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="State"
          value={form.state}
          onChange={(v) => updateForm({ state: v, city: "" })}
          options={states.map((s) => ({ value: s.isoCode, label: s.name }))}
          disabled={!form.country}
          required
          error={formErrors.state}
        />
        <SelectField
          label="City"
          value={form.city}
          onChange={(v) => updateForm({ city: v })}
          options={cities.map((c) => ({ value: c.name, label: c.name }))}
          disabled={!form.state}
          required
          error={formErrors.city}
        />
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading ? "Processing..." : "Order Create"}
      </Button>
    </form>
  );
};

export default AddressForm;
