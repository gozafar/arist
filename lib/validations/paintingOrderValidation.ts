import Joi from 'joi';

export interface PaintingOrderFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  paintingId: string;
}

// Joi schema for painting order validation
export const paintingOrderSchema = Joi.object<PaintingOrderFormData>({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
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
    .min(10)
    .max(20)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Invalid phone number format',
      'string.min': 'Phone number must be at least 10 digits long',
      'string.max': 'Phone number must be less than 20 characters',
      'any.required': 'Phone number is required',
    }),

  address: Joi.string().trim().min(5).max(200).required().messages({
    'string.empty': 'Address is required',
    'string.min': 'Address must be at least 5 characters long',
    'string.max': 'Address must be less than 200 characters',
    'any.required': 'Address is required',
  }),

  city: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'City is required',
    'string.min': 'City must be at least 2 characters long',
    'string.max': 'City must be less than 50 characters',
    'any.required': 'City is required',
  }),

  state: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'State is required',
    'string.min': 'State must be at least 2 characters long',
    'string.max': 'State must be less than 50 characters',
    'any.required': 'State is required',
  }),

  postal: Joi.string().trim().min(3).max(20).required().messages({
    'string.empty': 'Postal code is required',
    'string.min': 'Postal code must be at least 3 characters long',
    'string.max': 'Postal code must be less than 20 characters',
    'any.required': 'Postal code is required',
  }),

  country: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Country is required',
    'string.min': 'Country must be at least 2 characters long',
    'string.max': 'Country must be less than 50 characters',
    'any.required': 'Country is required',
  }),

  paintingId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Painting ID is required',
    'any.required': 'Painting ID is required',
  }),
});

// Validate painting order form using Joi
export const validatePaintingOrderForm = (data: Partial<PaintingOrderFormData>) => {
  const { error, value } = paintingOrderSchema.validate(data, {
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

// Sanitize and prepare painting order data using Joi
export const sanitizePaintingOrderData = (data: Partial<PaintingOrderFormData>): PaintingOrderFormData => {
  const { value } = paintingOrderSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  return {
    name: value.name || '',
    email: value.email || '',
    phone: value.phone || '',
    address: value.address || '',
    city: value.city || '',
    state: value.state || '',
    postal: value.postal || '',
    country: value.country || '',
    paintingId: value.paintingId || '',
  };
};

// Client-side field validation using Joi
export const validateOrderField = (field: keyof PaintingOrderFormData, value: string | undefined): string | null => {
  const fieldSchema = paintingOrderSchema.extract(field);
  const { error } = fieldSchema.validate(value);

  return error ? error.details[0].message : null;
};

// Get Joi schema for specific field (useful for client-side validation)
export const getOrderFieldSchema = (field: keyof PaintingOrderFormData) => {
  return paintingOrderSchema.extract(field);
};

// Additional validation for MongoDB ObjectId (paintingId)
export const validateMongoObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Validate painting order with additional business logic
export const validatePaintingOrderWithBusinessLogic = (data: Partial<PaintingOrderFormData>) => {
  // First run Joi validation
  const joiValidation = validatePaintingOrderForm(data);

  if (!joiValidation.isValid) {
    return joiValidation;
  }

  const errors: Array<{ field: string; message: string }> = [];

  // Additional business logic validation
  if (joiValidation.sanitizedData?.paintingId && !validateMongoObjectId(joiValidation.sanitizedData.paintingId)) {
    errors.push({
      field: 'paintingId',
      message: 'Invalid painting ID format',
    });
  }

  // Check if phone contains at least 10 digits
  if (joiValidation.sanitizedData?.phone) {
    const digitsOnly = joiValidation.sanitizedData.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      errors.push({
        field: 'phone',
        message: 'Phone number must contain at least 10 digits',
      });
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return joiValidation;
};
