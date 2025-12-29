"use client";

import Button from "./Button";
import { useCart } from "@/context/CartContext";
import type { PaintingDTO } from "@/lib/dto";

const AddToCartButton = ({ painting, disabled }: { painting: PaintingDTO; disabled?: boolean }) => {
  const { addToCart } = useCart();
  return (
    <Button onClick={() => addToCart(painting)} className="px-6" disabled={disabled || painting.availability === "sold"}>
      {disabled || painting.availability === "sold" ? "Sold" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
