'use client';

import Image from 'next/image';
import { CartItem as CartItemType, useCart } from '@/context/CartContext';
import Button from './Button';

const CartItem = ({ item }: { item: CartItemType }) => {
  const { updateQuantity, removeFromCart, deleting, updatingId } = useCart();
  const isBusy = deleting || updatingId === item.painting.id;

  return (
    <div className='card-glass flex items-center gap-4 rounded-2xl p-4'>
      <div className='relative h-24 w-20 overflow-hidden rounded-xl'>
        <Image src={item.painting.image} alt={item.painting.title} fill className='object-cover' />
      </div>
      <div className='flex flex-1 flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <h3 className='font-display text-lg'>{item.painting.title}</h3>
          <p className='text-sand-200 font-semibold'>${(item.painting.price * item.quantity).toLocaleString()}</p>
        </div>
        <p className='text-sm text-white/60'>{item.painting.medium}</p>
        <div className='mt-2 flex items-center gap-3 text-sm text-white/80'>
          <label className='text-white/60' htmlFor={`qty-${item.painting.id}`}>
            Qty
          </label>
          <input
            id={`qty-${item.painting.id}`}
            type='number'
            min={1}
            value={item.quantity}
            onChange={e => updateQuantity(item.painting.id, Number(e.target.value))}
            className='w-16 rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-center text-white disabled:opacity-50'
            disabled={isBusy}
          />
          <Button
            variant='outline'
            className='px-4 py-2 text-xs disabled:opacity-60'
            onClick={() => removeFromCart(item.painting.id)}
            disabled={isBusy}
          >
            Remove
          </Button>
        </div>
        {isBusy && <p className='text-xs text-white/50'>Updating…</p>}
      </div>
    </div>
  );
};

export default CartItem;
