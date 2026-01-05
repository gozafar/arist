'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import clsx from 'clsx';
import InputField from '@/components/InputField';
import PriceInput from '@/components/PriceInput';
import SubmitButton from '@/components/SubmitButton';
import ImagePreview from '@/components/ImagePreview';
import { NewPaintingInput } from '@/context/PaintingContext';
import { adminGetCategories } from '@/lib/api/admin';
import MDEditor from '@uiw/react-md-editor';
import { toast } from 'react-toastify';

interface Category {
  id: string;
  categoryName: string;
}

export type AdminPaintingFormProps = {
  initial?: NewPaintingInput & { id?: string };
  onSubmit: (payload: FormData) => void;
  mode?: 'create' | 'edit';
};

const emptyState: NewPaintingInput & { categoryId?: string } = {
  title: '',
  description: '',
  price: 0,
  medium: '',
  size: '',
  height: 0,
  width: 0,
  imageWidth: 0,
  imageHeight: 0,
  year: new Date().getFullYear(),
  availability: 'in-stock',
  image: '',
  tags: [],
  categoryId: '',
};

const getInitialForm = (initial?: NewPaintingInput & { id?: string }) => ({
  ...emptyState,
  ...initial,
  price: initial?.price ?? 0,
  categoryId: initial?.categoryId ?? '',
});
const AdminPaintingForm = ({ initial, onSubmit, mode = 'create' }: AdminPaintingFormProps) => {
  const [form, setForm] = useState<NewPaintingInput & { categoryId?: string }>(() => getInitialForm(initial));
  const [preview, setPreview] = useState<string>(() => initial?.image ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await adminGetCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
        setStatus({ type: 'error', message: 'Failed to load categories' });
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!initial) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setForm(getInitialForm(initial));
      setPreview(initial.image ?? '');
      setImageFile(null);
    });
    return () => {
      cancelled = true;
    };
  }, [initial]);

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the actual file for FormData upload
    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);

    // 3️⃣ Get image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.src = objectUrl;

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const sizeBytes = file.size;

      setForm(prev => ({
        ...prev,
        imageWidth: width,
        imageHeight: height,
        imageSize: sizeBytes,
      }));

      // URL.revokeObjectURL(objectUrl);
    };
  };

  const handleChange = (key: keyof (NewPaintingInput & { categoryId?: string }), value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSizeChange = (value: string) => {
    // Allow empty value
    if (!value.trim()) {
      handleChange('size', '');
      return;
    }

    // Only allow numbers, spaces, and * or ×
    const cleanValue = value.replace(/[^0-9\s×*]/gi, '');

    // Normalize the input
    const normalized = cleanValue
      .replace(/[x*]/gi, '×') // Standardize to multiplication sign
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    handleChange('size', normalized);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!imageFile && !form.image) newErrors.image = 'Image is required';
    if (!form.price || Number.isNaN(Number(form.price))) newErrors.price = 'Price is required';
    if (!form.categoryId) newErrors.category = 'Category is required';

    // Size validation
    if (form.size) {
      const sizePattern = /^\d+(?:\.\d+)?\s*[×*]\s*\d+(?:\.\d+)?(?:\s*[×*]\s*\d+(?:\.\d+)?)*$/;
      if (!sizePattern.test(form.size.trim())) {
        newErrors.size = 'Enter size like "20*40" or "30 × 40"';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) {
      setStatus({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    setIsSubmitting(true); // Start loading

    // Create FormData for API call
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price', String(form.price));
    formData.append('medium', form.medium);
    formData.append('size', form.size);
    formData.append('year', String(form.year));
    formData.append('availability', form.availability);
    formData.append('categoryId', form.categoryId || '');
    formData.append('tags', JSON.stringify(form.tags));

    try {
      // Call onSubmit with FormData - backend will handle response
      await onSubmit(formData);

      if (mode === 'create') {
        setForm(emptyState);
        setPreview('');
        setImageFile(null);
      }
    } catch (error: unknown) {
      console.error('Form submission error:', error);

      // Show backend error message in toast
      let errorMessage = 'Failed to save painting. Please try again.';

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === 'string' && error) {
        errorMessage = error;
      }

      toast.error(errorMessage);
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='space-y-4'>
          <InputField
            label='Painting title'
            placeholder='Monsoon Script'
            value={form.title}
            onChange={value => handleChange('title', value)}
            required
          />

          <div className='grid gap-4 md:grid-cols-2'>
            <PriceInput value={form.price} onChange={val => handleChange('price', val)} />
            <InputField
              label='Medium'
              placeholder='Acrylic on canvas'
              value={form.medium}
              onChange={value => handleChange('medium', value)}
            />
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <InputField
                label='Size / Dimensions'
                placeholder='20*40 or 30 × 40'
                value={form.size}
                onChange={handleSizeChange}
              />
              {errors.size && <p className='mt-1 text-xs text-red-300'>{errors.size}</p>}
            </div>

            <InputField
              label='Year'
              type='number'
              value={form.year?.toString() || ''}
              onChange={value => handleChange('year', Number(value))}
              min={2015}
              max={new Date().getFullYear() + 1}
            />
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='block text-sm'>
              <span className='mb-2 block text-white'>Category</span>
              <select
                value={form.categoryId || ''}
                onChange={e => handleChange('categoryId', e.target.value)}
                className='w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60'
                required
              >
                <option value='' disabled>
                  Select a category
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.category && <p className='mt-1 text-xs text-red-300'>{errors.category}</p>}
            </label>
            <label className='block text-sm'>
              <span className='mb-2 block text-white'>Availability</span>
              <select
                value={form.availability}
                onChange={e => handleChange('availability', e.target.value)}
                className='w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60'
              >
                <option value='in-stock'>In Stock</option>
                <option value='sold'>Sold</option>
              </select>
            </label>
          </div>
        </div>
        <div className='space-y-4'>
          <label className='block text-sm'>
            <span className='mb-2 block text-white'>Painting image</span>
            <input
              type='file'
              accept='image/*'
              onChange={handleImage}
              className='w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-white/80 file:mr-4 file:rounded-xl file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1 file:text-black'
            />
            {errors.image && <p className='mt-2 text-xs text-red-300'>{errors.image}</p>}
          </label>
          <ImagePreview src={preview || form.image} alt={form.title || 'New painting'} />
        </div>
      </div>
      <div data-color-mode='light'>
        <MDEditor
          value={form.description}
          onChange={value => handleChange('description', value || '')}
          height={220}
          preview='edit'
          textareaProps={{
            placeholder: 'A few lines about the piece',
          }}
        />
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <SubmitButton className='button-primary'>{mode === 'create' ? 'Add painting' : 'Save changes'}</SubmitButton>
        {status?.message && (
          <span className={clsx('text-sm', status.type === 'success' ? 'text-green-200' : 'text-red-300')}>
            {status.message}
          </span>
        )}
      </div>
      {errors.title && <p className='text-sm text-red-300'>{errors.title}</p>}
      {errors.price && <p className='text-sm text-red-300'>{errors.price}</p>}
      {errors.category && <p className='text-sm text-red-300'>{errors.category}</p>}
    </form>
  );
};
export default AdminPaintingForm;
