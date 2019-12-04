const { dig, setOptions } = require('./index');

const object = {
    owner: {
        id: 14,
        name: 'Jason',
        age: 19
    },
    users: [
        {
            id: 1,
            name: 'Oskang09',
            age: 20,
            email: 'developer.oskang@gmail.com',
        },
        {
            id: 2,
            name: 'Roger',
            age: 24,
        }
    ],
    community: [
        'Oskang09',
        'Roger',
        'Jason'
    ],
    numbers: [
        20,
        30,
        50
    ],
    products: [
        {
            name: 'Burger',
            price: 8.9,
        },
        {
            name: 'French Fries',
            price: 3.5
        }
    ]

};

test('Should dot string notation accepted.', () => {
    const res = dig(object, 'owner.name');
    expect(res).toBe(object.owner.name);
});

test('Should object dot string notation accepted.', () => {
    const res = dig(object, { name: 'owner.name' });
    expect(res).toStrictEqual({ name: object.owner.name });
});

test('Should array dot string notation accepted.', () => {
    const res = dig(object, [ 'owner.name', 'owner.id' ]);
    expect(res).toStrictEqual([ 'Jason', 14 ]);
});

test('Should equal symbol return object if target is array object based on condition.', () => {
    const res = dig(object, 'users.id=1');
    expect(res).toBe(object.users[0]);
});

test('Should equal symbol return first value if target is array based on condition.', () => {
    const res = dig(object, 'community.=Jason');
    expect(res).toBe('Jason');
});

test('Should equal symbol return null when target not exists.', () => {
    const res = dig(object, 'users.id=3');
    expect(res).toBe(null);
});

test('Should biggerThan symbol return object if target is array object based on condition.', () => {
    const res = dig(object, 'users.age>20');
    expect(res).toBe(object.users[1]);
});

test('Should biggerThan symbol return first value if target is array based on condition.', () => {
    const res = dig(object, 'numbers.>20');
    expect(res).toBe(30);
});

test('Should biggerThan symbol return value when target found if target is object.', () => {
    const res = dig(object, 'owner.age>10');
    expect(res).toBe(19);
});

test('Should biggerThan symbol return null when target not exists.', () => {
    const res = dig(object, 'owner.age>20');
    expect(res).toBe(0);
});

test('Should smallerThan symbol return object if target is array object based on condition.', () => {
    const res = dig(object, 'users.age<22');
    expect(res).toBe(object.users[0]);
});

test('Should smallerThan symbol return first value if target is array based on condition.', () => {
    const res = dig(object, 'numbers.<30');
    expect(res).toBe(20);
});

test('Should smallerThan symbol return null when target not exists.', () => {
    const res = dig(object, 'owner.age<5');
    expect(res).toBe(0);
});

test('Should smallerThan symbol return value when target found if target is object.', () => {
    const res = dig(object, 'owner.age<20');
    expect(res).toBe(19);
});

test('Should arrayMap symbol return specific key', () => {
    const res = dig(object, 'users.*.name');
    expect(res).toStrictEqual([ 'Oskang09', 'Roger' ]);
});

test('Should comma symbol work with arrayMap symbol return multiple keys', () => {
    const res = dig(object, 'users.*.name,id');
    expect(res).toStrictEqual([
        { name: 'Oskang09', id: 1 },
        { name: 'Roger', id: 2 }
    ]);
});

test('Should SUM() query return sum of all specified key (INTEGER)', () => {
    const res = dig(object, 'users.SUM(age)');
    expect(res).toStrictEqual(44);
});

test('Should SUM() query return sum of all specified key (FLOAT)', () => {
    const res = dig(object, 'products.SUM(price)');
    expect(res).toStrictEqual(12.4);
});

test('Should return null if target exists.', () => {
    expect(dig(object, 'owner.name.id')).toBe(null);
});

test('Should return null if object is falsy value.', () => {
    expect(dig(null, 'owner.name')).toBe(null);
});

test('Should `setOptions` update options object.', () => {
    setOptions({ seperator: '->' });
    expect(dig(object, 'owner->name')).toBe('Jason');
});