import style from './host.module.css';

import { Link } from 'react-router';

const Host = ({ host }) => {
  const { avatar, first_name: firstName, created_at: createdAt, user_id: userId } = host;

  const difInMilSecs = new Date() - new Date(createdAt);
  const msInYear = 1000 * 60 * 60 * 24 * 365.25;
  const yearsMember = Math.floor(difInMilSecs / msInYear);

  return (
    <div className={style.propertyDetails}>
      <div>
        <h2 className={style.propertySubTitle}>Host</h2>
        <Link className={style.hostDetails} to={`/user/${userId}`}>
          <div className={style.hostImgContainer}>
            <img src={avatar} className={style.img} />
            <p className={style.hostName}>{firstName}</p>
          </div>

          <div className={style.hostInfoContainer}>
            <p className={style.boldDetails}>{yearsMember}</p>
            <p className={style.hostPText}>year{yearsMember > 1 ? 's' : ''} as a member</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Host;
