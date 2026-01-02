"use client";

import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import clsx from "clsx";
import InputField from "@/components/InputField";
import TextArea from "@/components/TextArea";
import PriceInput from "@/components/PriceInput";
import SubmitButton from "@/components/SubmitButton";
import ImagePreview from "@/components/ImagePreview";
import { NewPaintingInput } from "@/context/PaintingContext";
import { adminGetCategories } from "@/lib/api/admin";

interface Category {
  id: string;
  categoryName: string;
}


export type AdminPaintingFormProps = {
  initial?: NewPaintingInput & { id?: string };
  onSubmit: (payload: FormData) => void;
  mode?: "create" | "edit";
};

const emptyState: NewPaintingInput & { categoryId?: string } = {
  title: "",
  description: "",
  price: 0,
  medium: "",
  size: "",
  year: new Date().getFullYear(),
  availability: "in-stock",
  image: "",
  tags: [],
  categoryId: ""
};

const AdminPaintingForm = ({ initial, onSubmit, mode = "create" }: AdminPaintingFormProps) => {
  const [form, setForm] = useState<NewPaintingInput & { categoryId?: string }>(initial ?? emptyState);
  const [preview, setPreview] = useState<string>(initial?.image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await adminGetCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
        setStatus({ type: "error", message: "Failed to load categories" });
      }
    };
    loadCategories();
  }, []);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Only set initial values on first render if they exist
      if (initial) {
        setForm(prev => ({
          ...prev,
          ...initial,
          price: initial.price || 0, // Ensure price is always a number
        }));
        if (initial.image) {
          setPreview(initial.image);
        }
      }
    } else if (initial) {
      // Only update if the initial prop changes and the values are actually different
      if (initial.title !== form.title || initial.image !== preview) {
        setForm(prev => ({
          ...prev,
          ...initial,
          price: initial.price || 0,
        }));
        if (initial.image !== preview) {
          setPreview(initial.image || "");
        }
      }
    }
  }, [initial]); // Only depend on initial prop

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Store the actual file for FormData upload
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (key: keyof (NewPaintingInput & { categoryId?: string }), value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!imageFile && !form.image) newErrors.image = "Image is required";
    if (!form.price || Number.isNaN(Number(form.price))) newErrors.price = "Price is required";
    if (!form.categoryId) newErrors.category = "Category is required";
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) {
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }


    
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
    
    // Call onSubmit with FormData
    onSubmit(formData);
    
    if (mode === "create") {
      setForm(emptyState);
      setPreview("");
      setImageFile(null);
    }
    setStatus({ type: "success", message: mode === "create" ? "Painting added." : "Painting updated." });
  };



  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <InputField
            label="Painting title"
            placeholder="Monsoon Script"
            value={form.title}
            onChange={(value) => handleChange("title", value)}
            required
          />
          <TextArea
            label="Description"
            placeholder="A few lines about the piece"
            rows={4}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <PriceInput value={form.price} onChange={(val) => handleChange("price", val)} />
            <InputField
              label="Medium"
              placeholder="Acrylic on canvas"
              value={form.medium}
              onChange={(value) => handleChange("medium", value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Size / Dimensions"
              placeholder="30 x 40 in"
              value={form.size}
              onChange={(value) => handleChange("size", value)}
            />
            <InputField
              label="Year"
              type="number"
              value={form.year?.toString() || ""}
              onChange={(value) => handleChange("year", Number(value))}
              min={2015}
              max={new Date().getFullYear() + 1}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-white">Category</span>
              <select
                value={form.categoryId || ""}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-300">{errors.category}</p>}
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-white">Availability</span>
              <select
                value={form.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
              >
                <option value="in-stock" className="bg-black text-white">
                  In Stock
                </option>
                <option value="sold" className="bg-black text-white">
                  Sold
                </option>
              </select>
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block text-white">Painting image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-white/80 file:mr-4 file:rounded-xl file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1 file:text-white"
            />
            {errors.image && <p className="mt-2 text-xs text-red-300">{errors.image}</p>}
          </label>
          <ImagePreview src={preview || form.image} alt={form.title || "New painting"} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton className="button-primary">{mode === "create" ? "Add painting" : "Save changes"}</SubmitButton>
        {status?.message && (
          <span className={clsx("text-sm", status.type === "success" ? "text-green-200" : "text-red-300")}>
            {status.message}
          </span>
        )}
      </div>
      {errors.title && <p className="text-sm text-red-300">{errors.title}</p>}
      {errors.price && <p className="text-sm text-red-300">{errors.price}</p>}
      {errors.category && <p className="text-sm text-red-300">{errors.category}</p>}
    </form>
  );
};

export default AdminPaintingForm;
