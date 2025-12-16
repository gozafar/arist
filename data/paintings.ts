export type Painting = {
  id: string;
  title: string;
  price: number;
  medium: string;
  size: string;
  year: number;
  description: string;
  image: string;
  tags: string[];
  availability: "in-stock" | "sold";
};

const baseImage = (sig: number) =>
  `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80&sig=${sig}`;

export const paintings: Painting[] = [
  {
    id: "aurora-echoes",
    title: "Aurora Echoes",
    price: 1800,
    medium: "Acrylic on canvas",
    size: "36 x 48 in",
    year: 2024,
    description: "Gestural strokes and translucent layers that capture dawn light folding over quiet water.",
    image: baseImage(1),
    tags: ["new", "large", "statement"],
    availability: "in-stock"
  },
  {
    id: "monsoon-script",
    title: "Monsoon Script",
    price: 1400,
    medium: "Acrylic on canvas",
    size: "30 x 40 in",
    year: 2023,
    description: "Rhythmic marks etched like handwriting in rain, a memory of coastal skies.",
    image: baseImage(2),
    tags: ["textural", "blue"],
    availability: "in-stock"
  },
  {
    id: "terracotta-hum",
    title: "Terracotta Hum",
    price: 900,
    medium: "Acrylic on canvas",
    size: "24 x 32 in",
    year: 2023,
    description: "Earthy tones layered with charcoal accents, a warm cadence for intimate rooms.",
    image: baseImage(3),
    tags: ["earth", "warm"],
    availability: "in-stock"
  },
  {
    id: "nocturne-thread",
    title: "Nocturne Thread",
    price: 1200,
    medium: "Acrylic on canvas",
    size: "28 x 36 in",
    year: 2022,
    description: "A quiet weave of obsidian, gold, and midnight indigo stitched across the canvas.",
    image: baseImage(4),
    tags: ["dark", "gold"],
    availability: "in-stock"
  },
  {
    id: "floral-static",
    title: "Floral Static",
    price: 750,
    medium: "Acrylic on canvas",
    size: "18 x 24 in",
    year: 2022,
    description: "Bloom-like bursts dissolved into electric, confident marks.",
    image: baseImage(5),
    tags: ["vibrant", "medium"],
    availability: "in-stock"
  },
  {
    id: "desert-ink",
    title: "Desert Ink",
    price: 1100,
    medium: "Acrylic on canvas",
    size: "26 x 32 in",
    year: 2021,
    description: "Minimal, calligraphic gestures floating over dune-inspired gradients.",
    image: baseImage(6),
    tags: ["minimal", "neutral"],
    availability: "sold"
  },
  {
    id: "lake-glass",
    title: "Lake Glass",
    price: 980,
    medium: "Acrylic on canvas",
    size: "22 x 28 in",
    year: 2021,
    description: "Soft pistachio and glassy blues, a luminous calm after rain.",
    image: baseImage(7),
    tags: ["calm", "green"],
    availability: "in-stock"
  },
  {
    id: "paper-ritual",
    title: "Paper Ritual",
    price: 620,
    medium: "Acrylic on canvas",
    size: "16 x 20 in",
    year: 2020,
    description: "Collage-like blocks and charcoal lines that feel like quiet rituals.",
    image: baseImage(8),
    tags: ["small", "collage"],
    availability: "in-stock"
  },
  // Additional works to reach 50 for pagination demo
  ...Array.from({ length: 42 }).map((_, idx) => {
    const number = idx + 9;
    return {
      id: `piece-${number.toString().padStart(2, "0")}`,
      title: `Quiet Field ${number}`,
      price: 600 + (number % 10) * 80,
      medium: "Acrylic on canvas",
      size: `${18 + (number % 5) * 2} x ${24 + (number % 6) * 2} in`,
      year: 2019 + ((number + 2) % 6),
      description: "Atmospheric abstraction with layered glazes and graphite marks.",
      image: baseImage(8 + number),
      tags: [number % 2 === 0 ? "calm" : "textural", number % 3 === 0 ? "blue" : "warm"],
      availability: number % 7 === 0 ? "sold" : "in-stock"
    } satisfies Painting;
  })
];
