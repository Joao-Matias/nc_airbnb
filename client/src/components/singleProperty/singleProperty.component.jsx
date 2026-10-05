import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import style from './singleProperty.module.css';
import axios from 'axios';
import { CiUndo } from 'react-icons/ci';
import { IoIosHeartEmpty, IoMdHeart } from 'react-icons/io';

import Amenities from '../amenities';
import Reviews from '../reviews';
import CalendarPage from '../calendarPage';
import Host from '../host';

const SingleProperty = ({ activeUser }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [host, setHost] = useState(null);

  useEffect(() => {
    axios
      .get(`https://nc-airbnb-jm.onrender.com/api/properties/${id}?user_id=${activeUser.user.user_id}`)
      .then(({ data }) => {
        axios.get(`https://nc-airbnb-jm.onrender.com/api/users/${data.property.host_id}`).then(({ data }) => {
          console.log(data.user);
          setHost(data.user);
          setIsLoading(false);
        });
        setSelectedProperty(data.property);
      })
      .catch((err) => {
        console.error('Error fetching property data:', err);
        setIsLoading(false);
      });
  }, [id, activeUser]);

  if (isLoading) return <h1 className={style.loading}>LOADING PROPERTY {id}...</h1>;

  const favourProperty = async () => {
    if (selectedProperty.favourited === false) {
      const data = await axios.post(
        `https://nc-airbnb-jm.onrender.com/api/properties/${selectedProperty.property_id}/favourite`,
        {
          guest_id: activeUser.user_id,
        }
      );

      data.status === 201 &&
        setSelectedProperty((prevState) => {
          return { ...prevState, favourited: !prevState.favourited };
        });
    } else {
      axios.delete(
        `https://nc-airbnb-jm.onrender.com/api/properties/${selectedProperty.property_id}/users/${activeUser.user_id}/favourite`
      );

      setSelectedProperty((prevState) => {
        return { ...prevState, favourited: !prevState.favourited };
      });
    }
  };

  return (
    <section className={style.container}>
      <nav className={style.nav}>
        <Link className={style.link} to={'/'}>
          <button className={style.iconButton}>
            <CiUndo className={style.icon} />
          </button>
        </Link>
        <button className={style.iconButton} onClick={favourProperty}>
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
          <CalendarPage />
          <Host host={host} />
        </section>
      </div>
    </section>
  );
};

export default SingleProperty;
