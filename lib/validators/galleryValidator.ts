import Joi from 'joi';

// const objectIdSchema = Joi.string()
//   .pattern(/^[0-9a-fA-F]{24}$/)
//   .messages({
//     'string.pattern.base': 'Invalid ObjectId format'
//   });

// Gallery validation schemas
export const gallerySchemas = {
  createGallery: Joi.object({
    name: Joi.string().trim().min(1).max(200).required().messages({
      'string.empty': 'Gallery name cannot be empty',
      'string.min': 'Gallery name cannot be empty',
      'string.max': 'Gallery name cannot exceed 200 characters',
      'any.required': 'Gallery name is required'
    }),
    
    images: Joi.array().required().messages({
      'any.required': 'Images array is required'
    }),
    
    imageNames: Joi.array().items(
      Joi.string().trim().min(1).max(100).required().messages({
        'string.empty': 'Image name cannot be empty',
        'string.min': 'Image name cannot be empty',
        'string.max': 'Image name cannot exceed 100 characters',
        'any.required': 'Image name is required'
      })
    ).messages({
      'array.base': 'Image names must be an array',
      'any.required': 'Image names are required'
    })
  }),

  updateGallery: Joi.object({
    name: Joi.string().trim().min(1).max(200).optional().messages({
      'string.empty': 'Gallery name cannot be empty',
      'string.min': 'Gallery name cannot be empty',
      'string.max': 'Gallery name cannot exceed 200 characters'
    }),
    
    images: Joi.array().optional().messages({
      'array.min': 'At least one image is required',
      'array.max': 'Cannot upload more than 3 images'
    }),
    
    imageNames: Joi.array().items(
      Joi.string().trim().min(1).max(100).required().messages({
        'string.empty': 'Image name cannot be empty',
        'string.min': 'Image name cannot be empty',
        'string.max': 'Image name cannot exceed 100 characters',
        'any.required': 'Image name is required'
      })
    ).optional().messages({
      'array.base': 'Image names must be an array'
    })
  }),

  getGalleries: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      })
  })
};

// Separate file validation function
export const validateFiles = (files: File[]) => {
  const errors: string[] = [];
  
  // Validate files array
  switch (true) {
    case !files || !Array.isArray(files):
      errors.push('Images array is required');
      return { isValid: false, errors };
      
    case files.length === 0:
      errors.push('At least one image is required');
      return { isValid: false, errors };
      
    case files.length > 3:
      errors.push('Cannot upload more than 3 images');
      return { isValid: false, errors };
  }
  
  // Validate individual files
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  for (const file of files) {
    if (!file) {
      errors.push('Invalid file detected');
      continue;
    }
    
    // Switch on file validation cases
    switch (true) {
      case !validTypes.includes(file.type):
        errors.push(`Invalid file type: ${file.name}. Only JPEG, PNG, GIF, WebP allowed`);
        break;
        
      case file.size > maxSize:
        errors.push(`File too large: ${file.name}. Max 10MB allowed`);
        break;
        
      default:
        // File is valid
        break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation helper function
export const validateRequest = <T>(schema: Joi.ObjectSchema<T>, data: T): { isValid: boolean; errors: { [key: string]: string } | null; value: T | null } => {
  const { error, value } = schema.validate(data, {
    abortEarly: false, // Return all errors
    stripUnknown: false // Keep File objects intact
  });

  if (error) {
    const errors: { [key: string]: string } = {};
    error.details.forEach(detail => {
      const key = detail.path[0] as string;
      errors[key] = detail.message;
    });
    
    return {
      isValid: false,
      errors,
      value: null
    };
  }

  return {
    isValid: true,
    errors: null,
    value
  };
};
