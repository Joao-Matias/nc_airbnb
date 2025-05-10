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

module.exports = { insertProperties };
