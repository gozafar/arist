"use client";

import Image from "next/image";
import Button from "@/components/Button";
import type { PaintingDTO } from "@/lib/dto";

export type AdminPaintingTableProps = {
  paintings: PaintingDTO[];
  onEdit: (painting: PaintingDTO) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
};

const AdminPaintingTable = ({ paintings, onEdit, onDelete, onToggle }: AdminPaintingTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 text-slate-900">
          <tr>
            <th className="px-4 py-3">Artwork</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paintings.map((painting) => (
            <tr key={painting.id} className="border-t border-slate-200">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-12 overflow-hidden rounded-lg">
                    <Image
                      src={painting.image}
                      alt={painting.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="48px" // Matches the container width (w-12 = 3rem = 48px)
                      quality={75}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=="
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{painting.title}</p>
                    <p className="text-xs text-slate-500">{painting.medium}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">${painting.price.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${painting.availability === "sold"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                    }`}
                >
                  {painting.availability === "sold" ? "Sold" : "In Stock"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2 text-xs">
                  <Button type="button" variant="outline" className="px-3 py-1" onClick={() => onEdit(painting)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-3 py-1"
                    onClick={() => onToggle(painting.id)}
                  >
                    {painting.availability === "sold" ? "Mark In Stock" : "Mark Sold"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-3 py-1 text-red-200 hover:text-red-100"
                    onClick={() => onDelete(painting.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPaintingTable;
