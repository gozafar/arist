// components/InputField.tsx
'use client';

import React from 'react';

type InputFieldProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  min?: number | string;
  max?: number | string;
};

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, value, onChange, type = 'text', required = false, error, className = '', placeholder = '', min, max },
    ref
  ) => {
    return (
      <div className={className}>
        <label className='block text-sm text-white/70'>
          <span className='mb-2 block text-white'>{label}</span>
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            min={min}
            max={max}
            className={`w-full rounded-2xl border ${
              error ? 'border-red-500' : 'border-white/15'
            } bg-white/5 px-4 py-3 text-white`}
          />
        </label>
        {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
