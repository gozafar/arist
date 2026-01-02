"use client";

import Button from "./Button";
import { useRouter } from "next/navigation";
import type { PaintingDTO } from "@/lib/dto";

const AddToCartButton = ({ painting, disabled }: { painting: PaintingDTO; disabled?: boolean }) => {
  const router = useRouter();
  
  const handleClick = () => {
    // Navigate to the painting's order page
    router.push(`/paintings/${painting.id}/PaintingOrder`);
  };

  return (
    <Button 
      onClick={handleClick} 
      className="px-6" 
      disabled={disabled || painting.availability === "sold"}
    >
      {disabled || painting.availability === "sold" ? "Sold" : "Contact"}
    </Button>
  );
};

export default AddToCartButton;
