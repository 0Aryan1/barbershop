// Form validation helpers
import { isValidEmail, isValidPhone, isValidName } from './helpers';

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!isValidPhone(phone)) return 'Please enter a valid phone number';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (!isValidName(name)) return 'Name must contain only letters and spaces';
  if (name.trim().length < 2) return 'Name must be at least 2 characters long';
  return '';
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return '';
};

export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`;
  }
  return '';
};

export const validateRange = (value, min, max, fieldName = 'Value') => {
  const numValue = Number(value);
  if (isNaN(numValue)) return `${fieldName} must be a number`;
  if (numValue < min) return `${fieldName} must be at least ${min}`;
  if (numValue > max) return `${fieldName} must be no more than ${max}`;
  return '';
};

export const validateRating = (rating) => {
  return validateRange(rating, 1, 5, 'Rating');
};

export const validateAppointmentForm = (formData) => {
  const errors = {};
  
  errors.name = validateName(formData.name);
  errors.email = validateEmail(formData.email);
  errors.phone = validatePhone(formData.phone);
  errors.service = validateRequired(formData.service, 'Service');
  errors.date = validateRequired(formData.date, 'Date');
  errors.time = validateRequired(formData.time, 'Time');
  
  return errors;
};

export const validateServiceForm = (formData) => {
  const errors = {};
  
  errors.name = validateRequired(formData.name, 'Service name');
  errors.description = validateRequired(formData.description, 'Description');
  errors.duration = validateRange(formData.duration, 5, 180, 'Duration');
  errors.price = validateRange(formData.price, 0, 1000, 'Price');
  errors.category = validateRequired(formData.category, 'Category');
  
  return errors;
};

export const validateShopForm = (formData) => {
  const errors = {};
  
  errors.name = validateRequired(formData.name, 'Shop name');
  errors.address = validateRequired(formData.address, 'Address');
  errors.phone = validatePhone(formData.phone);
  errors.email = validateEmail(formData.email);
  errors.description = validateMaxLength(formData.description, 500, 'Description');
  
  return errors;
};

export const validateUserProfile = (formData) => {
  const errors = {};
  
  errors.firstName = validateName(formData.firstName);
  errors.lastName = validateName(formData.lastName);
  errors.email = validateEmail(formData.email);
  errors.phone = validatePhone(formData.phone);
  
  return errors;
};

export const hasValidationErrors = (errors) => {
  return Object.values(errors).some(error => error && error.length > 0);
};

export const getFirstError = (errors) => {
  const errorValues = Object.values(errors).filter(error => error && error.length > 0);
  return errorValues.length > 0 ? errorValues[0] : '';
};