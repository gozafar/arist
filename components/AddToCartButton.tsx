"use client";

import Button from "./Button";
import { useCart } from "@/context/CartContext";
import { Painting } from "@/data/paintings";

const AddToCartButton = ({ painting, disabled }: { painting: Painting; disabled?: boolean }) => {
  const { addToCart } = useCart();
  return (
    <Button onClick={() => addToCart(painting)} className="px-6" disabled={disabled || painting.availability === "sold"}>
      {disabled || painting.availability === "sold" ? "Sold" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
