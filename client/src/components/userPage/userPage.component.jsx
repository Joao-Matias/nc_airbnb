import axios from 'axios';
import style from './userPage.module.css';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

const UserPage = () => {
  const { id: userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [host, setHost] = useState(null);

  console.log(host);

  useEffect(() => {
    axios
      .get(`https://nc-airbnb-jm.onrender.com/api/users/${userId}`)
      .then(({ data }) => {
        setHost(data.user);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching property data:', err);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) return <h1 className={style.loading}>LOADING USER {userId}...</h1>;

  return (
    <section className={style.userPage}>
      <h1>User page</h1>
      <div className={style.userContainer}></div>
    </section>
  );
};

export default UserPage;
