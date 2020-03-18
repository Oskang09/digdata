# digdata

Some utility for digging data from a complex object or array.

# Installation

Using npm:
```
$ npm i --save digdata
```

# Example & Ussage

### Comma Symbol

Comma symbols `','` is for receiving multiple from an object. etc.

```javascript
const { dig } = require('digdata');
const object = {
    price: 26.8,
    count: 2,
    name: 'A4 Paper',
    buyer: [
        {
            name: 'Oska',
            id: 1,
            age: 14
        },
        {
            name: 'Jason',
            id: 2,
            age: 12
        }
    ]
};

dig(object, 'price,name'); // { "price": 26.8, "name": "A4 Paper" }
dig(object, 'buyer.*.name,age') // [ { "name": "Oska", "age": 14 }, { "name": "Jason", "age": 12 }]
```

### Equal Symbol

Equal symbols `'='` is for receive based on value from an object or array. etc.

```javascript
const { dig } = require('digdata');
const object = {
    type: 'SPICY',
    name: 'Burger',
    dine: [
        'DINE_IN',
        'TAKEAWAY'
    ],
    variants: [
        {
            name: 'Ala Carte',
            price: 8.9,
            items: [ 'Burger' ],
        },
        {
            name: 'Large Set',
            price: 11.9,
            items: [
                'Burger',
                'French Fries',
                'Coca Cola'
            ],
        },
    ],
};

dig(object, 'variants.name=Ala Carte'); // { "name": "Ala Carte", "price": 8.9, "items": [ "Burger" ] }
dig(object, 'dine.=DINE_IN'); // "DINE_IN"
```

### ArrayMap Symbol

ArrayMap symbols `'*'` is for filter data from an array object. etc.

```javascript
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

dig(object, 'users.*.name'); // [ 'Roger', 'Oskang09' ]
dig(object, 'users.*.name,id') // [ { "name": "Oskang09", "id": 1 }, { "name": "Roger", "id": 2 }]
```

### Result as Array / Object

You can make your result as object or array. etc.

```javascript
const { dig } = require('digdata');
const object = {
    class: 'LECTURE',
    students: [
        {
            id: 1,
            name: 'Oska'
        },
        {
            id: 2,
            name: 'WangLin',
        },
        {
            id: 3,
            name: "Yuzy"
        }
    ],
};

dig(object, { classType: 'class', studentNames: 'students.*.name' }); // { "classType: "LECTURE", studentNames: [ "Oska", "WangLin", "Yuzy" ] }
dig(object, [ "class", "students.id=3.name" ]); // [ 'LECTURE', 'Yuzy' ]
```

### Custom symbols

You can override it by using `setOptions(newOpts)` method.

```javascript
const { dig, setOptions } = require('digdata');
// just change whatever you want and it's using assign so unassigned value will use default.
setOptions({
    seperator: '->',
    // comma: ',',
    // equal: '=',
    // arrayMap: '*',
    // biggerThan: '>',
    // smallerThan: '<',
});

const object = {
    update: {
        options: 'OK'
    }
};

dig(object, 'update->options'): // 'OK'
```

# Test & Coverages

![](https://github.com/Oskang09/digdata/workflows/NodeCI/badge.svg)
```
 PASS  ./index.test.js
  ✓ Should dot string notation accepted. (4ms)
  ✓ Should object dot string notation accepted. (1ms)
  ✓ Should array dot string notation accepted.
  ✓ Should equal symbol return object if target is array object based on condition. (1ms)
  ✓ Should equal symbol return array if target is array based on condition.
  ✓ Should equal symbol return null when target not exists.
  ✓ Should arrayMap symbol return specific key (1ms)
  ✓ Should comma symbol work with arrayMap symbol return multiple keys
  ✓ Should return null if target exists.
  ✓ Should return null if object is falsy value. (1ms)
  ✓ Should `setOptions` update options object.

----------|----------|----------|----------|----------|-------------------|
| File       | % Stmts    | % Branch   | % Funcs    | % Lines    | Uncovered Line #s   |
| ---------- | ---------- | ---------- | ---------- | ---------- | ------------------- |
| All files  | 100        | 100        | 100        | 100        |                     |
| index.js   | 100        | 100        | 100        | 100        |                     |
| ---------- | ---------- | ---------- | ---------- | ---------- | ------------------- |
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        1.03s
```

# Changelog

- 1.0.0 Initialize Repository
- 1.0.1 Update README
- 1.0.2 Update ArrayDotNotation
- 1.0.3 Update Object Array Result and Some New Symbol
- 1.0.4 Update SUM query, BiggerThan and SmallerThan Symbols
- 1.0.5 Fix for accepting falsy value ( false, 0 ) only check for undefined & null
- 1.0.6 Revert back to 1.0.3 with 1.0.5 Fix ( Keep it simple )
- 1.0.7 Testing Github Packages
- 1.0.8 Testing Github Packages
- 1.0.9 Testing Github Packages
- 1.0.10 Testing Github Packages
- 1.0.11 Testing Github Packages
- 1.0.12 Finally we did it.
- 1.0.13 Only publish to npm
- 1.0.14 Fix security alerts

# Maintainers & Contributors

- [Oskang09](https://github.com/Oskang09)
