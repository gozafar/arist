'use client';

import { FormEvent, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Country, State, City } from 'country-state-city';
// import { toast } from "react-toastify";

// Dynamically import components
const Button = dynamic(() => import('./Button'), { ssr: false });
const InputField = dynamic(() => import('./InputField'), { ssr: false });
const SelectField = dynamic(() => import('./SelectField'), { ssr: false });
const PhoneInputField = dynamic(() => import('./PhoneInputField'), { ssr: false });

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
  key?: string; // Used for resetting the form when key changes
};

// type BackendError =
//   | { errors?: Record<string, string> }
//   | { errors?: { field: keyof Address; message: string }[] }
//   | { message?: string }
//   | string;

// -------------------- Helper --------------------
const detectCountryFromPhone = (phone: string) => {
  const clean = phone.replace(/\D/g, '');
  if (!clean) return null;
  const countries = Country.getAllCountries();
  const sorted = [...countries].sort((a, b) => b.phonecode.length - a.phonecode.length);
  return sorted.find(c => clean.startsWith(c.phonecode)) || null;
};

// -------------------- Component --------------------
const AddressForm = ({ onSubmit, isLoading }: Props) => {
  const [form, setForm] = useState<Address>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal: '',
    country: 'IN', // Default to India
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => (form.country ? State.getStatesOfCountry(form.country) : []), [form.country]);
  const cities = useMemo(
    () => (form.country && form.state ? City.getCitiesOfState(form.country, form.state) : []),
    [form.country, form.state]
  );

  // -------------------- Helpers --------------------
  const updateForm = (patch: Partial<Address>) => {
    setForm(prev => ({ ...prev, ...patch }));
    if (Object.keys(formErrors).length > 0) setFormErrors({});
  };

  // The form will be reset automatically when the key prop changes
  // No need for a separate resetForm prop or effect

  // -------------------- Submit --------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await onSubmit?.(form);
      // toast.success('Order created successfully');
      // Redirect to paintings page after successful order creation
    } catch (error) {
      // Handle validation errors from the API
      if (error instanceof Error) {
        const errorMessage = error.message;

        // Try to extract field-specific errors
        if (errorMessage.includes('Phone')) {
          setFormErrors(prev => ({ ...prev, phone: errorMessage }));
        } else if (errorMessage.includes('Email')) {
          setFormErrors(prev => ({ ...prev, email: errorMessage }));
        } else if (errorMessage.includes('Address')) {
          setFormErrors(prev => ({ ...prev, address: errorMessage }));
        } else if (errorMessage.includes('Name')) {
          setFormErrors(prev => ({ ...prev, name: errorMessage }));
        } else if (errorMessage.includes('City')) {
          setFormErrors(prev => ({ ...prev, city: errorMessage }));
        } else if (errorMessage.includes('State')) {
          setFormErrors(prev => ({ ...prev, state: errorMessage }));
        } else if (errorMessage.includes('Postal')) {
          setFormErrors(prev => ({ ...prev, postal: errorMessage }));
        } else if (errorMessage.includes('Country')) {
          setFormErrors(prev => ({ ...prev, country: errorMessage }));
        } else {
          // Generic error - could show a toast or set a general form error
          console.error('Form submission error:', errorMessage);
        }
      }
    }
  };

  // -------------------- Render --------------------
  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      {/* Name & Email */}
      <div className='grid gap-4 md:grid-cols-2'>
        <InputField
          label='Full name'
          value={form.name}
          onChange={v => updateForm({ name: v })}
          required
          error={formErrors.name}
        />
        <InputField
          label='Email'
          type='email'
          value={form.email}
          onChange={v => updateForm({ email: v })}
          required
          error={formErrors.email}
        />
      </div>

      {/* Phone & Postal */}
      <div className='grid gap-4 md:grid-cols-2'>
        <PhoneInputField
          phone={form.phone}
          country={form.country}
          onPhoneChange={phone => {
            const detected = detectCountryFromPhone(phone);
            updateForm({
              phone,
              ...(detected && detected.isoCode !== form.country
                ? { country: detected.isoCode, state: '', city: '' }
                : {}),
            });
          }}
          onCountryChange={iso => updateForm({ country: iso, state: '', city: '' })}
          required
          error={formErrors.phone}
        />
        <InputField
          label='Postal Code'
          value={form.postal}
          onChange={v => updateForm({ postal: v })}
          required
          error={formErrors.postal}
        />
      </div>

      {/* Address */}
      <InputField
        label='Street address'
        value={form.address}
        onChange={v => updateForm({ address: v })}
        required
        error={formErrors.address}
      />

      {/* Country */}
      <SelectField
        label='Country'
        value={form.country}
        onChange={v => updateForm({ country: v, state: '', city: '' })}
        options={countries.map(c => ({ value: c.isoCode, label: c.name }))}
        required
        error={formErrors.country}
      />

      {/* State & City */}
      <div className='grid gap-4 md:grid-cols-2'>
        <SelectField
          label='State'
          value={form.state}
          onChange={v => updateForm({ state: v, city: '' })}
          options={states.map(s => ({ value: s.isoCode, label: s.name }))}
          disabled={!form.country}
          required
          error={formErrors.state}
        />
        <SelectField
          label='City'
          value={form.city}
          onChange={v => updateForm({ city: v })}
          options={cities.map(c => ({ value: c.name, label: c.name }))}
          disabled={!form.state}
          required
          error={formErrors.city}
        />
      </div>

      <Button
        type='submit'
        className={`flex-1 text-xs ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
        style={{ backgroundColor: '#FFA501', borderColor: '#FFA501' }}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Submit Enquiry'}
      </Button>
    </form>
  );
};

export default AddressForm;
