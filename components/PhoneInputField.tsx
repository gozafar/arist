// components/PhoneInputField.tsx
'use client';

import React, { useMemo } from 'react';
import { Country } from 'country-state-city';

type PhoneInputFieldProps = {
  phone: string;
  country: string;
  onPhoneChange: (phone: string) => void;
  onCountryChange: (isoCode: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
  defaultCountry?: string;
};

const PhoneInputField = React.forwardRef<HTMLDivElement, PhoneInputFieldProps>(
  ({ phone, country, onPhoneChange, onCountryChange, required = false, error, className = '' }, ref) => {
    const countries = useMemo(() => Country.getAllCountries(), []);

    // Get local phone number (without country code) for display
    const getLocalPhone = (fullPhone: string) => {
      const selectedCountry = countries.find(c => c.isoCode === country);
      if (selectedCountry && fullPhone.startsWith(selectedCountry.phonecode)) {
        return fullPhone.slice(selectedCountry.phonecode.length).trim();
      }
      return fullPhone;
    };

    const handleCountryChange = (isoCode: string) => {
      onCountryChange(isoCode);

      // Auto-populate phone with country code
      const selectedCountry = countries.find(c => c.isoCode === isoCode);
      if (selectedCountry) {
        onPhoneChange(selectedCountry.phonecode);
      }
    };

    const handlePhoneChange = (localPhone: string) => {
      const selectedCountry = countries.find(c => c.isoCode === country);
      if (selectedCountry) {
        // Combine country code with space and local number for backend
        const fullPhone = selectedCountry.phonecode + ' ' + localPhone.replace(/\s/g, '');
        onPhoneChange(fullPhone);
      } else {
        onPhoneChange(localPhone);
      }
    };

    return (
      <div ref={ref} className={className}>
        <label className='block text-sm text-white/70 mb-2'>
          <span className='text-white'>Phone</span>
        </label>
        <div className='flex w-full'>
          <div className='relative flex-shrink-0 w-28'>
            <select
              value={country}
              onChange={e => handleCountryChange(e.target.value)}
              className={`h-12 w-full rounded-l-2xl border-r ${
                error ? 'border-red-500' : 'border-white/15'
              } bg-white/5 pl-3 pr-6 text-white text-sm appearance-none focus:outline-none`}
            >
              {countries.map(c => (
                <option key={c.isoCode} value={c.isoCode} className='bg-white/5'>
                  +{c.phonecode} {c.isoCode}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <svg className='h-4 w-4 text-white/70' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </div>
          </div>
          <input
            type='tel'
            value={getLocalPhone(phone)}
            onChange={e => handlePhoneChange(e.target.value.replace(/[^\d\s]/g, ''))}
            required={required}
            placeholder='415 555 2671'
            className={`h-12 flex-1 w-full rounded-r-2xl border ${
              error ? 'border-red-500 border-l-0' : 'border-white/15 border-l-0'
            } bg-white/5 px-4 text-white focus:outline-none`}
          />
        </div>
        {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
      </div>
    );
  }
);

PhoneInputField.displayName = 'PhoneInputField';

export default PhoneInputField;
