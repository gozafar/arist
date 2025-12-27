"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
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

const GalleryForm = ({ onSubmit, isLoading = false, categories }: GalleryFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string>("");
  const [pendingName, setPendingName] = useState("");
  const triggerFileSelect = () => fileInputRef.current?.click();
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const file = files[0];
    if (!file) return;
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const addPendingImage = () => {
    if (!pendingFile) {
      toast.error("Please select an image");
      return;
    }
    if (!pendingName.trim()) {
      toast.error("Please enter an image name");
      return;
    }
    const trimmedName = pendingName.trim();

    const isDuplicateFile = imageFiles.some(
      (file) => file.name === pendingFile.name && file.size === pendingFile.size
    );
    if (isDuplicateFile) {
      toast.error("This image is already added");
      return;
    }

    const isDuplicateName = imageNames.some(
      (name) => name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicateName) {
      toast.error("Image name must be unique");
      return;
    }

    setImageFiles([...imageFiles, pendingFile]);
    setImagePreviews([...imagePreviews, pendingPreview]);
    setImageNames([...imageNames, trimmedName]);
    setPendingFile(null);
    setPendingPreview("");
    setPendingName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setImageNames(imageNames.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    onSubmit({
      categoryId,
      images: imageFiles,
      imageNames: imageNames.slice(0, imageFiles.length),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <input
        type="text"
        placeholder="Image Name"
        value={pendingName}
        onChange={(e) => setPendingName(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />

      <div className="space-y-3">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={triggerFileSelect}
          className="relative h-48 overflow-hidden rounded-2xl border border-gray-200 cursor-pointer"
        >
          {pendingPreview ? (
            <img src={pendingPreview} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              Drag and drop file here or browse
            </div>
          )}
          {pendingPreview && (
            <button
              type="button"
              onClick={() => {
                setPendingFile(null);
                setPendingPreview("");
                setPendingName("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-xs text-white"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={addPendingImage}
          disabled={!pendingPreview}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm disabled:opacity-50"
        >
          Add
        </button>
        {/* <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          Browse file
        </button> */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Preview Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {imagePreviews.map((src, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg border border-gray-200">
            <img src={src} alt="" className="h-32 w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-2 top-2 rounded bg-white/80 p-1 text-xs text-red-600"
            >
              🗑
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-xs text-white">
              {imageNames[index] || "Untitled"}
            </div>
          </div>
        ))}
      </div>

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
