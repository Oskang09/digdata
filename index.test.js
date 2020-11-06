const {
    dig, cursor,
    setOptions, setFormatter,
    _withOptions, _disableTrackKey
} = require('./index');

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

test('Should run invoke if function and data found.', () => {
    const log = jest.fn();
    setFormatter({
        logger: function (data) {
            log(data);
            return data;
        }
    });

    dig(object, 'users.*.name&logger');
    expect(log.mock.calls.length).toBe(2);
    expect(log.mock.calls[0][0]).toBe("Oskang09");
    expect(log.mock.calls[1][0]).toBe("Roger");
});

test('Should skip if function not found.', () => {
    const log = jest.fn();
    setFormatter({
        logger: function (data) {
            log(data);
            return data;
        }
    });

    dig(object, 'users.*.age&other,special&logger');
    expect(log.mock.calls.length).toBe(2);
    expect(log.mock.calls[0][0]).toBe(null);
    expect(log.mock.calls[1][0]).toBe(true);
});

test('Should `cursor` build options object', () => {
    const opts = cursor();
    expect(opts.cursor).not.toBe(null);
})

test(`Should build cache when cursor not null`, () => {
    const opts = cursor();
    const object = {
        name: 'Yuzy',
        job: "Student",
        friends: [
            {
                name: "Oska"
            },
            {
                name: "WangLin"
            }
        ]
    };
    const result = dig(object, 'name', opts);
    dig(object, "friends.*.name", opts);
    expect(result).toBe('Yuzy');
    expect(opts.cursor).toStrictEqual({
        name: 'Yuzy',
        friends: object.friends,
        "friends.*": object.friends,
        "friends.*.name": ["Oska", "WangLin"]
    });
});

test(`Should get from cache when cursor not null and key exist`, () => {
    const opts = cursor();
    const object = {
        name: 'Yuzy',
        job: "Student",
        client: {
            name: "Oska"
        },
    };
    const result = dig(object, 'client.name', opts);
    dig(object, 'client.name', opts)
    expect(result).toBe('Oska');
    expect(opts.cursor).toStrictEqual({
        client: object.client,
        'client.name': 'Oska'
    });
});

test('Should `withOptions` set disableTracker on options', () => {
    const options = cursor();
    const newOptions = _withOptions(options, true);
    const newOptions2 = _withOptions(options, false);
    expect(newOptions[_disableTrackKey]).toBe(true);
    expect(newOptions2[_disableTrackKey]).toBe(undefined);
});

test('Should `setOptions` update options object.', () => {
    setOptions({ seperator: '->' });
    expect(dig(object, 'owner->name')).toBe('Jason');
});