"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { PaintingDTO } from "@/lib/dto";
import { getPaintings } from "@/lib/api/public";
import {
  adminCreatePainting,
  adminDeletePainting,
  adminToggleAvailability,
  adminUpdatePainting
} from "@/lib/api/admin";

type Painting = PaintingDTO;

type NewPaintingInput = Omit<PaintingDTO, "id" | "createdAt" | "updatedAt" | "year"> & { year?: number };

type PaintingContextValue = {
  paintings: Painting[];
  addPainting: (painting: NewPaintingInput) => void;
  updatePainting: (id: string, painting: Partial<NewPaintingInput>) => void;
  deletePainting: (id: string) => void;
  toggleAvailability: (id: string) => void;
  loaded: boolean;
};

const PaintingContext = createContext<PaintingContextValue | undefined>(undefined);

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `painting-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const PaintingProvider = ({ children }: { children: ReactNode }) => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loaded, setLoaded] = useState(false);
  const fetched = useRef(false); // prevent double-fetch in React Strict Mode (dev)

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const load = async () => {
      try {
        const data = await getPaintings({ page: 1, limit: 200 });
        setPaintings(data.items);
      } catch {
        // fall back to empty list if API fails
        setPaintings([]);
      }
      setLoaded(true);
    };
    void load();
  }, []);

  const addPainting = (painting: NewPaintingInput) => {
    const create = async () => {
      const payload: PaintingDTO = {
        ...painting,
        year: painting.year ?? new Date().getFullYear(),
        id: generateId(),
        tags: painting.tags ?? [],
        availability: painting.availability ?? "in-stock",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      try {
        const saved = await adminCreatePainting(payload);
        setPaintings((prev) => [saved, ...prev]);
      } catch {
        setPaintings((prev) => [payload, ...prev]);
      }
    };
    void create();
  };

  const updatePainting = (id: string, painting: Partial<NewPaintingInput>) => {
    const apply = async () => {
      try {
        const updated = await adminUpdatePainting(id, painting);
        setPaintings((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch {
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
      }
    };
    void apply();
  };

  const deletePainting = (id: string) => {
    const run = async () => {
      try {
        await adminDeletePainting(id);
      } catch {
        // ignore delete failure for now
      }
      setPaintings((prev) => prev.filter((p) => p.id !== id));
    };
    void run();
  };

  const toggleAvailability = (id: string) => {
    const run = async () => {
      const current = paintings.find((p) => p.id === id);
      const nextAvailability = current?.availability === "sold" ? "in-stock" : "sold";
      try {
        const updated = await adminToggleAvailability(id, nextAvailability ?? "in-stock");
        setPaintings((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch {
        setPaintings((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, availability: nextAvailability ?? "in-stock" } : p
          )
        );
      }
    };
    void run();
  };

  const value = useMemo(
    () => ({ paintings, addPainting, updatePainting, deletePainting, toggleAvailability, loaded }),
    [paintings, loaded]
  );

  return <PaintingContext.Provider value={value}>{children}</PaintingContext.Provider>;
};

export const usePaintings = () => {
  const ctx = useContext(PaintingContext);
  if (!ctx) throw new Error("usePaintings must be used within PaintingProvider");
  return ctx;
};

export type { NewPaintingInput };
