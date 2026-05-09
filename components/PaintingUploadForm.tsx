'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import InputField from './InputField';
import TextArea from './TextArea';
import PriceInput from './PriceInput';
import SubmitButton from './SubmitButton';
import ImagePreview from './ImagePreview';
import { usePaintings, NewPaintingInput } from '@/context/PaintingContext';
import clsx from 'clsx';

const initialState: Omit<NewPaintingInput, 'price'> & { price: number | '' } = {
  title: '',
  description: '',
  price: '',
  medium: '',
  size: '',
  year: new Date().getFullYear(),
  availability: 'in-stock',
  image: '',
  tags: [],
  categoryId: '',
  height: 0,
  width: 0,
  imageWidth: 0,
  imageHeight: 0,
};

const PaintingUploadForm = () => {
  const { addPainting } = usePaintings();
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState<string>('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setForm(prev => ({ ...prev, image: result }));
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (key: keyof typeof form, value: string | number | '') => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.image) newErrors.image = 'Image is required';
    if (form.price === '' || Number.isNaN(Number(form.price))) newErrors.price = 'Price is required';
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) {
      setStatus({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    const payload: NewPaintingInput = {
      ...form,
      price: Number(form.price),
      availability: form.availability ?? 'in-stock',
      year: form.year || new Date().getFullYear(),
    };

    addPainting(payload);
    setStatus({ type: 'success', message: 'Painting added to your gallery.' });
    setForm(initialState);
    setPreview('');
  };

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='space-y-4'>
          <InputField
            label='Painting title'
            placeholder='Monsoon Script'
            value={form.title}
            onChange={e => handleChange('title', e)}
            required
          />
          <TextArea
            label='Description'
            placeholder='A few lines about the piece'
            rows={4}
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
          />
          <div className='grid gap-4 md:grid-cols-2'>
            <PriceInput value={form.price} onChange={val => handleChange('price', val)} />
            <InputField
              label='Medium'
              placeholder='Acrylic on canvas'
              value={form.medium}
              onChange={e => handleChange('medium', e)}
            />
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <InputField
              label='Size / Dimensions'
              placeholder='30 x 40 in'
              value={form.size}
              onChange={e => handleChange('size', e)}
            />
            <InputField
              label='Year'
              type='number'
              value={form.year?.toString() || ''}
              onChange={e => handleChange('year', Number(e))}
              min={2000}
              max={new Date().getFullYear() + 1}
            />
          </div>
          <label className='block text-sm'>
            <span className='mb-2 block text-white'>Availability</span>
            <select
              value={form.availability}
              onChange={e => handleChange('availability', e.target.value)}
              className='w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60'
            >
              <option value='in-stock' className='bg-black text-white'>
                In Stock
              </option>
              <option value='sold' className='bg-black text-white'>
                Sold
              </option>
            </select>
          </label>
        </div>
        <div className='space-y-4'>
          <label className='block text-sm'>
            <span className='mb-2 block text-white'>Painting image</span>
            <input
              type='file'
              accept='image/*'
              onChange={handleImage}
              className='w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-white/80 file:mr-4 file:rounded-xl file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1 file:text-white'
            />
            {errors.image && <p className='mt-2 text-xs text-red-300'>{errors.image}</p>}
          </label>
          <ImagePreview src={preview || form.image} alt={form.title || 'New painting'} />
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <SubmitButton className='button-primary'>Upload painting</SubmitButton>
        {status?.message && (
          <span className={clsx('text-sm', status.type === 'success' ? 'text-green-200' : 'text-red-300')}>
            {status.message}
          </span>
        )}
      </div>
      {errors.title && <p className='text-sm text-red-300'>{errors.title}</p>}
      {errors.price && <p className='text-sm text-red-300'>{errors.price}</p>}
    </form>
  );
};

export default PaintingUploadForm;
