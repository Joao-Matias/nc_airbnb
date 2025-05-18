const insertProperties = (properties, users) => {
  let hostId = [];
  if (users) {
    for (let i = 0; i < users.length; i++) {
      const userName = users[i].first_name + ' ' + users[i].surname;
      hostId = { ...hostId, [userName]: users[i].user_id };
    }
  }

  const mappedProperties = properties.map((property) => {
    const { name, location, price_per_night, description, property_type, host_name } = property;

    let pricePerNightStr;

    if (price_per_night) {
      pricePerNightStr = price_per_night.toString();
    }

    return [name, location, pricePerNightStr, description, property_type, hostId[host_name]];
  });

  return mappedProperties;
};

const insertReviews = (reviews, users, properties) => {
  let userId = [];
  if (users) {
    for (let i = 0; i < users.length; i++) {
      const userName = users[i].first_name + ' ' + users[i].surname;
      userId = { ...userId, [userName]: users[i].user_id };
    }
  }

  let propertyId = [];
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      propertyId = { ...propertyId, [properties[i].name]: properties[i].property_id };
    }
  }

  const mappedReview = reviews.map((review) => {
    const { guest_name, rating, comment, property_name } = review;

    const updatedReview = [];
    if (properties) updatedReview.push(propertyId[property_name]);
    if (users) updatedReview.push(userId[guest_name]);
    updatedReview.push(rating);
    if (comment) updatedReview.push(comment);

    return updatedReview;
  });

  return mappedReview;
};

const insertImages = (images, properties) => {
  let propertyId = [];
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      propertyId = { ...propertyId, [properties[i].name]: properties[i].property_id };
    }
  }

  const mappedImages = images.map((image) => {
    const { property_name, image_url, alt_tag } = image;

    const updatedImages = [];
    if (properties) updatedImages.push(propertyId[property_name]);
    updatedImages.push(image_url);
    updatedImages.push(alt_tag);

    return updatedImages;
  });

  return mappedImages;
};

const insertFavourites = (favourites, users, properties) => {
  let usersId = [];
  if (users) {
    for (let i = 0; i < users.length; i++) {
      const userName = users[i].first_name + ' ' + users[i].surname;
      usersId = { ...usersId, [userName]: users[i].user_id };
    }
  }

  let propertiesId = [];
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      propertiesId = { ...propertiesId, [properties[i].name]: properties[i].property_id };
    }
  }

  const mappedFavourites = favourites.map((favouriteObj) => {
    const { guest_name, property_name } = favouriteObj;

    const updatedFavourites = [];
    if (users) updatedFavourites.push(usersId[guest_name]);
    if (properties) updatedFavourites.push(propertiesId[property_name]);

    return updatedFavourites;
  });

  return mappedFavourites;
};

const insertAmenities = (properties) => {
  let allAmenities = [];
  for (let i = 0; i < properties.length; i++) {
    allAmenities.push(...properties[i].amenities);
  }

  let filteredAmenites = allAmenities.filter((amenity, index) => allAmenities.indexOf(amenity) === index);

  const updatedAmenities = filteredAmenites.map((amenity) => {
    return [amenity];
  });

  return updatedAmenities;
};

const insertPropertiesAmenities = (propertiesData, insertedProperties, insertAmenities = []) => {
  let allAmenities = [];
  for (let i = 0; i < propertiesData.length; i++) {
    allAmenities = { ...allAmenities, [propertiesData[i].name]: propertiesData[i].amenities };
  }

  let propertiesId = [];
  if (insertedProperties) {
    for (let i = 0; i < insertedProperties.length; i++) {
      propertiesId = { ...propertiesId, [insertedProperties[i].property_id]: allAmenities[insertedProperties[i].name] };
    }
  }

  let updatedPropertiesAmenities = [];
  for (const key in propertiesId) {
    const filteredAmenities = propertiesId[key].filter(
      (amenity, index) => propertiesId[key].indexOf(amenity) === index
    );

    const noDuplicatedAmenities = filteredAmenities.map((amenity) => {
      return [key, amenity];
    });

    updatedPropertiesAmenities.push(...noDuplicatedAmenities);
  }

  return updatedPropertiesAmenities;
};

const insertBookings = (bookings, properties, users) => {
  let bookingsId = [];
  for (let i = 0; i < bookings.length; i++) {
    bookingsId = { ...bookingsId, [bookings[i].property_name]: bookings[i].guest_name };
  }

  let propertiesId = [];
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      propertiesId = { ...propertiesId, [properties[i].name]: properties[i].property_id };
    }
  }

  let usersId = [];
  if (users) {
    for (let i = 0; i < users.length; i++) {
      const userName = users[i].first_name + ' ' + users[i].surname;
      usersId = { ...usersId, [userName]: users[i].user_id };
    }
  }

  const updatedBookings = bookings.map((booking) => {
    const { property_name, guest_name, check_in_date, check_out_date } = booking;

    const filteredBookings = [];
    filteredBookings.push(propertiesId[property_name]);
    if (users) filteredBookings.push(usersId[guest_name]);
    if (check_in_date) filteredBookings.push(check_in_date);
    if (check_out_date) filteredBookings.push(check_out_date);
    return filteredBookings;
  });

  return updatedBookings;
};

module.exports = {
  insertProperties,
  insertReviews,
  insertImages,
  insertFavourites,
  insertPropertiesAmenities,
  insertAmenities,
  insertBookings,
};
