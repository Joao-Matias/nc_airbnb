import { useState } from 'react';
import style from './calendarPage.module.css';

import Calendar from 'react-calendar';

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());

  console.log(value);
  return (
    <div className={style.propertyDetails}>
      <div>
        <h2 className={style.propertySubTitle}>Choose dates</h2>
        <div className={style.calenderContainer}>
          <Calendar onChange={setValue} value={value} />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
