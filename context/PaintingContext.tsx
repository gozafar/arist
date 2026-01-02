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
  addPainting: (painting: NewPaintingInput | FormData) => void;
  updatePainting: (id: string, painting: Partial<NewPaintingInput> | FormData) => void;
  deletePainting: (id: string) => void;
  toggleAvailability: (id: string) => void;
  loaded: boolean;
};

const PaintingContext = createContext<PaintingContextValue | undefined>(undefined);

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

  const addPainting = (painting: NewPaintingInput | FormData) => {
    const create = async () => {
      try {
        const saved = await adminCreatePainting(painting as FormData);
        setPaintings((prev) => [saved, ...prev]);
      } catch (error) {
        // For FormData, we can't create a local fallback
        console.error('Failed to create painting:', error);
      }
    };
    void create();
  };

  const updatePainting = (id: string, painting: Partial<NewPaintingInput> | FormData) => {
    const apply = async () => {
      try {
        const updated = await adminUpdatePainting(id, painting);
        setPaintings((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch {
        setPaintings((prev) =>
          prev.map((p) => (p.id === id ? { ...p, updatedAt: new Date().toISOString() } : p))
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
    [paintings, loaded, addPainting, updatePainting, deletePainting, toggleAvailability]
  );

  return <PaintingContext.Provider value={value}>{children}</PaintingContext.Provider>;
};

export const usePaintings = () => {
  const ctx = useContext(PaintingContext);
  if (!ctx) throw new Error("usePaintings must be used within PaintingProvider");
  return ctx;
};

export type { NewPaintingInput };
