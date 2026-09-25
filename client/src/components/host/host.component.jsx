import style from './host.module.css';

const Host = ({ host: { user } }) => {
  const { avatar, first_name: firstName, email, phone_number: phoneNumber, created_at: createdAt } = user;

  const difInMilSecs = new Date() - new Date(createdAt);
  const msInYear = 1000 * 60 * 60 * 24 * 365.25;
  const yearsMember = Math.floor(difInMilSecs / msInYear);

  console.log(user);

  return (
    <div className={style.propertyDetails}>
      <div>
        <h2 className={style.propertySubTitle}>Host</h2>
        <section className={style.hostDetails}>
          <div className={style.hostImgContainer}>
            <img src={avatar} className={style.img} />
            <p className={style.hostName}>{firstName}</p>
          </div>

          <div className={style.hostInfoContainer}>
            <p className={style.boldDetails}>{yearsMember}</p>
            <p className={style.hostPText}>year{yearsMember > 1 ? 's' : ''} as a member</p>
            <p></p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Host;
