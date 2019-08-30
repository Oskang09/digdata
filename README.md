# digdata

Some utility for digging data from a complex object or array.

# Installation

Using npm:
```
$ npm i --save digdata
```

# Example

```javascript
const { dig } = require('digdata');
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

dig(object, 'owner.name'); // 'Jason'
dig(object, [ 'owner', 'name' ]); // 'Jason'
dig(object, 'owner', 'name'); // 'Jason'
dig(object, 'users.id=2'); // { "id": 2, "name": "Roger", "age": 24 }
dig(object, 'users.name'); // [ 'Roger', 'Oskang09' ]
```

You can view example at `index.test.js`.


# Test & Coverages

```
PASS  ./index.test.js
  ✓ Should mutliple arguments notation accepted.  (3ms)
  ✓ Should array argument notation accepted.
  ✓ Should dot string notation accepted. (1ms)
  ✓ Should equal notation return object based on condition.
  ✓ Should equal notation return null when target not exists.
  ✓ Should filter notation return specific key (1ms)
  ✓ Should return null if dot notation not exists. (1ms)
  ✓ Should return null if object is falsy value.

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 index.js |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.851s, estimated 1s
```

# Changelog

- 1.0.0 Initialize Repository
- 1.0.1 Update README
- 1.0.2 Update ArrayDotNotation

# Maintainers & Contributors

- [Oskang09](https://github.com/Oskang09)
