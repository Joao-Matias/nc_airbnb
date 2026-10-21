import { useState } from 'react';
import style from './calendarPage.module.css';

import Calendar from 'react-calendar';

const CalendarPage = ({ bookings }) => {
  const today = new Date();
  const [dates, setDates] = useState([]);
  const [maxDate, setMaxDate] = useState(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()));

  const startDate =
    dates.length === 0
      ? []
      : `${dates[0].getDate()} ${dates[0].toLocaleDateString('default', {
          month: 'short',
        })} ${dates[0].getFullYear()}`;

  const endDate =
    dates.length === 2
      ? `${dates[1].getDate()} ${dates[1].toLocaleDateString('default', {
          month: 'short',
        })} ${dates[1].getFullYear()}`
      : [];

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

  const handleDateSelection = (date) => {
    if (dates.length > 0 && date > dates[0] && !dates[1]) {
      setDates((prevState) => {
        return [prevState[0], date];
      });
      setMaxDate(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()));
    } else {
      setDates([date]);
      let closestDate = maxDate;
      for (let i = 0; i < bookings.length; i++) {
        if (closestDate > new Date(bookings[0].check_in_date) && date < new Date(bookings[0].check_in_date)) {
          closestDate = bookings[0].check_in_date;
        } else {
          closestDate = maxDate;
        }
      }
      closestDate = new Date(closestDate);
      setMaxDate(new Date(closestDate.getFullYear(), closestDate.getMonth(), closestDate.getDate()));
    }
  };

  return (
    <div className={style.propertyDetails}>
      <div className={style.calendarGrid}>
        <h2 className={style.propertySubTitle}>Choose dates</h2>
        <p>{dates.length > 0 ? `${startDate} - ${endDate}` : 'Select dates'}</p>
        <div className={style.calenderContainer}>
          <Calendar
            onChange={handleDateSelection}
            value={dates}
            minDate={today}
            maxDate={maxDate}
            tileDisabled={(date, view) => {
              return handleTileDisabled(date, view);
            }}
          />
        </div>
        <button
          className={style.clearButton}
          onClick={() => {
            setDates([]);
          }}
        >
          <p>Clear dates</p>
        </button>
      </div>
    </div>
  );
};

export default CalendarPage;
