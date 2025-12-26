"use client";

import { useRef, useState } from "react";
import Button from "@/components/Button";

interface Category {
  _id: string;
  categoryName: string;
}

interface GalleryFormProps {
  onSubmit: (data: {
    categoryId: string;
    images: File[];
    imageNames: string[];
  }) => void;
  isLoading?: boolean;
  categories: Category[];
}

const MAX_IMAGES = 3;

const GalleryForm = ({ onSubmit, isLoading = false, categories }: GalleryFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files).slice(0, MAX_IMAGES - imageFiles.length);

    const newFiles = [...imageFiles, ...selected];
    const newPreviews = [
      ...imagePreviews,
      ...selected.map((file) => URL.createObjectURL(file)),
    ];
    const newNames = [
      ...imageNames,
      ...selected.map(() => ""), // Initialize empty names for new images
    ];

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setImageNames(newNames);
    setError("");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setImageNames(imageNames.filter((_, i) => i !== index));
  };

  const handleImageNameChange = (index: number, name: string) => {
    const newNames = [...imageNames];
    newNames[index] = name;
    setImageNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) return setError("Please select a category");
    if (imageFiles.length === 0) return setError("Please upload at least one image");

    // Check if all image names are provided
    const emptyNameIndex = imageNames.findIndex((name, index) => index < imageFiles.length && !name.trim());
    if (emptyNameIndex !== -1) {
      return setError(`Image ${emptyNameIndex + 1} name is required`);
    }

    onSubmit({
      categoryId,
      images: imageFiles,
      imageNames: imageNames.slice(0, imageFiles.length),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Input */}
      <div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Image Names */}
      {(imageFiles.length > 0 ? imageFiles : [null]).map((_, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Image ${index + 1} Name`}
          value={imageNames[index] || ""}
          onChange={(e) => handleImageNameChange(index, e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-2"
        />
      ))}

      {/* Upload Box */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center text-gray-500"
      >
        <p>Drag and drop file here or</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 px-4 py-2 border rounded-md text-sm"
        >
          Browse file
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Preview Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {imagePreviews.map((src, index) => (
          <div key={index} className="relative border rounded-lg overflow-hidden h-32">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default GalleryForm;
