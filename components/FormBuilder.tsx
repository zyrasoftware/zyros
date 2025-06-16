import React, { useState } from 'react';
import { FormConfig, FormField } from '../types/site';
import { Theme } from '../styles/themes';
import { Send, Check, X, Upload, AlertCircle } from './Icons';

interface FormBuilderProps {
  form: FormConfig;
  theme: Theme;
  onSubmit?: (data: Record<string, unknown>) => void;
}

interface FormData {
  [key: string]: string | string[] | File | null;
}

export default function FormBuilder({ form, theme, onSubmit }: FormBuilderProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (fieldId: string, value: string | string[] | File | null) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateField = (field: FormField, value: string | string[] | File | null): string => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }

    if (typeof value === 'string' && value && field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`;
      }
      
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must be no more than ${field.validation.maxLength} characters`;
      }
      
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        return `${field.label} format is invalid`;
      }
    }

    if (field.type === 'email' && typeof value === 'string' && value && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }

    return '';
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    form.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else if (form.action) {
        // Submit to external endpoint
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) {
            formDataToSubmit.append(key, value);
          } else if (Array.isArray(value)) {
            value.forEach(v => formDataToSubmit.append(key, v));
          } else if (value !== null) {
            formDataToSubmit.append(key, String(value));
          }
        });

        await fetch(form.action, {
          method: form.method || 'POST',
          body: formDataToSubmit,
        });
      }

      setIsSubmitted(true);
      setFormData({});
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-xl text-center`}>
        <div className={`w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-6`}>
          <Check className="w-8 h-8" />
        </div>
        <h3 className={`text-2xl font-bold ${theme.accent} mb-4`}>Thank You!</h3>
        <p className={`${theme.secondary} text-lg`}>
          {form.successMessage || 'Your form has been submitted successfully.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-xl`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-bold ${theme.accent} mb-4`}>
          {form.title}
        </h2>
        {form.description && (
          <p className={`text-lg ${theme.secondary}`}>
            {form.description}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id}>
            <FormFieldRenderer
              field={field}
              value={formData[field.id]}
              onChange={(value) => handleInputChange(field.id, value)}
              error={errors[field.id]}
              theme={theme}
            />
          </div>
        ))}

        {errors.submit && (
          <div className={`p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center text-red-500`}>
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              {form.submitText || 'Submit'}
              <Send className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

interface FormFieldRendererProps {
  field: FormField;
  value: string | string[] | File | null | undefined;
  onChange: (value: string | string[] | File | null) => void;
  error?: string;
  theme: Theme;
}

function FormFieldRenderer({ field, value, onChange, error, theme }: FormFieldRendererProps) {
  const baseInputClasses = `w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.background} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
    error ? 'border-red-500 focus:ring-red-500' : ''
  }`;

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={baseInputClasses}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={field.required}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter(v => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                />
                <span className={theme.text}>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 mr-3"
                  required={field.required}
                />
                <span className={theme.text}>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="relative">
            <input
              type="file"
              id={field.id}
              onChange={(e) => onChange(e.target.files?.[0] || null)}
              className="hidden"
              required={field.required}
            />
            <label
              htmlFor={field.id}
              className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed ${theme.border} rounded-xl cursor-pointer hover:${theme.accent} transition-all duration-300`}
            >
              <div className="text-center">
                <Upload className={`w-8 h-8 ${theme.secondary} mx-auto mb-2`} />
                <span className={theme.text}>
                  {value instanceof File ? value.name : field.placeholder || 'Choose file'}
                </span>
              </div>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label htmlFor={field.id} className={`block text-sm font-semibold ${theme.text} mb-2`}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && (
        <div className="flex items-center mt-2 text-red-500 text-sm">
          <X className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
} 