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

    const updatedReview = [];
    if (properties) updatedReview.push(propertyId[property_name]);
    updatedReview.push(image_url);
    updatedReview.push(alt_tag);

    return updatedReview;
  });

  return mappedImages;
};

const insertFavourites = (favourites, users = [], properties = []) => {
  const changedFavourites = favourites.map((favouriteObj) => {
    const { guest_name: guestName, property_name: propertyName } = favouriteObj;

    const newFavouriteData = [];

    for (let i = 0; i < users.length; i++) {
      const { first_name: firstName, surname, user_id: userId } = users[i];
      if (firstName + ' ' + surname === guestName) {
        const guestId = userId;
        newFavouriteData.push(guestId);
      }
    }

    for (let i = 0; i < properties.length; i++) {
      if (properties[i].name === propertyName) {
        const propertyId = properties[i].property_id;
        newFavouriteData.push(propertyId);
      }
    }

    return newFavouriteData;
  });

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
