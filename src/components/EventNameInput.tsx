import { MessageSquare } from 'lucide-react'
import React from 'react'

interface ValidationErrors {
  phoneNumber?: string
  eventName?: string
  dateTime?: string
  location?: string
  costPerPerson?: string
}

interface EventNameInputProps {
  eventName: string
  setEventName: (s: string) => void
  validationErrors: ValidationErrors
  setValidationErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void
}

export const EventNameInput: React.FC<EventNameInputProps> = ({
  eventName,
  setEventName,
  validationErrors,
  setValidationErrors
}: EventNameInputProps) => {
  const handleChange = (value: string) => {
    setEventName(value)

    // Clear validation error when user starts typing
    if (validationErrors.eventName) {
      setValidationErrors(prev => ({
        ...prev,
        eventName: undefined
      }))
    }
  }

  return (
    <div>
      <div className="relative bg-black/10 backdrop-blur-sm rounded-xl sm:rounded-2xl">
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
          <MessageSquare size={18} className="sm:w-5 sm:h-5 text-gray-300" />
        </div>
        <input
          type="text"
          value={eventName}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Event name"
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-black/10 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base"
        />
        <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/40">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </div>
  )
}