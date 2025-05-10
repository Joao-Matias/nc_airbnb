const { insertProperties, insertReviews } = require('../util-functions/manage-table');

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
      ['Modern Apartment in City Center', 'London, UK'],
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
