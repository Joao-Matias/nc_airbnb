import style from './home.module.css';
import { Link } from 'react-router';
import { CiSearch, CiRollingSuitcase, CiRoute, CiHome } from 'react-icons/ci';

import { useState } from 'react';
import AllProperties from '../allProperties';
import FilterModal from '../filterModal';

const Home = ({ activeUser }) => {
  const [modalActive, setModalActive] = useState(false);

  return (
    <div className={style.homeContainer}>
      <div className={style.logoContainer}>
        <h1 className={style.logo}>Airbnb</h1>
      </div>
      <AllProperties />
      {/* <section className={style.filterContainer}>
        <button
          onClick={() => {
            setModalActive(true);
          }}
          className={style.filterButton}
        >
          <CiSearch className={style.searchIcon} />
          Search
        </button>
      </section> */}
      <nav className={style.homeNav}>
        <ul className={style.navList}>
          <li className={style.navListUser}>
            <div>
              <img className={style.userIcon} src={activeUser.user.avatar} />
            </div>
          </li>
          <li className={style.navListIcons}>
            <div className={style.navListIconsBox}>
              <Link className={style.navIconContainer}>
                <CiSearch className={style.navIcon} />
                <p className={style.iconTitles}>Search</p>
              </Link>
            </div>
            <div className={style.navListIconsBox}>
              <Link className={style.navIconContainer}>
                <CiRollingSuitcase className={style.navIcon} />
                <p className={style.iconTitles}>Bookings</p>
              </Link>
            </div>
            <div className={style.navListIconsBox}>
              <Link className={style.navIconContainer}>
                <CiHome className={style.navIcon} />
                <p className={style.iconTitles}>Properties</p>
              </Link>
            </div>
          </li>
        </ul>
      </nav>
      {/* {modalActive && <FilterModal />} */}
    </div>
  );
};

export default Home;
