"use client";

import { useEffect, useState } from "react";
import { getAllOrders, getOrderById } from "@/lib/api/public";
import { endpoints } from "@/lib/api/endpoints";

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
  };
  paintingId: string | Painting;
  createdAt: string;
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await getOrderById(orderId);
      if (response.success) {
        setSelectedOrder(response.data);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (err) {
      setError('Error fetching order details');
      console.error('Error:', err);
    }
  };

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
            <div className="grid gap-4">
              {orders.map((order) => (
                <div key={order._id} className="card-glass rounded-3xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Order #{order._id.slice(-8)}</h3>
                      <p className="text-sm text-white/70">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => fetchOrderDetails(order._id)}
                      className="button-outline text-xs"
                    >
                      View Details
                    </button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-white mb-2">Customer Details</h4>
                      <div className="space-y-1 text-sm text-white/80">
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p><strong>Phone:</strong> {order.user.phone}</p>
                        <p><strong>Address:</strong></p>
                        <p className="ml-4">{order.user.address}</p>
                        <p className="ml-4">{order.user.city}, {order.user.state} {order.user.postal}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Order Details</h4>
                      <div className="space-y-1 text-sm text-white/80">
                        {typeof order.paintingId === 'object' ? (
                          <>
                            <div className="mb-3">
                              <img 
                                src={order.paintingId.image} 
                                alt={order.paintingId.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            </div>
                            <p><strong>Painting:</strong> {order.paintingId.title}</p>
                            <p><strong>Price:</strong> ${order.paintingId.price}</p>
                            <p><strong>Availability:</strong> {order.paintingId.availability}</p>
                          </>
                        ) : (
                          <p><strong>Painting ID:</strong> {order.paintingId}</p>
                        )}
                        {/* <p><strong>Status:</strong> 
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                            Pending
                          </span>
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-glass rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-white mb-4">Customer Information</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <p><strong>Full Name:</strong> {selectedOrder.user.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.user.phone}</p>
                  <p><strong>Shipping Address:</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>{selectedOrder.user.address}</p>
                    <p>{selectedOrder.user.city}, {selectedOrder.user.state} {selectedOrder.user.postal}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Order Information</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  {typeof selectedOrder.paintingId === 'object' ? (
                    <>
                      <div className="mb-3">
                        <img 
                          src={selectedOrder.paintingId.image} 
                          alt={selectedOrder.paintingId.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                      <p><strong>Painting:</strong> {selectedOrder.paintingId.title}</p>
                      <p><strong>Price:</strong> ${selectedOrder.paintingId.price}</p>
                      <p><strong>Availability:</strong> {selectedOrder.paintingId.availability}</p>
                    </>
                  ) : (
                    <p><strong>Painting ID:</strong> {selectedOrder.paintingId}</p>
                  )}
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p><strong>Order Time:</strong> {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}