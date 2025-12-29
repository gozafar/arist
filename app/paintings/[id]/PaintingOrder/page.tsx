"use client"
import AddressForm from "@/components/AddressForm";
import Button from "@/components/Button";
import { ApiResponseError } from "@/lib/api/client";
import { createPaintingOrder } from "@/lib/api/public";
import Link from "next/link";
import { toast } from "react-toastify";
import { useState } from "react";

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
  const [resetForm, setResetForm] = useState(false);

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
        setResetForm(true);
        toast.success("order created successfully")
      } else {
        toast.error("order not created something is wrong")
      }
    } catch (error) {
      if (error instanceof ApiResponseError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Order submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return(
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="section-heading">Checkout</h1>
        <Link href="/paintings" className="button-outline text-xs">
          Back
        </Link>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-glass rounded-3xl p-6">
          <h2 className="font-display text-2xl">Shipping details</h2>
          <p className="mt-1 text-sm text-white/70">We will confirm shipping timelines after payment.</p>
          <div className="mt-6">
            <AddressForm onSubmit={handleOrderSubmit} isLoading={isLoading} resetForm={resetForm} />
          </div>
        </div>
       
      </div>
    </div>
  )
}