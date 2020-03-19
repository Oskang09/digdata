const { dig, setOptions } = require('./index');

const object = {
    owner: {
        id: 14,
        name: 'Jason',
        age: 19
    },
    client: {
        name: 'Yuzy',
        job: "Student",
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
            special: true,
        }
    ],
    community: [
        'Oskang09',
        'Roger',
        'Jason'
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
    const res = dig(object, ['owner.name', 'owner.id']);
    expect(res).toStrictEqual(['Jason', 14]);
});

test('Should equal symbol return object if target is array object based on condition.', () => {
    const res = dig(object, 'users.id=1');
    expect(res).toBe(object.users[0]);
});

test('Should equal symbol return array if target is array based on condition.', () => {
    const res = dig(object, 'community.=Jason');
    expect(res).toBe('Jason');
});

test('Should equal symbol return null when target not exists.', () => {
    const res = dig(object, 'users.id=3');
    expect(res).toBe(null);
});

test('Should arrayMap symbol return specific key', () => {
    const res = dig(object, 'users.*.name');
    expect(res).toStrictEqual(['Oskang09', 'Roger']);
});

test('Should comma symbol work with arrayMap symbol return multiple keys', () => {
    const res = dig(object, 'users.*.name,id');
    expect(res).toStrictEqual([
        { name: 'Oskang09', id: 1 },
        { name: 'Roger', id: 2 }
    ]);
});

test('Should pipe symbol return first truth value', () => {
    const res = dig(object, 'client.address|name|job');
    expect(res).toBe("Yuzy")
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