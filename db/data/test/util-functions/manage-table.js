const insertProperties = (arr, users) => {
  const newArr = arr.map((obj) => {
    const { name, location, price_per_night, description, property_type: propertyType, host_name: hostName } = obj;

    let hostId;
    if (users) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].first_name + ' ' + users[i].surname === hostName) {
          hostId = users[i].user_id;
        }
      }
    }

    let pricePerNight;
    if (price_per_night) {
      pricePerNight = price_per_night.toString();
    }

    return [name, location, pricePerNight, description, propertyType, hostId];
  });

  return newArr;
};

const insertReviews = (reviews, users = [], properties = []) => {
  const changedReviews = reviews.map((review) => {
    const { guest_name: guestName, rating, comment, property_name: propertyName } = review;

    const newReview = [];

    for (let i = 0; i < properties.length; i++) {
      if (properties[i].name === propertyName) {
        const propertyId = properties[i].property_id;
        newReview.push(propertyId);
      }
    }

    for (let i = 0; i < users.length; i++) {
      if (users[i].first_name + ' ' + users[i].surname === guestName) {
        const hostId = users[i].user_id;
        newReview.push(hostId);
      }
    }

    newReview.push(rating);

    if (comment) {
      newReview.push(comment);
    }

    return newReview;
  });

  return changedReviews;
};

module.exports = { insertProperties, insertReviews };
