import style from './calendar.module.css';
import CalendarApp from 'react-calendar';

const Calendar = () => {
  return (
    <div className={style.propertyDetails}>
      <div>
        <h2 className={style.propertySubTitle}>Choose dates</h2>
        <p>ckeckin/checkout</p>
      </div>
      <CalendarApp className={style.calendar} />
      <div>
        <div>Chev left</div>
        <div>month</div>
        <div>Chev right</div>
      </div>
      <div>Day of week</div>
      <div>calendar</div>
    </div>
  );
};

export default Calendar;
