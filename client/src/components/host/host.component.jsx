import style from './host.module.css';

const Host = ({ selectedProperty }) => {
  const { host, host_avatar } = selectedProperty;

  console.log(selectedProperty);
  return (
    <div className={style.propertyDetails}>
      <div>
        <h2 className={style.propertySubTitle}>Host</h2>
        <section className={style.hostContainer}>
          <img src={host_avatar} className={style.img} />
          <p className={style.hostName}>{host}</p>
        </section>
      </div>
    </div>
  );
};

export default Host;
