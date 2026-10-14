import { useState } from 'react';
import style from './calendarPage.module.css';

import Calendar from 'react-calendar';

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());

  const today = new Date();
  const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

  console.log(value);
  return (
    <div className={style.propertyDetails}>
      <div>
        <h2 className={style.propertySubTitle}>Choose dates</h2>
        <div className={style.calenderContainer}>
          <Calendar onChange={setValue} value={value} minDate={today} maxDate={oneYearFromNow} />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
