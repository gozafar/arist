"use client";

import { useEffect, useState } from "react";
import { getContacts, updateContact, deleteContact } from "@/lib/api/contact";
import { ContactResponse } from "@/lib/api/contact";
import { toast } from "react-toastify";
import DeleteModal from "@/components/DeleteModal";

export default function ContactManagementPage() {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContactResponse>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getContacts();
      setContacts(response.contacts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: ContactResponse) => {
    setEditingId(contact._id);
    setEditForm({
      status: contact.status
    });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      await updateContact(editingId, { status: editForm.status });
      setContacts(contacts.map(c => 
        c._id === editingId ? { ...c, status: editForm.status } as ContactResponse : c
      ));
      toast.success("Status updated successfully!");
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    setContactToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      await deleteContact(contactToDelete);
      setContacts(contacts.filter(c => c._id !== contactToDelete));
      toast.success("Contact deleted successfully!");
      setDeleteModalOpen(false);
      setContactToDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete contact";
      toast.error(errorMessage);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setContactToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-white/60">
        Loading contacts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchContacts} className="button-primary text-xs">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Admin</p>
          <h1 className="section-heading">Contact Messages</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Manage and respond to contact form submissions from visitors.
          </p>
        </div>
        <div className="flex gap-3 text-xs text-white/70">
          <span className="rounded-full bg-white/5 px-4 py-2">
            {contacts.length} messages
          </span>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 text-white/70">
          No contact messages found
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="card-glass rounded-2xl p-6"
            >
              {editingId === contact._id ? (
                // Edit Form - Status Only
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Status
                    </label>
                    <select
                      value={editForm.status || ""}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-white/30"
                    >
                      <option value="NEW_LEAD">New Lead</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="button-primary text-xs"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={handleCancel}
                      className="button-outline text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {contact.name}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-white/70">
                          Email: <span className="text-white">{contact.email}</span>
                        </p>
                        {contact.phone && (
                          <p className="text-white/70">
                            Phone: <span className="text-white">{contact.phone}</span>
                          </p>
                        )}
                        <p className="text-white/70">
                          Status: <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            contact.status === 'NEW_LEAD' ? 'bg-blue-500/20 text-blue-300' :
                            contact.status === 'CONTACTED' ? 'bg-yellow-500/20 text-yellow-300' :
                            contact.status === 'IN_PROGRESS' ? 'bg-orange-500/20 text-orange-300' :
                            contact.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {contact.status.replace('_', ' ')}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="button-outline text-xs"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-white/80 leading-relaxed">
                      {contact.message}
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-white/40">
                    Received: {new Date(contact.createdAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Contact Message"
        message="Are you sure you want to delete this contact message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}