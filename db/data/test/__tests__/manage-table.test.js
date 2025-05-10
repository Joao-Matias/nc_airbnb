const { insertProperties } = require('../util-functions/manage-table');

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
