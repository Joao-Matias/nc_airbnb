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

  return changedFavourites;
};

const insertAmenities = (properties) => {
  let updatedAmenities = [];

  properties.map((property) => {
    property.amenities.forEach((amenity) => {
      if (!updatedAmenities.includes(amenity)) {
        updatedAmenities = [...updatedAmenities, amenity];
      }
    });
  });

  return updatedAmenities.map((amenity) => {
    return [amenity];
  });
};

const insertPropertiesAmenities = (propertiesData, insertedProperties, insertAmenities) => {
  let updatedPropertiesAmenities = [];

  propertiesData.map((property) => {
    insertAmenities.forEach(({ amenity }) => {
      insertedProperties.forEach((insertedProperty) => {
        if (insertedProperty.name === property.name && property.amenities.includes(amenity)) {
          updatedPropertiesAmenities = [...updatedPropertiesAmenities, [insertedProperty.property_id, amenity]];
        }
      });
    });
  });

  return updatedPropertiesAmenities;
};

const insertBookings = (bookings, properties, users = []) => {
  const changedBookings = bookings.map((booking) => {
    const newBookingsData = [];

    for (let i = 0; i < properties.length; i++) {
      if (booking.property_name === properties[i].name) {
        newBookingsData.push(properties[i].property_id);
      }
    }

    for (let i = 0; i < users.length; i++) {
      if (booking.guest_name === users[i].first_name + ' ' + users[i].surname) {
        newBookingsData.push(users[i].user_id);
      }
    }

    newBookingsData.push(booking.check_in_date);
    newBookingsData.push(booking.check_out_date);

    return newBookingsData;
  });

  return changedBookings;
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
