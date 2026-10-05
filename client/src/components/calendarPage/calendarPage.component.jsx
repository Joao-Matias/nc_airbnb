import { useState } from 'react';
// import style from './calendarPage.module.css';

import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());

  console.log(value);
  return (
    // <div className={style.propertyDetails}>
    //   <div>
    //     <h2 className={style.propertySubTitle}>Choose dates</h2>
    //   </div>
    // </div>
    <Calendar onChange={setValue} value={value} />
  );
};

export default CalendarPage;
