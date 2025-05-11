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

const insertImages = (images, properties = []) => {
  const changedImages = images.map((image) => {
    const newImage = [];

    const { property_name: propertyName, image_url: imageUrl, alt_tag: altTag } = image;

    for (let i = 0; i < properties.length; i++) {
      if (properties[i].name === propertyName) {
        const propertyId = properties[i].property_id;
        newImage.push(propertyId);
      }
    }

    newImage.push(imageUrl);
    newImage.push(altTag);

    return newImage;
  });

  return changedImages;
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

    console.log(newBookingsData);
    return newBookingsData;
  });

  console.log(changedBookings);
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
