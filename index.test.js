const { dig } = require('./index');

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
    ]
};

test('Should mutliple arguments notation accepted. ', () => {
    const res = dig(object, 'owner', 'name');
    expect(res).toBe(object.owner.name);
});

test('Should array argument notation accepted.', () => {
    const res = dig(object, [ 'owner', 'name' ]);
    expect(res).toBe(object.owner.name);
});

test('Should dot string notation accepted.', () => {
    const res = dig(object, 'owner.name');
    expect(res).toBe(object.owner.name);
});

test('Should equal notation return object based on condition.', () => {
    const res = dig(object, 'users.id=1');
    expect(res).toBe(object.users[0]);
});

test('Should equal notation return null when target not exists.', () => {
    const res = dig(object, 'users.id=3');
    expect(res).toBe(null);
});

test('Should dot notation meet array return specific key', () => {
    const res = dig(object, 'users.name');
    expect(res).toStrictEqual([ 'Oskang09', 'Roger' ]);
});

test('Should return null if dot notation not exists.', () => {
    expect(dig(object, 'owner.name.id')).toBe(null);
});

test('Should return null if object is falsy value.', () => {
    expect(dig(null, 'owner.name')).toBe(null);
});