import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { validate } from '../validation/index';
import { medicationSchema } from '../validation/schemas';
import type { Frequency } from '../store/useStore';

interface FormData {
  name: string;
  dosage: string;
  stock: number;
  frequency: Frequency;
  scheduledTimes: string[];
  notes: string;
}

interface FormErrors {
  name?: string;
  dosage?: string;
  stock?: string;
  frequency?: string;
  scheduledTimes?: string;
  notes?: string;
  general?: string;
}

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'DAILY', label: 'Once Daily' },
  { value: 'TWICE_DAILY', label: 'Twice Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'AS_NEEDED', label: 'As Needed' },
];

const DEFAULT_TIMES: Record<Frequency, string[]> = {
  DAILY: ['08:00'],
  TWICE_DAILY: ['08:00', '20:00'],
  WEEKLY: ['08:00'],
  AS_NEEDED: [],
};

interface AddMedicationProps {
  onNavigate?: (view: 'dashboard' | 'reminders' | 'add-medication' | 'history') => void;
}

export const AddMedication: React.FC<AddMedicationProps> = ({ onNavigate }) => {
  const { addMedication } = useStore();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dosage: '',
    stock: 30,
    frequency: 'DAILY',
    scheduledTimes: ['08:00'],
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFrequencyChange = (frequency: Frequency) => {
    setFormData(prev => ({
      ...prev,
      frequency,
      scheduledTimes: DEFAULT_TIMES[frequency],
    }));
  };

  const handleTimeChange = (index: number, value: string) => {
    setFormData(prev => {
      const newTimes = [...prev.scheduledTimes];
      newTimes[index] = value;
      return { ...prev, scheduledTimes: newTimes };
    });
  };

  const addTimeSlot = () => {
    if (formData.scheduledTimes.length < 6) {
      setFormData(prev => ({
        ...prev,
        scheduledTimes: [...prev.scheduledTimes, '12:00'],
      }));
    }
  };

  const removeTimeSlot = (index: number) => {
    if (formData.scheduledTimes.length > 1) {
      setFormData(prev => ({
        ...prev,
        scheduledTimes: prev.scheduledTimes.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = (): boolean => {
    const result = validate(medicationSchema, {
      name: formData.name,
      dosage: formData.dosage,
      stock: formData.stock,
      frequency: formData.frequency,
      scheduledTimes: formData.scheduledTimes,
      notes: formData.notes || undefined,
    });

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.errors?.forEach(error => {
        const [field, message] = error.split(': ');
        if (field && message) {
          (newErrors as Record<string, string>)[field] = message;
        } else {
          newErrors.general = error;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      addMedication({
        name: formData.name.trim(),
        dosage: formData.dosage.trim(),
        stock: formData.stock,
        frequency: formData.frequency,
        scheduledTimes: formData.scheduledTimes,
        notes: formData.notes.trim() || undefined,
      });

      setFormData({
        name: '',
        dosage: '',
        stock: 30,
        frequency: 'DAILY',
        scheduledTimes: ['08:00'],
        notes: '',
      });
      setErrors({});
      
      onNavigate?.('reminders');
      
      // In a real app, we'd navigate back or show a success message
      alert('Medication added successfully!');
    } catch (error) {
      setErrors({ general: 'Failed to add medication. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <header className="py-8 px-4">
        <button 
          className="flex items-center gap-2 text-cta hover:text-sky-700 transition-colors mb-4 min-h-[48px]"
          style={{ fontSize: '18px' }}
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          Back
        </button>
        <h1 className="text-3xl font-semibold text-slate-800">Add Medication</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-4 space-y-6">
        {/* General Error */}
        {errors.general && (
          <div 
            className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4"
            role="alert"
          >
            {errors.general}
          </div>
        )}

        {/* Medication Name */}
        <div>
          <label 
            htmlFor="name" 
            className="block text-lg font-medium text-slate-700 mb-2"
            style={{ fontSize: '18px' }}
          >
            Medication Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Aspirin, Vitamin D"
            className={`w-full text-lg p-4 border-2 rounded-xl outline-none transition-colors duration-200 ${
              errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-cta'
            }`}
            style={{ fontSize: '18px', minHeight: '60px' }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-600 mt-2" style={{ fontSize: '16px' }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Dosage */}
        <div>
          <label 
            htmlFor="dosage" 
            className="block text-lg font-medium text-slate-700 mb-2"
            style={{ fontSize: '18px' }}
          >
            Dosage *
          </label>
          <input
            type="text"
            id="dosage"
            value={formData.dosage}
            onChange={e => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="e.g., 100mg, 2 tablets"
            className={`w-full text-lg p-4 border-2 rounded-xl outline-none transition-colors duration-200 ${
              errors.dosage ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-cta'
            }`}
            style={{ fontSize: '18px', minHeight: '60px' }}
            aria-invalid={!!errors.dosage}
            aria-describedby={errors.dosage ? 'dosage-error' : undefined}
          />
          {errors.dosage && (
            <p id="dosage-error" className="text-red-600 mt-2" style={{ fontSize: '16px' }}>
              {errors.dosage}
            </p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label 
            htmlFor="stock" 
            className="block text-lg font-medium text-slate-700 mb-2"
            style={{ fontSize: '18px' }}
          >
            Pills Remaining *
          </label>
          <input
            type="number"
            id="stock"
            value={formData.stock}
            onChange={e => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            min="0"
            max="9999"
            className={`w-full text-lg p-4 border-2 rounded-xl outline-none transition-colors duration-200 ${
              errors.stock ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-cta'
            }`}
            style={{ fontSize: '18px', minHeight: '60px' }}
            aria-invalid={!!errors.stock}
            aria-describedby={errors.stock ? 'stock-error' : undefined}
          />
          {errors.stock && (
            <p id="stock-error" className="text-red-600 mt-2" style={{ fontSize: '16px' }}>
              {errors.stock}
            </p>
          )}
        </div>

        {/* Frequency */}
        <div>
          <label 
            className="block text-lg font-medium text-slate-700 mb-3"
            style={{ fontSize: '18px' }}
          >
            Frequency *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {FREQUENCY_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFrequencyChange(option.value)}
                className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 min-h-[60px] ${
                  formData.frequency === option.value
                    ? 'border-cta bg-sky-50 text-cta'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
                style={{ fontSize: '16px' }}
                aria-pressed={formData.frequency === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.frequency && (
            <p className="text-red-600 mt-2" style={{ fontSize: '16px' }}>
              {errors.frequency}
            </p>
          )}
        </div>

        {/* Scheduled Times */}
        {formData.frequency !== 'AS_NEEDED' && (
          <div>
            <label 
              className="block text-lg font-medium text-slate-700 mb-3"
              style={{ fontSize: '18px' }}
            >
              Reminder Times *
            </label>
            <div className="space-y-3">
              {formData.scheduledTimes.map((time, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="time"
                    value={time}
                    onChange={e => handleTimeChange(index, e.target.value)}
                    className={`flex-1 text-lg p-4 border-2 rounded-xl outline-none transition-colors duration-200 ${
                      errors.scheduledTimes ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-cta'
                    }`}
                    style={{ fontSize: '18px', minHeight: '60px' }}
                    aria-label={`Reminder time ${index + 1}`}
                  />
                  {formData.scheduledTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="p-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors min-w-[60px] min-h-[60px] flex items-center justify-center"
                      aria-label={`Remove time ${index + 1}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {formData.scheduledTimes.length < 6 && formData.frequency === 'TWICE_DAILY' && (
              <button
                type="button"
                onClick={addTimeSlot}
                className="mt-3 flex items-center gap-2 text-cta hover:text-sky-700 transition-colors min-h-[48px]"
                style={{ fontSize: '16px' }}
              >
                <Plus className="w-5 h-5" />
                Add Another Time
              </button>
            )}
            
            {errors.scheduledTimes && (
              <p className="text-red-600 mt-2" style={{ fontSize: '16px' }}>
                {errors.scheduledTimes}
              </p>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label 
            htmlFor="notes" 
            className="block text-lg font-medium text-slate-700 mb-2"
            style={{ fontSize: '18px' }}
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="e.g., Take with food, store in refrigerator"
            rows={3}
            maxLength={500}
            className={`w-full text-lg p-4 border-2 rounded-xl outline-none transition-colors duration-200 resize-none ${
              errors.notes ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-cta'
            }`}
            style={{ fontSize: '18px', minHeight: '100px' }}
            aria-invalid={!!errors.notes}
            aria-describedby={errors.notes ? 'notes-error' : undefined}
          />
          <div className="flex justify-between mt-1">
            {errors.notes && (
              <p id="notes-error" className="text-red-600" style={{ fontSize: '14px' }}>
                {errors.notes}
              </p>
            )}
            <p className="text-slate-400 ml-auto" style={{ fontSize: '14px' }}>
              {formData.notes.length}/500
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 min-h-[70px] ${
            isSubmitting
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
          style={{ fontSize: '20px' }}
        >
          {isSubmitting ? 'Adding...' : 'Add Medication'}
        </button>
      </form>
    </div>
  );
};
