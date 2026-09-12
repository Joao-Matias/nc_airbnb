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
      <nav className={style.homeNav}>
        <ul className={style.navList}>
          <li>
            <img className={style.userIcon} src={activeUser.user.avatar} />
          </li>
          <li>
            <Link>
              <CiSearch className={style.navIcon} />
              <p className={style.iconTitles}>Search</p>
            </Link>
          </li>
          <li>
            <Link>
              <CiRollingSuitcase className={style.navIcon} />
              <p className={style.iconTitles}>Bookings</p>
            </Link>
          </li>
          <li>
            <Link>
              <CiRoute className={style.navIcon} />
              <p className={style.iconTitles}>Last Property</p>
            </Link>
          </li>
          <li>
            <Link>
              <CiHome className={style.navIcon} />
              <p className={style.iconTitles}>My Properties</p>
            </Link>
          </li>
        </ul>
      </nav>
      <AllProperties />
      <section className={style.filterContainer}>
        <h1 className={style.logo}>AirBnB</h1>
        <button
          onClick={() => {
            setModalActive(true);
          }}
          className={style.filterButton}
        >
          <CiSearch className={style.searchIcon} />
          Search
        </button>
      </section>
      {/* {modalActive && <FilterModal />} */}
    </div>
  );
};

export default Home;
