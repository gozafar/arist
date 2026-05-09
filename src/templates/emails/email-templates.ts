import { paintingOrderConfirmationTemplate } from './PaintingOrderConfirmationTemplate';
import { contactUsTemplate } from './ContactUsTemplate';

export function getPaintingOrderHTML(order: {
  _id: string;
  user: { name: string; email: string; phone: string };
  createdAt: string;
  customSize?: string;
  customMessage?: string;
}) {
  return paintingOrderConfirmationTemplate(order);
}

export function getContactUsHTML(contact: { name: string; email: string; phone: string; message: string }) {
  return contactUsTemplate(contact);
}
