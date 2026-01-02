'use client';
import Link from 'next/link';
import AddressForm, { Address } from '@/components/AddressForm';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { checkout } from '@/lib/api/public';

const CheckoutPage = () => {
  const { items, subtotal } = useCart();

  const handleSubmit = async (address: Address) => {
    try {
      const order = await checkout({ shipping: address });
      sessionStorage.setItem('pending-order-id', order.orderId);
    } catch {
      // noop; proceed to payment screen for demo parity
    }
    window.location.href = '/payment';
  };

  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Checkout</h1>
        <Link href='/cart' className='button-outline text-xs'>
          Back to cart
        </Link>
      </div>
      <div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='card-glass rounded-3xl p-6'>
          <h2 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Shipping details</h2>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            We will confirm shipping timelines after payment.
          </p>
          <div className='mt-6'>
            <AddressForm onSubmit={handleSubmit} />
          </div>
        </div>
        <div className='card-glass rounded-3xl p-6'>
          <h2 className='font-display text-2xl'>Order summary</h2>
          <div className='mt-4 space-y-4 text-sm text-white/80'>
            {items.map(item => (
              <div key={item.painting.id} className='flex items-center justify-between'>
                <span>
                  {item.painting.title}
                  <span className='text-white/50'> × {item.quantity}</span>
                </span>
                <span>${(item.painting.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className='border-t border-white/10 pt-4 text-lg font-semibold text-sand-200'>
              <div className='flex justify-between'>
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
            </div>
            <Button className='w-full' onClick={() => handleSubmit({} as Address)}>
              Continue to payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
