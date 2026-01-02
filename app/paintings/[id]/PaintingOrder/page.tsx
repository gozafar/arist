'use client';
import AddressForm from '@/components/AddressForm';
// import Button from "@/components/Button";
// import { ApiResponseError } from "@/lib/api/client";
import { createPaintingOrder } from '@/lib/api/public';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal: string;
  paintingId: string;
}

export default function ContactPainting() {
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOrderSubmit = async (formData: Omit<OrderData, 'paintingId'>) => {
    setIsLoading(true);
    try {
      // Get painting ID from URL
      const paintingId = window.location.pathname.split('/')[2];

      // Combine form data with painting ID
      const orderData: OrderData = {
        ...formData,
        paintingId,
      };

      // Submit to API
      const response = await createPaintingOrder(orderData);

      if (response.success) {
        setFormKey(prev => prev + 1);
        toast.success('Order created successfully');
      } else {
        toast.error('Order not created, something is wrong');
      }
    } catch (error: unknown) {
      console.error('Order submission error:', error);

      // Show toast notification
      const errorMessage = (error as Error)?.message || 'An error occurred';
      toast.error(errorMessage);

      // Don't re-throw - just let the error be handled by the toast
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='section-heading'>Checkout</h1>
        <Link href='/paintings' className='button-outline text-xs'>
          Back
        </Link>
      </div>
      <div className='flex justify-center'>
        <div className='w-full max-w-2xl'>
          <div className='card-glass rounded-3xl p-6'>
            <h2 className='font-display text-2xl'>Shipping details</h2>
            <p className='mt-1 text-sm text-white/70'>We will confirm shipping timelines after payment.</p>
            <div className='mt-6'>
              <AddressForm key={`address-form-${formKey}`} onSubmit={handleOrderSubmit} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
