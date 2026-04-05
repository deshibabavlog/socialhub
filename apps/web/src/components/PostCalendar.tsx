import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

interface PostCalendarProps {
  brandId: string;
}

export const PostCalendar: React.FC<PostCalendarProps> = ({ brandId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(monthStart.getDay())
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

        {daysInMonth.map((day) => (
          <div
            key={day.toISOString()}
            className={`aspect-square flex items-center justify-center rounded text-sm font-medium cursor-pointer transition ${
              isToday(day)
                ? 'bg-blue-500 text-white'
                : isSameMonth(day, currentDate)
                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                : 'text-gray-400'
            }`}
          >
            {day.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};
