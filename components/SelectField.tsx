// components/SelectField.tsx
"use client";

import React from 'react';

type Option = { 
  value: string; 
  label: string 
};

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
};

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(({
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  error,
  className = '',
}, ref) => {
  return (
    <div className={className}>
      <label className="block text-sm text-white/70">
        <span className="mb-2 block text-white">{label}</span>
        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`w-full rounded-2xl border ${
            error ? "border-red-500" : "border-white/15"
          } bg-white/5 px-4 py-3 text-white disabled:opacity-50`}
        >
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField;