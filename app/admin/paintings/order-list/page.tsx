"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/api/public";
import Pagination from "@/components/Pagination";

interface Painting {
  _id: string;
  title: string;
  price: number;
  image: string;
  availability: string;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  paintingId: string | Painting;
  createdAt: string;
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all orders
      const response = await getAllOrders();
      console.log(response,"======>39")
      
      if (response.success ) {
        setOrders(response.payload);
        setCurrentPage(1);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error fetching orders');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const startIndex = (clampedPage - 1) * PAGE_SIZE;
  const visibleOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="section-heading">Order List</h1>
          <button
            onClick={fetchOrders}
            className="button-primary text-xs"
          >
            Refresh
          </button>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-white/70">Loading orders...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/70">No orders found</p>
              </div>
            ) : (
              <div className="card-glass rounded-3xl p-4 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-white/80">
                    <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/60">
                      <tr>
                        <th className="px-4 py-3">S.No</th>
                        <th className="px-4 py-3">Order</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Painting</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {visibleOrders.map((order, index) => {
                        const paintingTitle =
                          typeof order.paintingId === "object" ? order?.paintingId?.title : "Painting";
                        const paintingPrice =
                          typeof order.paintingId === "object" ? order?.paintingId?.price : null;
                        const serialNumber = startIndex + index + 1;
                        return (
                          <tr
                            key={order._id}
                            className="cursor-pointer transition-colors hover:bg-white/5"
                            onClick={() => openOrderDetails(order)}
                          >
                            <td className="px-4 py-3 text-white/70">{serialNumber}</td>
                            <td className="px-4 py-3 font-semibold text-white">#{order._id.slice(-8)}</td>
                            <td className="px-4 py-3">{order.user.name}</td>
                            <td className="px-4 py-3">{order.user.email}</td>
                            <td className="px-4 py-3">{paintingTitle}</td>
                            <td className="px-4 py-3">
                              {paintingPrice !== null ? `$${paintingPrice}` : "--"}
                            </td>
                            <td className="px-4 py-3">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openOrderDetails(order);
                                }}
                                className="button-outline text-xs"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-white/50">Tip: click any row to view full details.</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && orders.length > PAGE_SIZE && (
          <div className="mt-6">
            <Pagination
              total={orders.length}
              perPage={PAGE_SIZE}
              currentPage={clampedPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
              <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Order details</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    Order #{selectedOrder._id.slice(-8)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()} ·{" "}
                    {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Customer
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase text-slate-400">Full name</p>
                      <p className="text-base font-semibold text-slate-900">{selectedOrder.user.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-400">Email</p>
                      <p>{selectedOrder.user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-400">Phone</p>
                      <p>{selectedOrder.user.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-400">Shipping address</p>
                      <p>{selectedOrder.user.address}</p>
                      <p>
                        {selectedOrder.user.city}, {selectedOrder.user.state} {selectedOrder.user.postal}
                      </p>
                      <p>{selectedOrder.user.country}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Order
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase text-slate-400">Order ID</p>
                      <p className="break-all">{selectedOrder._id}</p>
                    </div>
                    {typeof selectedOrder.paintingId === "object" ? (
                      <>
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3">
                          <img
                            src={selectedOrder?.paintingId?.image}
                            alt={selectedOrder?.paintingId?.title}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                          <div>
                            <p className="text-xs uppercase text-slate-400">Painting</p>
                            <p className="text-base font-semibold text-slate-900">{selectedOrder?.paintingId?.title}</p>
                            <p className="text-sm text-slate-600">${selectedOrder?.paintingId?.price}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              selectedOrder?.paintingId?.availability === "in-stock"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-600"
                            }`}
                          >
                            {selectedOrder?.paintingId?.availability}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                            Original artwork
                          </span>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-xs uppercase text-slate-400">Painting ID</p>
                        <p>{selectedOrder?.paintingId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
