import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import style from './singleProperty.module.css';
import axios from 'axios';
import { CiUndo } from 'react-icons/ci';
import { IoIosHeartEmpty, IoMdHeart } from 'react-icons/io';

import Amenities from '../amenities';
import Reviews from '../reviews';
import Calendar from '../calendar';

const SingleProperty = ({ activeUser }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    axios
      .get(`https://nc-airbnb-jm.onrender.com/api/properties/${id}?user_id=${activeUser.user.user_id}`)
      .then(({ data }) => {
        setSelectedProperty(data.property);
        setIsLoading(false);
      });
  }, [id, activeUser.user.user_id]);

  if (isLoading) return <h1 className={style.loading}>LOADING PROPERTY {id}...</h1>;

  return (
    <section className={style.container}>
      <nav className={style.nav}>
        <Link className={style.link} to={'/'}>
          <button className={style.iconButton}>
            <CiUndo className={style.icon} />
          </button>
        </Link>
        <button className={style.iconButton}>
          {selectedProperty.favourited ? (
            <IoMdHeart className={style.heartIconFilled} />
          ) : (
            <IoIosHeartEmpty className={style.heartIcon} />
          )}
        </button>
      </nav>
      <div className={style.propertyContainer}>
        <ul className={style.imgCaroussel}>
          {selectedProperty.images.map((image, i) => {
            return (
              <li key={i} className={style.imageContainer}>
                <img src={image} className={style.image} />
              </li>
            );
          })}
        </ul>
        <section className={style.propertyDescription}>
          <div className={style.propertyDetails}>
            <h1 className={style.propertyTitle}>{selectedProperty.property_name}</h1>
            <p className={style.propertyText}>{selectedProperty.description}</p>
            <p>{selectedProperty.location}</p>
          </div>
          <Amenities id={id} />
          <Reviews id={id} />
          <Calendar />
          <h1>Host</h1>
          <h1>Other host properties</h1>
        </section>
      </div>
      <footer className={style.footerContainer}>FOOTER</footer>
    </section>
  );
};

export default SingleProperty;
