import Joi from 'joi';
import { ContactStatus } from '@/models/Contact';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: ContactStatus;
  adminNotes?: string;
}

// Joi schema for contact validation
export const contactSchema = Joi.object<ContactFormData>({
  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than 100 characters',
    'any.required': 'Name is required',
  }),

  email: Joi.string().trim().email().max(255).required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
    'string.max': 'Email must be less than 255 characters',
    'any.required': 'Email is required',
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[+]?[\d\s-()]+$/)
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'string.max': 'Phone number must be less than 20 characters',
    }),

  message: Joi.string().trim().min(10).max(2000).required().messages({
    'string.empty': 'Message is required',
    'string.min': 'Message must be at least 10 characters long',
    'string.max': 'Message must be less than 2000 characters',
    'any.required': 'Message is required',
  }),

  status: Joi.string()
    .optional()
    .valid(...Object.values(ContactStatus))
    .messages({
      'any.only': 'Invalid contact status',
    }),

  adminNotes: Joi.string().trim().max(500).optional().allow('').messages({
    'string.max': 'Admin notes must be less than 500 characters',
  }),
});

// Validate contact form using Joi
export const validateContactForm = (data: Partial<ContactFormData>) => {
  const { error, value } = contactSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0] as string,
      message: detail.message,
    }));

    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData: value,
  };
};

// Sanitize and prepare contact data using Joi
export const sanitizeContactData = (data: Partial<ContactFormData>): ContactFormData => {
  const { value } = contactSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  return {
    name: value.name || '',
    email: value.email || '',
    phone: value.phone || undefined,
    message: value.message || '',
    status: value.status || ContactStatus.NEW_LEAD,
    adminNotes: value.adminNotes || undefined,
  };
};

// Client-side field validation using Joi
export const validateField = (field: keyof ContactFormData, value: string | undefined): string | null => {
  const fieldSchema = contactSchema.extract(field);
  const { error } = fieldSchema.validate(value);

  return error ? error.details[0].message : null;
};

// Get Joi schema for specific field (useful for client-side validation)
export const getFieldSchema = (field: keyof ContactFormData) => {
  return contactSchema.extract(field);
};

// Joi schema for update validation (all fields optional)
export const updateContactSchema = Joi.object<ContactFormData>({
  name: Joi.string().trim().min(3).max(100).optional().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than 100 characters',
  }),

  email: Joi.string().trim().email().max(255).optional().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Invalid email format',
    'string.max': 'Email must be less than 255 characters',
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[+]?[\d\s-()]+$/)
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'string.max': 'Phone number must be less than 20 characters',
    }),

  message: Joi.string().trim().min(10).max(2000).optional().messages({
    'string.empty': 'Message cannot be empty',
    'string.min': 'Message must be at least 10 characters long',
    'string.max': 'Message must be less than 2000 characters',
  }),

  status: Joi.string()
    .optional()
    .valid(...Object.values(ContactStatus))
    .messages({
      'any.only': `Invalid contact status. Valid statuses are: ${Object.values(ContactStatus).join(', ')}`,
    }),

  adminNotes: Joi.string().trim().max(500).optional().allow('').messages({
    'string.max': 'Admin notes must be less than 500 characters',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

// Validate contact update using Joi
export const validateContactUpdate = (data: Partial<ContactFormData>) => {
  const { error, value } = updateContactSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0] as string,
      message: detail.message,
    }));

    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData: value,
  };
};

// Validate update field using Joi
export const validateUpdateField = (field: keyof ContactFormData, value: string | undefined): string | null => {
  const fieldSchema = updateContactSchema.extract(field);
  const { error } = fieldSchema.validate(value);

  return error ? error.details[0].message : null;
};
