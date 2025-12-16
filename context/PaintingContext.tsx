"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Painting, paintings as seedPaintings } from "@/data/paintings";

type NewPaintingInput = Omit<Painting, "id" | "year"> & { year?: number };

type PaintingContextValue = {
  paintings: Painting[];
  addPainting: (painting: NewPaintingInput) => void;
  updatePainting: (id: string, painting: Partial<NewPaintingInput>) => void;
  deletePainting: (id: string) => void;
  toggleAvailability: (id: string) => void;
};

const STORAGE_KEY = "anand-paintings";

const PaintingContext = createContext<PaintingContextValue | undefined>(undefined);

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `painting-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const PaintingProvider = ({ children }: { children: ReactNode }) => {
  const [paintings, setPaintings] = useState<Painting[]>(seedPaintings);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Painting[];
        if (Array.isArray(parsed) && parsed.length) {
          setPaintings(parsed);
        }
      } catch {
        // Ignore malformed data
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paintings));
    }
  }, [paintings]);

  const addPainting = (painting: NewPaintingInput) => {
    const newPainting: Painting = {
      ...painting,
      year: painting.year ?? new Date().getFullYear(),
      id: generateId(),
      tags: painting.tags ?? [],
      availability: painting.availability ?? "in-stock"
    };
    setPaintings((prev) => [newPainting, ...prev]);
  };

  const updatePainting = (id: string, painting: Partial<NewPaintingInput>) => {
    setPaintings((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...painting,
              year: painting.year ?? p.year,
              availability: painting.availability ?? p.availability
            }
          : p
      )
    );
  };

  const deletePainting = (id: string) => {
    setPaintings((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setPaintings((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, availability: p.availability === "sold" ? "in-stock" : "sold" }
          : p
      )
    );
  };

  const value = useMemo(
    () => ({ paintings, addPainting, updatePainting, deletePainting, toggleAvailability }),
    [paintings]
  );

  return <PaintingContext.Provider value={value}>{children}</PaintingContext.Provider>;
};

export const usePaintings = () => {
  const ctx = useContext(PaintingContext);
  if (!ctx) throw new Error("usePaintings must be used within PaintingProvider");
  return ctx;
};

export type { NewPaintingInput };
