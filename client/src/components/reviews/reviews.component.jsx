import { useEffect, useState } from 'react';
import style from './reviews.module.css';
import axios from 'axios';
import { FaRegStar, FaStar } from 'react-icons/fa6';

const Reviews = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewsLength, setReviewsLength] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);

  useEffect(() => {
    axios.get(`https://nc-airbnb-jm.onrender.com/api/properties/${id}/reviews`).then(({ data }) => {
      setReviews(data.reviews);
      setReviewsLength(data.reviews.length);
      setReviewRating(data.average_rating);
    });
  }, [id]);

  const getCorrectStars = (rating) => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className={style.individualReviewRating} />);
      } else {
        stars.push(<FaRegStar key={i} className={style.individualReviewRating} />);
      }
    }
    return stars;
  };

  const getDate = (fullDate) => {
    const createdDate = new Date(fullDate);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dec'];

    return `${months[createdDate.getMonth() + 1]}, ${createdDate.getFullYear()}`;
  };

  return (
    <div className={style.propertyDetails}>
      <div className={style.reviewTitle}>
        <h2 className={style.propertySubTitle}>Reviews</h2>
        <p className={style.reviewNumber}>{`(${reviewsLength})`}</p>
        <div className={style.ratingCont}>
          <FaStar className={style.ratingStar} />
          <h3 className={style.rating}>{reviewRating}</h3>
        </div>
      </div>

      <ul className={style.individualReview}>
        {reviews.map((review) => {
          return (
            <li className={style.reviewContainer} key={review.review_id}>
              <div className={style.reviewHeader}>
                <div>{getCorrectStars(review.rating)}</div>
                <p>{getDate(review.created_at)}</p>
              </div>
              <p>{review.comment}</p>
              <div className={style.reviewGuestContainer}>
                <img className={style.reviewGuestImg} src={review.guest_avatar} />
                <p>{review.guest}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Reviews;
