import { useEffect, useState } from 'react';
import style from './filterModal.module.css';
import axios from 'axios';

const FilterModal = () => {
  const [allLocations, setAllLocations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://nc-airbnb-jm.onrender.com/api/properties`).then(({ data }) => {
      const locations = data.properties.map(({ location }) => {
        return { city: location };
      });

      const filteredLocations = [];
      locations.filter((location) => {
        if (!filteredLocations.includes(location.city)) filteredLocations.push(location.city);
      });

      setAllLocations(filteredLocations);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <section className={style.modalContainer}>
      <ul className={style.filterList}>
        <li className={style.selectedFilter}>
          <h3 className={style.title}>Where</h3>
          <ul className={style.listOfCities}>
            {allLocations.map((location) => {
              return <li className={style.individualCity}>{location}</li>;
            })}
          </ul>
        </li>
        <li className={style.unselectedFilter}>When</li>
        <li className={style.unselectedFilter}>Max price</li>
        <li className={style.unselectedFilter}>Min price</li>
        <li className={style.unselectedFilter}>Amenities</li>
        <li className={style.unselectedFilter}>Order</li>
        <li className={style.unselectedFilter}>Favourited</li>
        <li>
          <button>Filter properties</button>
        </li>
      </ul>
    </section>
  );
};

export default FilterModal;
