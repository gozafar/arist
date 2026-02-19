'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import { sendContactMessage } from '@/lib/api/public';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

const ContactClient = () => {
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const normalizePhone = (value: string) => value.replace(/[\s()-]/g, '');

  const isValidPhone = (value: string) => {
    const normalized = normalizePhone(value);
    return (
      /^\+852\d{8}$/.test(normalized) ||
      /^\+91\d{10}$/.test(normalized) ||
      /^\+1\d{10}$/.test(normalized) ||
      /^\+971\d{9}$/.test(normalized)
    );
  };

  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='mb-8 space-y-2'>
        <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Connect</p>
        <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Contact Rakhi</h1>
        <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
          For purchases or commissions, leave a note. Rakhi responds within one business day.
        </p>
      </div>

      <div className='grid gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
        <div className='card-glass rounded-3xl p-6'>
          {submitted ? (
            <div className='space-y-3 text-center'>
              <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand-500 text-black'>
                ✓
              </div>
              <h2 className='font-display text-2xl'>Message sent</h2>
              <p className='text-white/70'>Thank you for reaching out. Expect a reply soon.</p>
            </div>
          ) : (
            <form
              className='space-y-4 text-sm'
              onSubmit={async e => {
                e.preventDefault();
                const formData = new FormData(e?.currentTarget);
                const rawPhone = String(formData?.get('phone') || '');
                if (rawPhone && !isValidPhone(rawPhone)) {
                  setPhoneError('Phone must be +852XXXXXXXX, +91XXXXXXXXXX, +1XXXXXXXXXX, or +971XXXXXXXXX.');
                  return;
                }
                try {
                  const normalizedPhone = rawPhone ? normalizePhone(rawPhone) : undefined;
                  await sendContactMessage({
                    name: String(formData.get('name') || ''),
                    email: String(formData.get('email') || ''),
                    phone: normalizedPhone,
                    message: String(formData.get('message') || ''),
                  });
                  setSubmitted(true);
                  toast.success('Message sent successfully!');
                } catch (error: unknown) {
                  const apiError = error as ApiError;
                  const errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.error ||
                    apiError.message ||
                    'Failed to send message. Please try again.';

                  console.error('Contact form error:', apiError);
                  toast.error(errorMessage);
                  setSubmitted(false);
                }
              }}
            >
              <Input label='Name' name='name' placeholder='Your name' required />
              <div className='grid gap-4 md:grid-cols-2'>
                <Input label='Email' name='email' type='email' placeholder='you@example.com' required />
                <label className='block text-sm'>
                  <span className='mb-2 block text-white'>Phone</span>
                  <input
                    type='tel'
                    name='phone'
                    placeholder='Optional (e.g. +1XXXXXXXXXX)'
                    pattern='^\+?(?:852\d{8}|91\d{10}|1\d{10}|971\d{9})$'
                    title='Use +852XXXXXXXX, +91XXXXXXXXXX, +1XXXXXXXXXX, or +971XXXXXXXXX.'
                    className='w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60'
                    onChange={() => {
                      if (phoneError) setPhoneError('');
                    }}
                  />
                  {phoneError ? <p className='mt-2 text-xs text-red-300'>{phoneError}</p> : null}
                </label>
              </div>
              <label className='block text-sm'>
                <span className='mb-2 block text-white'>Message</span>
                <textarea
                  rows={5}
                  className='w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60'
                  placeholder="Tell me about the piece or commission you're interested in"
                  required
                  name='message'
                />
              </label>
              <Button type='submit' className='w-full md:w-auto'>
                Send message
              </Button>
            </form>
          )}
        </div>

        <div className='space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6'>
          <div className='space-y-4 text-white/70'>
            <div className='space-y-2'>
              <h2 className='text-lg md:text-xl font-semibold text-white my font-display'>Follow</h2>
            </div>
            <div className='space-y-2'>
              <p className='font-semibold text-white'>Social</p>
              <div className='flex gap-4'>
                <Link
                  href='https://www.instagram.com/rakhi_studio/'
                  className='button-outline text-xs'
                  target='_blank'
                  rel='noreferrer'
                >
                  Instagram
                </Link>
                {/* <a href="https://www.behance.net" className="button-outline text-xs" target="_blank" rel="noreferrer">
                  Facebook
                </a> */}
                <Link
                  href='https://www.linkedin.com/in/rakhi-vashisht-b373858/'
                  className='button-outline text-xs'
                  target='_blank'
                  rel='noreferrer'
                >
                  Linkdin
                </Link>
                <Link href='mailto:rakhistudio1010@gmail.com' className='button-outline text-xs'>
                  Email
                </Link>
              </div>
            </div>
            <div className='space-y-2 text-sm'>
              <h2 className='text-lg md:text-xl font-semibold text-white my font-display'>Studio</h2>
              <p className='max-w-2xl text-base leading-relaxed text-black/60 md:text-[14px]'>Tung Chung, Hong Kong</p>
              <p className='max-w-2xl text-base leading-relaxed text-black/60 md:text-[14px]'>
                <span className='font-bold'>Call:</span> +852 97236007 ,+91 9899757066
              </p>
              {/* <p className="text-white/60">Call: +91 9899757066</p> */}
            </div>
          </div>
          <div className='space-y-2 text-sm text-white/70'>
            <h2 className='text-lg md:text-xl font-semibold text-white my font-display'>Worldwide support</h2>
            {/* <p className='max-w-2xl text-base leading-relaxed text-black/60 md:text-[14px]'>
              <span className='font-bold'> UAE &amp; Dubai:</span> white-glove shipping and customs guidance.
            </p>
            <p className='max-w-2xl text-base leading-relaxed text-black/60 md:text-[14px]'>
              <span className='font-bold'>India:</span> studio pickups and insured domestic delivery.
            </p>
            <p className='max-w-2xl text-base leading-relaxed text-black/60 md:text-[14px]'>
              <span className='font-bold'> USA:</span> tracked international freight for collectors.
            </p> */}
            <p className='max-w-2xl text-base leading-relaxed text-black/60 md:text-[14px]'>
              <span className='font-bold'> Hong Kong:</span> Rakhi Vashisht, 29E, Coastal Skyline, Block 1, Tung Chung,
              Hong Kong
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({
  label,
  placeholder,
  type = 'text',
  required = false,
  name,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  name?: string;
}) => (
  <label className='block text-sm'>
    <span className='mb-2 block text-white'>{label}</span>
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      name={name}
      className='w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60'
    />
  </label>
);

export default ContactClient;
