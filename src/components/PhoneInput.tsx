// File: src/components/PhoneInput.tsx
import { Lock, ArrowRight } from 'lucide-react';
import { formatPhoneNumber } from '../utils/format';
import { validatePhoneNumber } from '../utils/validation';
import ErrorMessage from './ErrorMessage';

interface ValidationErrors {
    phoneNumber?: string;
    eventName?: string;
    dateTime?: string;
    location?: string;
    cost?: string;
}

const PhoneInput = ({
    phoneNumber,
    setPhoneNumber,
    isPhoneLocked,
    validationErrors,
    setValidationErrors,
    handlePhoneNumberSubmit
}: {
    phoneNumber: string;
    setPhoneNumber: (s: string) => void;
    isPhoneLocked: boolean;
    validationErrors: ValidationErrors;
    setValidationErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void;
    handlePhoneNumberSubmit: () => void;
}) => {
    const handleChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        setPhoneNumber(formatted);
        const error = validatePhoneNumber(formatted);
        setValidationErrors((prev: ValidationErrors) => ({ ...prev, phoneNumber: error }));
    };

    return (
        <div>
            <div className="relative bg-black/10 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                    <Lock size={18} className="sm:w-5 sm:h-5 text-gray-300" />
                </div>
                <input
                    type="tel"
                    placeholder="Enter phone number to save the draft"
                    value={phoneNumber}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={isPhoneLocked}
                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-black/10 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white placeholder-white/50 border ${validationErrors.phoneNumber ? 'border-red-400' : 'border-white/20'}
                        focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base disabled:opacity-50`}
                />
                {!isPhoneLocked && (
                    <button
                        onClick={handlePhoneNumberSubmit}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-white/20 bg-white/10 rounded-lg transition-all"
                    >
                        <ArrowRight size={18} className="sm:w-5 sm:h-5 text-white" />
                    </button>
                )}
            </div>
            <ErrorMessage error={validationErrors.phoneNumber} />
        </div>
    );
};

export default PhoneInput;
