import { useState } from 'react';
import style from './calendarPage.module.css';

import Calendar from 'react-calendar';

const CalendarPage = ({ bookings }) => {
  console.log(bookings);
  const [value, setValue] = useState(new Date());

  const today = new Date();
  const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

  const handleTileDisabled = ({ date, view }) => {
    if (view !== 'month') return false;

    const normalizeDate = (dateStringOrObject) => {
      const newDate = new Date(dateStringOrObject);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const currentTileDate = normalizeDate(date);

    return bookings.some((booking) => {
      const checkIn = normalizeDate(booking.check_in_date);
      const checkOut = normalizeDate(booking.check_out_date);

      return currentTileDate >= checkIn && currentTileDate <= checkOut;
    });
  };

  return (
    <div className={style.propertyDetails}>
      <div>
        <h2 className={style.propertySubTitle}>Choose dates</h2>
        <div className={style.calenderContainer}>
          <Calendar
            selectRange={true}
            onChange={setValue}
            value={value}
            minDate={today}
            maxDate={oneYearFromNow}
            tileDisabled={handleTileDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
