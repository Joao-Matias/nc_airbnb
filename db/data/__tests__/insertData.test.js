const {
  insertProperties,
  insertReviews,
  insertImages,
  insertFavourites,
  insertPropertiesAmenities,
  insertAmenities,
  insertBookings,
} = require('../util-functions/insertData');

describe('insertProperties', () => {
  test('should always return an array', () => {
    const arr = [];

    expect(insertProperties(arr)).toEqual([]);
  });

  test('should iterate through each object and return the name', () => {
    const arr = [{ name: 'Cosy Family House' }, { name: 'Chic Studio Near the Beach' }];

    expect(insertProperties(arr)).toEqual([['Cosy Family House'], ['Chic Studio Near the Beach']]);
  });

  test('should iterate through each object and return the location', () => {
    const arr = [
      { name: 'Modern Apartment in City Center', location: 'London, UK' },
      { name: 'Chic Studio Near the Beach', location: 'Manchester, UK' },
    ];

    expect(insertProperties(arr)).toEqual([
      [arr[0].name, arr[0].location],
      ['Chic Studio Near the Beach', 'Manchester, UK'],
    ]);
  });

  test('should iterate through each object and return the price per night', () => {
    const arr = [
      { name: 'Modern Apartment in City Center', location: 'London, UK', price_per_night: 150.0 },
      { name: 'Chic Studio Near the Beach', location: 'Manchester, UK', price_per_night: 120.0 },
    ];

    expect(insertProperties(arr)).toEqual([
      ['Modern Apartment in City Center', 'London, UK', '150'],
      ['Chic Studio Near the Beach', 'Manchester, UK', '120'],
    ]);
  });

  test('should iterate through each object and return the description', () => {
    const arr = [
      {
        name: 'Modern Apartment in City Center',
        location: 'London, UK',
        price_per_night: 150.0,
        description: 'Description of Modern Apartment in City Center.',
      },
      {
        name: 'Chic Studio Near the Beach',
        location: 'Manchester, UK',
        price_per_night: 120.0,
        description: 'Description of Cosy Family House.',
      },
    ];

    expect(insertProperties(arr)).toEqual([
      ['Modern Apartment in City Center', 'London, UK', '150', 'Description of Modern Apartment in City Center.'],
      ['Chic Studio Near the Beach', 'Manchester, UK', '120', 'Description of Cosy Family House.'],
    ]);
  });

  test('should iterate through each object and return the property type', () => {
    const arr = [
      {
        name: 'Modern Apartment in City Center',
        location: 'London, UK',
        price_per_night: 150.0,
        description: 'Description of Modern Apartment in City Center.',
        property_type: 'House',
      },
      {
        name: 'Chic Studio Near the Beach',
        location: 'Manchester, UK',
        price_per_night: 120.0,
        description: 'Description of Cosy Family House.',
        property_type: 'Studio',
      },
    ];

    expect(insertProperties(arr)).toEqual([
      [
        'Modern Apartment in City Center',
        'London, UK',
        '150',
        'Description of Modern Apartment in City Center.',
        'House',
      ],
      ['Chic Studio Near the Beach', 'Manchester, UK', '120', 'Description of Cosy Family House.', 'Studio'],
    ]);
  });

  test('should iterate through each object using the second arg to find the user name', () => {
    const arr = [
      {
        name: 'Modern Apartment in City Center',
        location: 'London, UK',
        price_per_night: 150.0,
        description: 'Description of Modern Apartment in City Center.',
        property_type: 'House',
        host_name: 'Alice Johnson',
      },
      {
        name: 'Chic Studio Near the Beach',
        location: 'Manchester, UK',
        price_per_night: 120.0,
        description: 'Description of Cosy Family House.',
        property_type: 'Studio',
        host_name: 'Emma Davis',
      },
    ];

    const users = [
      {
        user_id: 3,
        first_name: 'Emma',
        surname: 'Davis',
        email: 'emma@example.com',
        phone_number: '+44 7000 333333',
        is_host: true,
        avatar: 'https://example.com/images/emma.jpg',
      },
      {
        user_id: 1,
        first_name: 'Alice',
        surname: 'Johnson',
        email: 'alice@example.com',
        phone_number: '+44 7000 111111',
        is_host: true,
        avatar: 'https://example.com/images/alice.jpg',
      },
    ];

    expect(insertProperties(arr, users)).toEqual([
      [
        'Modern Apartment in City Center',
        'London, UK',
        '150',
        'Description of Modern Apartment in City Center.',
        'House',
        1,
      ],
      ['Chic Studio Near the Beach', 'Manchester, UK', '120', 'Description of Cosy Family House.', 'Studio', 3],
    ]);
  });
});

describe('insertReviews', () => {
  test('should return an array', () => {
    expect(insertReviews([])).toEqual([]);
  });

  test('should iterate the first arg returning the ratings', () => {
    const reviews = [
      {
        rating: 2,
      },
      {
        rating: 3,
      },
    ];

    expect(insertReviews(reviews)).toEqual([[2], [3]]);
  });

  test('should iterate the first arg returning, if exists, a comment', () => {
    const reviews = [
      {
        rating: 2,
        comment:
          'Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable.',
      },
      {
        rating: 3,
      },
    ];

    expect(insertReviews(reviews)).toEqual([
      [
        2,
        'Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable.',
      ],
      [3],
    ]);
  });

  test('should iterate the first arg replacing the guest name with the second arg arr of users id', () => {
    const reviews = [
      {
        guest_name: 'Frank White',
        rating: 2,
        comment:
          'Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable.',
      },
      {
        guest_name: 'Rachel Cummings',
        rating: 3,
        comment:
          'Comment about Cosy Loft in the Heart of the City: Great location but the loft was a bit smaller than expected.',
      },
    ];

    const users = [
      {
        user_id: 6,
        first_name: 'Rachel',
        surname: 'Cummings',
        email: 'rachel@example.com',
        phone_number: '+44 7000 666666',
        is_host: false,
        avatar: 'https://example.com/images/rachel.jpg',
      },
      {
        user_id: 4,
        first_name: 'Frank',
        surname: 'White',
        email: 'frank@example.com',
        phone_number: '+44 7000 444444',
        is_host: false,
        avatar: 'https://example.com/images/frank.jpg',
      },
    ];

    expect(insertReviews(reviews, users)).toEqual([
      [
        4,
        2,
        'Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable.',
      ],
      [
        6,
        3,
        'Comment about Cosy Loft in the Heart of the City: Great location but the loft was a bit smaller than expected.',
      ],
    ]);
  });
  test('should iterate the first arg replacing the property name with the third arg arr of property id', () => {
    const reviews = [
      {
        guest_name: 'Frank White',
        property_name: 'Elegant City Apartment',
        rating: 2,
        comment:
          'Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable.',
      },
      {
        guest_name: 'Rachel Cummings',
        property_name: 'Cosy Loft in the Heart of the City',
        rating: 3,
        comment:
          'Comment about Cosy Loft in the Heart of the City: Great location but the loft was a bit smaller than expected.',
      },
    ];

    const users = [
      {
        user_id: 6,
        first_name: 'Rachel',
        surname: 'Cummings',
        email: 'rachel@example.com',
        phone_number: '+44 7000 666666',
        is_host: false,
        avatar: 'https://example.com/images/rachel.jpg',
      },
      {
        user_id: 4,
        first_name: 'Frank',
        surname: 'White',
        email: 'frank@example.com',
        phone_number: '+44 7000 444444',
        is_host: false,
        avatar: 'https://example.com/images/frank.jpg',
      },
    ];

    const properties = [
      {
        property_id: 9,
        host_id: 5,
        name: 'Cosy Loft in the Heart of the City',
        location: 'Manchester, UK',
        property_type: 'Apartment',
        price_per_night: '130',
        description: 'Description of Cosy Loft in the Heart of the City.',
      },
      {
        property_id: 4,
        host_id: 3,
        name: 'Elegant City Apartment',
        location: 'Birmingham, UK',
        property_type: 'Apartment',
        price_per_night: '110',
        description: 'Description of Elegant City Apartment.',
      },
    ];

    expect(insertReviews(reviews, users, properties)).toEqual([
      [
        4,
        4,
        2,
        'Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable.',
      ],
      [
        9,
        6,
        3,
        'Comment about Cosy Loft in the Heart of the City: Great location but the loft was a bit smaller than expected.',
      ],
    ]);
  });
});

describe('insertImages', () => {
  test('should return an array', () => {
    expect(insertImages([])).toEqual([]);
  });

  test('should iterate the first arg returning an img url', () => {
    const images = [
      {
        image_url: 'https://example.com/images/quaint_cottage_1.jpg',
      },
      {
        image_url: 'https://example.com/images/modern_apartment_1.jpg',
      },
      {
        image_url: 'https://example.com/images/modern_apartment_3.jpg',
      },
    ];

    expect(insertImages(images)).toEqual([
      ['https://example.com/images/quaint_cottage_1.jpg'],
      ['https://example.com/images/modern_apartment_1.jpg'],
      ['https://example.com/images/modern_apartment_3.jpg'],
    ]);
  });

  test('should iterate the first arg returning an alt tag of the image', () => {
    const images = [
      {
        image_url: 'https://example.com/images/quaint_cottage_1.jpg',
        alt_tag: 'Alt tag for Quaint Cottage in the Hills',
      },
      {
        image_url: 'https://example.com/images/modern_apartment_1.jpg',
        alt_tag: 'Alt tag for Modern Apartment in City Center',
      },
      {
        image_url: 'https://example.com/images/modern_apartment_3.jpg',
        alt_tag: 'Alt tag for Modern Apartment in City Center 2',
      },
    ];

    expect(insertImages(images)).toEqual([
      ['https://example.com/images/quaint_cottage_1.jpg', 'Alt tag for Quaint Cottage in the Hills'],
      ['https://example.com/images/modern_apartment_1.jpg', 'Alt tag for Modern Apartment in City Center'],
      ['https://example.com/images/modern_apartment_3.jpg', 'Alt tag for Modern Apartment in City Center 2'],
    ]);
  });

  test('should iterate the first arg replacing the property name by the second arg property id', () => {
    const properties = [
      {
        property_id: 10,
        host_id: 5,
        name: 'Quaint Cottage in the Hills',
        location: 'Lake District, UK',
        property_type: 'House',
        price_per_night: '180',
        description: 'Description of Quaint Cottage in the Hills.',
      },
      {
        property_id: 1,
        host_id: 1,
        name: 'Modern Apartment in City Center',
        location: 'London, UK',
        property_type: 'Apartment',
        price_per_night: '120',
        description: 'Description of Modern Apartment in City Center.',
      },
    ];

    const images = [
      {
        property_name: 'Quaint Cottage in the Hills',
        image_url: 'https://example.com/images/quaint_cottage_1.jpg',
        alt_tag: 'Alt tag for Quaint Cottage in the Hills',
      },
      {
        property_name: 'Modern Apartment in City Center',
        image_url: 'https://example.com/images/modern_apartment_1.jpg',
        alt_tag: 'Alt tag for Modern Apartment in City Center',
      },
      {
        property_name: 'Modern Apartment in City Center',
        image_url: 'https://example.com/images/modern_apartment_3.jpg',
        alt_tag: 'Alt tag for Modern Apartment in City Center 2',
      },
    ];

    expect(insertImages(images, properties)).toEqual([
      [10, 'https://example.com/images/quaint_cottage_1.jpg', 'Alt tag for Quaint Cottage in the Hills'],
      [1, 'https://example.com/images/modern_apartment_1.jpg', 'Alt tag for Modern Apartment in City Center'],
      [1, 'https://example.com/images/modern_apartment_3.jpg', 'Alt tag for Modern Apartment in City Center 2'],
    ]);
  });
});

describe('insertFavourites', () => {
  test('should return an array', () => {
    expect(insertFavourites([])).toEqual([]);
  });

  test('should iterate the first arg replacing guest name with the second arg id', () => {
    const favouries = [
      {
        guest_name: 'Bob Smith',
        property_name: 'Modern Apartment in City Center',
      },
      {
        guest_name: 'Rachel Cummings',
        property_name: 'Cosy Family House',
      },
      {
        guest_name: 'Frank White',
        property_name: 'Chic Studio Near the Beach',
      },
    ];

    const users = [
      {
        user_id: 2,
        first_name: 'Bob',
        surname: 'Smith',
        email: 'bob@example.com',
        phone_number: '+44 7000 222222',
        is_host: false,
        avatar: 'https://example.com/images/bob.jpg',
      },
      {
        user_id: 4,
        first_name: 'Frank',
        surname: 'White',
        email: 'frank@example.com',
        phone_number: '+44 7000 444444',
        is_host: false,
        avatar: 'https://example.com/images/frank.jpg',
      },
      {
        user_id: 6,
        first_name: 'Rachel',
        surname: 'Cummings',
        email: 'rachel@example.com',
        phone_number: '+44 7000 666666',
        is_host: false,
        avatar: 'https://example.com/images/rachel.jpg',
      },
    ];

    expect(insertFavourites(favouries, users)).toEqual([[2], [6], [4]]);
  });

  test('should iterate the first arg replacing property name with the third arg id', () => {
    const favouries = [
      {
        guest_name: 'Bob Smith',
        property_name: 'Modern Apartment in City Center',
      },
      {
        guest_name: 'Frank White',
        property_name: 'Chic Studio Near the Beach',
      },
      {
        guest_name: 'Rachel Cummings',
        property_name: 'Cosy Family House',
      },
    ];

    const users = [
      {
        user_id: 2,
        first_name: 'Bob',
        surname: 'Smith',
        email: 'bob@example.com',
        phone_number: '+44 7000 222222',
        is_host: false,
        avatar: 'https://example.com/images/bob.jpg',
      },
      {
        user_id: 4,
        first_name: 'Frank',
        surname: 'White',
        email: 'frank@example.com',
        phone_number: '+44 7000 444444',
        is_host: false,
        avatar: 'https://example.com/images/frank.jpg',
      },
      {
        user_id: 6,
        first_name: 'Rachel',
        surname: 'Cummings',
        email: 'rachel@example.com',
        phone_number: '+44 7000 666666',
        is_host: false,
        avatar: 'https://example.com/images/rachel.jpg',
      },
    ];

    const properties = [
      {
        property_id: 1,
        host_id: 1,
        name: 'Modern Apartment in City Center',
        location: 'London, UK',
        property_type: 'Apartment',
        price_per_night: '120',
        description: 'Description of Modern Apartment in City Center.',
      },
      {
        property_id: 2,
        host_id: 1,
        name: 'Cosy Family House',
        location: 'Manchester, UK',
        property_type: 'House',
        price_per_night: '150',
        description: 'Description of Cosy Family House.',
      },
      {
        property_id: 3,
        host_id: 1,
        name: 'Chic Studio Near the Beach',
        location: 'Brighton, UK',
        property_type: 'Studio',
        price_per_night: '90',
        description: 'Description of Chic Studio Near the Beach.',
      },
    ];

    expect(insertFavourites(favouries, users, properties)).toEqual([
      [2, 1],
      [4, 3],
      [6, 2],
    ]);
  });
});

describe('insertAmenities', () => {
  test('should return an array', () => {
    expect(insertAmenities([])).toEqual([]);
  });

  test('should return from the first arg the amenity', () => {
    const properties = [
      {
        name: 'Modern Apartment in City Center',
        property_type: 'Apartment',
        location: 'London, UK',
        price_per_night: 120.0,
        description: 'Description of Modern Apartment in City Center.',
        host_name: 'Alice Johnson',
        amenities: ['WiFi', 'TV', 'Kitchen'],
      },
    ];

    expect(insertAmenities(properties)).toEqual([['WiFi'], ['TV'], ['Kitchen']]);
  });

  test('should not repeat aminities returned', () => {
    const properties = [
      {
        name: 'Modern Apartment in City Center',
        property_type: 'Apartment',
        location: 'London, UK',
        price_per_night: 120.0,
        description: 'Description of Modern Apartment in City Center.',
        host_name: 'Alice Johnson',
        amenities: ['WiFi', 'TV', 'WiFi'],
      },
    ];

    expect(insertAmenities(properties)).toEqual([['WiFi'], ['TV']]);
  });

  test('should take several objs in the fist arg', () => {
    const properties = [
      {
        name: 'Modern Apartment in City Center',
        property_type: 'Apartment',
        location: 'London, UK',
        price_per_night: 120.0,
        description: 'Description of Modern Apartment in City Center.',
        host_name: 'Alice Johnson',
        amenities: ['WiFi', 'TV', 'Kitchen'],
      },
      {
        name: 'Cosy Family House',
        property_type: 'House',
        location: 'Manchester, UK',
        price_per_night: 150.0,
        description: 'Description of Cosy Family House.',
        host_name: 'Alice Johnson',
        amenities: ['WiFi', 'Parking', 'Kitchen'],
      },
      {
        name: 'Chic Studio Near the Beach',
        property_type: 'Studio',
        location: 'Brighton, UK',
        price_per_night: 90.0,
        description: 'Description of Chic Studio Near the Beach.',
        host_name: 'Alice Johnson',
        amenities: ['WiFi'],
      },
    ];

    expect(insertAmenities(properties)).toEqual([['WiFi'], ['TV'], ['Kitchen'], ['Parking']]);
  });
});

describe('insertPropertiesAmenities', () => {
  test('should return an array', () => {
    expect(insertPropertiesAmenities([])).toEqual([]);
  });

  test('should iterate through the first arg the number of times equal to the number of amenities returning always the corresponding id from the second arg and the amenity', () => {
    const propertiesData = [
      {
        name: 'Chic Studio Near the Beach',
        property_type: 'Studio',
        location: 'Brighton, UK',
        price_per_night: 90.0,
        description: 'Description of Chic Studio Near the Beach.',
        host_name: 'Alice Johnson',
        amenities: ['WiFi', 'Kitchen', 'Parking'],
      },
    ];

    const insertedProperties = [
      {
        property_id: 3,
        host_id: 1,
        name: 'Chic Studio Near the Beach',
        location: 'Brighton, UK',
        property_type: 'Studio',
        price_per_night: '90',
        description: 'Description of Chic Studio Near the Beach.',
      },
    ];

    const insertedAmenities = [
      { amenity: 'WiFi' },
      { amenity: 'TV' },
      { amenity: 'Kitchen' },
      { amenity: 'Parking' },
      { amenity: 'Washer' },
    ];

    expect(insertPropertiesAmenities(propertiesData, insertedProperties, insertedAmenities)).toEqual([
      ['3', 'WiFi'],
      ['3', 'Kitchen'],
      ['3', 'Parking'],
    ]);
  });
});

describe('insertBookings', () => {
  test('should return an array', () => {
    expect(insertBookings([])).toEqual([]);
  });

  test('should iterate through the first arg replacing the property name with the corresponding id from the second arg', () => {
    const bookings = [
      {
        property_name: 'Luxury Penthouse with View',
        guest_name: 'Bob Smith',
      },
      {
        property_name: 'Cosy Family House',
        guest_name: 'Rachel Cummings',
      },
    ];

    const properties = [
      {
        property_id: 6,
        host_id: 1,
        name: 'Luxury Penthouse with View',
        location: 'London, UK',
        property_type: 'Apartment',
        price_per_night: '250',
        description: 'Description of Luxury Penthouse with View.',
      },
      {
        property_id: 2,
        host_id: 1,
        name: 'Cosy Family House',
        location: 'Manchester, UK',
        property_type: 'House',
        price_per_night: '150',
        description: 'Description of Cosy Family House.',
      },
    ];

    expect(insertBookings(bookings, properties)).toEqual([[6], [2]]);
  });

  test('should iterate through the first arg returning the check in date', () => {
    const bookings = [
      {
        property_name: 'Luxury Penthouse with View',
        guest_name: 'Bob Smith',
        check_in_date: '2025-12-08',
      },
      {
        property_name: 'Cosy Family House',
        guest_name: 'Rachel Cummings',
        check_in_date: '2025-12-10',
      },
    ];

    const properties = [
      {
        property_id: 6,
        host_id: 1,
        name: 'Luxury Penthouse with View',
        location: 'London, UK',
        property_type: 'Apartment',
        price_per_night: '250',
        description: 'Description of Luxury Penthouse with View.',
      },
      {
        property_id: 2,
        host_id: 1,
        name: 'Cosy Family House',
        location: 'Manchester, UK',
        property_type: 'House',
        price_per_night: '150',
        description: 'Description of Cosy Family House.',
      },
    ];

    expect(insertBookings(bookings, properties)).toEqual([
      [6, '2025-12-08'],
      [2, '2025-12-10'],
    ]);
  });

  test('should iterate through the first arg returning the check out date', () => {
    const bookings = [
      {
        property_name: 'Luxury Penthouse with View',
        guest_name: 'Bob Smith',
        check_in_date: '2025-12-08',
        check_out_date: '2025-12-12',
      },
      {
        property_name: 'Cosy Family House',
        guest_name: 'Rachel Cummings',
        check_in_date: '2025-12-10',
        check_out_date: '2025-12-15',
      },
    ];

    const properties = [
      {
        property_id: 6,
        host_id: 1,
        name: 'Luxury Penthouse with View',
        location: 'London, UK',
        property_type: 'Apartment',
        price_per_night: '250',
        description: 'Description of Luxury Penthouse with View.',
      },
      {
        property_id: 2,
        host_id: 1,
        name: 'Cosy Family House',
        location: 'Manchester, UK',
        property_type: 'House',
        price_per_night: '150',
        description: 'Description of Cosy Family House.',
      },
    ];

    expect(insertBookings(bookings, properties)).toEqual([
      [6, '2025-12-08', '2025-12-12'],
      [2, '2025-12-10', '2025-12-15'],
    ]);
  });

  test('should iterate through the first arg replacing the guest name with the corresponding id from the third arg', () => {
    const bookings = [
      {
        property_name: 'Luxury Penthouse with View',
        guest_name: 'Bob Smith',
        check_in_date: '2025-12-08',
        check_out_date: '2025-12-12',
      },
      {
        property_name: 'Cosy Family House',
        guest_name: 'Rachel Cummings',
        check_in_date: '2025-12-10',
        check_out_date: '2025-12-15',
      },
    ];

    const properties = [
      {
        property_id: 6,
        host_id: 1,
        name: 'Luxury Penthouse with View',
        location: 'London, UK',
        property_type: 'Apartment',
        price_per_night: '250',
        description: 'Description of Luxury Penthouse with View.',
      },
      {
        property_id: 2,
        host_id: 1,
        name: 'Cosy Family House',
        location: 'Manchester, UK',
        property_type: 'House',
        price_per_night: '150',
        description: 'Description of Cosy Family House.',
      },
    ];

    const users = [
      {
        user_id: 2,
        first_name: 'Bob',
        surname: 'Smith',
        email: 'bob@example.com',
        phone_number: '+44 7000 222222',
        is_host: false,
        avatar: 'https://example.com/images/bob.jpg',
      },
      {
        user_id: 6,
        first_name: 'Rachel',
        surname: 'Cummings',
        email: 'rachel@example.com',
        phone_number: '+44 7000 666666',
        is_host: false,
        avatar: 'https://example.com/images/rachel.jpg',
      },
    ];

    expect(insertBookings(bookings, properties, users)).toEqual([
      [6, 2, '2025-12-08', '2025-12-12'],
      [2, 6, '2025-12-10', '2025-12-15'],
    ]);
  });
});
