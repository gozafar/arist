import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import Painting from "@/models/Painting";

type CartLine = {
  id: string;
  paintingId: string;
  quantity: number;
};

const COOKIE_KEY = "cart";

const readCart = async (): Promise<CartLine[]> => {
  const raw = (await cookies()).get?.(COOKIE_KEY)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCart = async (lines: CartLine[]) => {
  const store = await cookies();
  store.set?.({
    name: COOKIE_KEY,
    value: JSON.stringify(lines),
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
};

const totals = async (lines: CartLine[]) => {
  await dbConnect();
  const ids = lines.map((l) => l.paintingId);
  const paintings = await Painting.find({ _id: { $in: ids } }).lean();
  const map = new Map(
    paintings.map((p) => {
      const key = typeof p._id === "string" ? p._id : p._id?.toString?.();
      return [key, p] as const;
    })
  );
  return lines.reduce((sum, line) => {
    const painting = map.get(line.paintingId);
    if (!painting) return sum;
    return sum + painting.price * line.quantity;
  }, 0);
};

export const CartStore = {
  async get() {
    const lines = await readCart();
    await dbConnect();
    const ids = lines.map((l) => l.paintingId);
    const paintings = await Painting.find({ _id: { $in: ids } }).lean();
    const map = new Map(
      paintings.map((p) => {
        const key = typeof p._id === "string" ? p._id : p._id?.toString?.();
        return [key, p] as const;
      })
    );
    const items = lines
      .map((line) => {
        const painting = map.get(line.paintingId);
        if (!painting) return null;
        const { _id, ...rest } = painting as { _id?: unknown };
        const id =
          typeof _id === "string" ? _id : (painting as { _id?: { toString?: () => string } })._id?.toString?.();
        return {
          id: line.id,
          paintingId: line.paintingId,
          quantity: line.quantity,
          painting: { ...rest, id: id ?? line.paintingId }
        };
      })
      .filter(Boolean) as {
      id: string;
      paintingId: string;
      quantity: number;
      painting: unknown;
    }[];
    return {
      items,
      subtotal: await totals(lines)
    };
  },
  async add(paintingId: string, quantity = 1) {
    const lines = await readCart();
    const existing = lines.find((line) => line.paintingId === paintingId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      lines.push({ id: crypto.randomUUID(), paintingId, quantity });
    }
    await writeCart(lines);
    return this.get();
  },
  async update(paintingId: string, quantity: number) {
    const lines = (await readCart()).map((line) =>
      line.paintingId === paintingId ? { ...line, quantity: Math.max(1, quantity) } : line
    );
    await writeCart(lines);
    return this.get();
  },
  async remove(paintingId: string) {
    const lines = (await readCart()).filter((line) => line.paintingId !== paintingId);
    await writeCart(lines);
    return this.get();
  },
  async clear() {
    await writeCart([]);
    return this.get();
  }
};
