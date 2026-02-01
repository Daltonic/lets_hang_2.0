// File: src/components/EventDetailsCard.tsx
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import ErrorMessage from './ErrorMessage';
import { validateDateTime, validateLocation, validateCost } from '../utils/validation';
import { formatCurrency } from '../utils/format';

interface ValidationErrors {
  dateTime?: string;
  location?: string;
  costPerPerson?: string;
}

const EventDetailsCard = ({
  dateTime,
  setDateTime,
  location,
  setLocation,
  costPerPerson,
  setCostPerPerson,
  validationErrors,
  setValidationErrors,
  focusedField,
  setFocusedField,
  setShowDatePicker
}: {
  dateTime: string;
  setDateTime: (s: string) => void;
  location: string;
  setLocation: (s: string) => void;
  costPerPerson: string;
  setCostPerPerson: (s: string) => void;
  validationErrors: ValidationErrors;
  setValidationErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void;
  focusedField: string | null;
  setFocusedField: (s: string | null) => void;
  setShowDatePicker: (b: boolean) => void;
}) => {
  const handleDateTimeChange = (value: string) => {
    setDateTime(value);
    const error = validateDateTime(value);
    setValidationErrors((prev) => ({ ...prev, dateTime: error }));
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    const error = validateLocation(value);
    setValidationErrors((prev) => ({ ...prev, location: error }));
  };

  const handleCostChange = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    setCostPerPerson(numericValue);
    const error = validateCost(numericValue);
    setValidationErrors((prev) => ({ ...prev, costPerPerson: error }));
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-2 border border-white/20">
      <div className="relative">
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <Calendar size={18} className="sm:w-5 sm:h-5 text-white/60 flex-shrink-0" />
          </div>
          <input
            type="text"
            placeholder="Date and time"
            value={dateTime}
            onChange={(e) => handleDateTimeChange(e.target.value)}
            onFocus={() => setFocusedField('dateTime')}
            onBlur={() => setFocusedField(null)}
            onClick={() => setShowDatePicker(true)}
            className={`w-full pl-7 sm:pl-8 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-black/0 rounded-xl text-white placeholder-white/50 border ${validationErrors.dateTime ? 'border-red-400' : focusedField === 'dateTime' ? 'border-white/40' : 'border-transparent'}
                            focus:outline-none transition-all text-sm sm:text-base cursor-pointer`}
          />
          <button
            onClick={() => setShowDatePicker(true)}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-white/20 bg-white/10 rounded-lg transition-all"
          >
            <Clock size={16} className="sm:w-4 sm:h-4 text-white" />
          </button>
        </div>
        <ErrorMessage error={validationErrors.dateTime} />
      </div>

      <div className="h-px bg-white/10" />

      <div>
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <MapPin size={18} className="sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
          </div>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => setFocusedField('location')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-7 sm:pl-8 pr-3 py-2.5 sm:py-3 bg-black/0 rounded-xl text-white placeholder-white/50 border ${validationErrors.location ? 'border-red-400' : focusedField === 'location' ? 'border-white/40' : 'border-transparent'}
                            focus:outline-none transition-all text-sm sm:text-base`}
          />
        </div>
        <ErrorMessage error={validationErrors.location} />
      </div>

      <div className="h-px bg-white/10" />

      <div>
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <DollarSign size={18} className="sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
          </div>
          <input
            type="text"
            placeholder="Cost per person"
            value={costPerPerson ? formatCurrency(costPerPerson) : ''}
            onChange={(e) => handleCostChange(e.target.value)}
            onFocus={() => setFocusedField('costPerPerson')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-7 sm:pl-8 pr-3 py-2.5 sm:py-3 bg-black/0 rounded-xl text-white placeholder-white/50 border ${validationErrors.costPerPerson ? 'border-red-400' : focusedField === 'costPerPerson' ? 'border-white/40' : 'border-transparent'}
                            focus:outline-none transition-all text-sm sm:text-base`}
          />
        </div>
        <ErrorMessage error={validationErrors.costPerPerson} />
      </div>
    </div>
  );
};

export default EventDetailsCard;