import style from './host.module.css';

const Host = ({ host: { user } }) => {
  const { avatar, first_name: firstName, surname } = user;

  return (
    <div className={style.propertyDetails}>
      <div>
        <h2 className={style.propertySubTitle}>Host</h2>
        <section className={style.hostContainer}>
          <img src={avatar} className={style.img} />
          <p className={style.hostName}>
            {firstName} {surname}
          </p>
        </section>
      </div>
    </div>
  );
};

export default Host;
