'use client';

import { useEffect, useState } from 'react';
import { getContacts, updateContact, deleteContact } from '@/lib/api/contact';
import { ContactResponse, GetContactsResponse } from '@/lib/api/contact';
import { toast } from 'react-toastify';
import GalleryModal from '@/components/admin/GalleryModal';
import AdminPagination from '@/components/admin/AdminPagination';
import Button from '@/components/Button';

const STATUS_OPTIONS = [
  { value: 'NEW_LEAD', label: 'New Lead' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CLOSED', label: 'Closed' },
];

export default function ContactManagementPage() {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactResponse | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'delete'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<GetContactsResponse['pagination']>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchContacts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchContacts = async (pageToFetch: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getContacts({ page: pageToFetch, limit: pagination.limit });
      setContacts(response.contacts || []);
      setPagination(response.pagination);
      setPage(response.pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId: string, status: string) => {
    try {
      setUpdatingId(contactId);
      await updateContact(contactId, { status });
      toast.success('Status updated successfully!');
      await fetchContacts(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = (contact: ContactResponse) => {
    setSelectedContact(contact);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  // const handleViewContact = (contact: ContactResponse) => {
  //   setSelectedContact(contact);
  //   setModalMode("view");
  //   setIsModalOpen(true);
  // };

  const confirmDelete = async (id: string) => {
    try {
      await deleteContact(id);
      toast.success('Contact deleted successfully!');
      await fetchContacts(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contact';
      toast.error(errorMessage);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  if (loading) {
    return <div className='flex justify-center py-24 text-white/60'>Loading contacts...</div>;
  }

  if (error) {
    return (
      <div className='text-center py-24'>
        <p className='text-red-400 mb-4'>{error}</p>
        <button onClick={() => fetchContacts(page)} className='button-primary text-xs'>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Admin</p>
          <h1 className='section-heading'>Contact Messages</h1>
          <p className='mt-3 max-w-2xl text-white/70'>Manage and respond to contact form submissions from visitors.</p>
        </div>
        <div className='flex gap-3 text-xs text-white/70'>
          <span className='rounded-full bg-white/5 px-4 py-2'>{pagination.total} messages</span>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className='text-center py-16 text-white/70'>No contact messages found</div>
      ) : (
        <div className='overflow-hidden rounded-2xl border border-white/10 bg-white/5'>
          <table className='w-full text-left text-sm text-white/80'>
            <thead className='bg-white/10 text-xs uppercase tracking-[0.2em] text-white/60'>
              <tr>
                <th className='px-5 py-3'>Name</th>
                <th className='px-5 py-3'>Email</th>
                <th className='px-5 py-3'>Phone</th>
                <th className='px-5 py-3'>Message</th>
                <th className='px-5 py-3'>Status</th>
                <th className='px-5 py-3'>Received</th>
                <th className='px-5 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact._id} className='border-t border-white/10'>
                  <td className='px-5 py-3 text-white font-medium'>{contact.name}</td>
                  <td className='px-5 py-3'>{contact.email}</td>
                  <td className='px-5 py-3'>{contact.phone || '—'}</td>
                  <td className='px-5 py-3 max-w-xs'>
                    <span className='line-clamp-2 text-white/80'>{contact.message}</span>
                  </td>
                  <td className='px-5 py-3'>
                    <select
                      value={contact.status}
                      onChange={e => handleStatusChange(contact._id, e.target.value)}
                      disabled={updatingId === contact._id}
                      className='w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-sm text-white outline-none transition focus:border-white/30 disabled:opacity-50'
                    >
                      {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-5 py-3 text-white/70'>{new Date(contact.createdAt).toLocaleString()}</td>
                  <td className='px-5 py-3 text-right'>
                    <Button
                      type='button'
                      variant='outline'
                      className='px-3 py-1 text-red-200 hover:text-red-100'
                      onClick={() => handleDelete(contact)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='px-5 pb-4'>
            <AdminPagination
              total={pagination.total}
              perPage={pagination.limit}
              currentPage={pagination.page}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      <GalleryModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDeleteContact={confirmDelete}
        mode={modalMode}
      />
    </div>
  );
}
