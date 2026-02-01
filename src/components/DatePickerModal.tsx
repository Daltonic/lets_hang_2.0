// File: src/components/DatePickerModal.tsx
import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const DatePickerModal = ({
  showDatePicker,
  setShowDatePicker,
  selectedDate,
  selectedTime,
  handleTimeChange,
  handleDateSelect
}: {
  showDatePicker: boolean;
  setShowDatePicker: (b: boolean) => void;
  selectedDate: Date | null;
  selectedTime: string;
  handleTimeChange: (t: string) => void;
  handleDateSelect: (d: Date) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  if (!showDatePicker) return null;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

    // Empty cells
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          className={`h-12 w-12 rounded-xl text-sm font-medium transition-all flex items-center justify-center
                    ${isToday ? 'bg-white/20 ring-2 ring-white/60' : ''}
                    ${isSelected
              ? 'bg-white text-black font-bold shadow-lg'
              : 'text-white/80 hover:bg-white/20'
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setShowDatePicker(false)}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto max-w-md w-full mx-6">
          <div className="bg-black/30 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
            <div className="relative p-6">
              <button
                onClick={() => setShowDatePicker(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all z-10"
              >
                <X size={24} className="text-white/80" />
              </button>

              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="p-3 hover:bg-white/10 rounded-full transition-all"
                >
                  <ArrowRight size={28} className="rotate-180 text-white" />
                </button>
                <div className="text-2xl font-bold text-white">
                  {months[currentMonth]} {currentYear}
                </div>
                <button
                  onClick={nextMonth}
                  className="p-3 hover:bg-white/10 rounded-full transition-all"
                >
                  <ArrowRight size={28} className="text-white" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center text-white/60 font-medium text-sm">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 mb-8">
                {renderDays()}
              </div>

              <div>
                <div className="text-white/70 text-sm font-medium mb-4">Select Time</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    '9:00 AM', '10:00 AM', '11:00 AM',
                    '12:00 PM', '1:00 PM', '2:00 PM',
                    '3:00 PM', '4:00 PM', '5:00 PM',
                    '6:00 PM', '7:00 PM', '8:00 PM',
                    '9:00 PM', '10:00 PM'
                  ].map(time => (
                    <button
                      key={time}
                      onClick={() => handleTimeChange(time)}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${selectedTime === time
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/10 hover:bg-white/20 text-white/90'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DatePickerModal;