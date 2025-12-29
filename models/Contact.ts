import mongoose, { Schema, Document } from "mongoose";

// Contact status enum for admin management
export enum ContactStatus {
  NEW_LEAD = "NEW_LEAD",
  CONTACTED = "CONTACTED", 
  QUALIFIED = "QUALIFIED",
  PROPOSAL_SENT = "PROPOSAL_SENT",
  NEGOTIATION = "NEGOTIATION",
  WON = "WON",
  LOST = "LOST"
}

// Contact interface
export interface ContactDoc extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contact schema
const ContactSchema = new Schema<ContactDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 255,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      match: /^[+]?[\d\s\-\(\)]+$/,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: Object.values(ContactStatus),
      default: ContactStatus.NEW_LEAD,
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: "contacts",
  }
);

// Indexes for better query performance
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });

// Export model
const Contact = mongoose.models.Contact || mongoose.model<ContactDoc>("Contact", ContactSchema);

export default Contact;
