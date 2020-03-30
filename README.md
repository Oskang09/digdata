# digdata

lightweight zero dependency object data utility

# Installation

### Using NPM

```
$ npm i --save digdata
```

### Using yarn

```
$ yarn add digdata
```

### Browser

```js
<script src="https://oskang09.github.io/digdata/index.min.js"><script>
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
dig(object, 'dine=DINE_IN'); // "DINE_IN"
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

### Pipe Symbol

Pipe symbol `|` is for taking first truth value form object. etc

```javascript
const { dig } = require('digdata'); 
const object = {
    name: 'Oska',
    job: 'Developer',
};

dig(object, 'address|name|job'); // Oska
dig(object, 'address|job|name'); // Developer  
```

### Invoke Symbol

Invoke symbol `&` is for assigning formatter function for value. You can set formatter globally by using method `setFormatter(formatter)` before any `dig` have invoked.

```javascript
const { dig, setFormatter } = require('digdata');
const formatter = {
    moment: function (value, object) {
        return Date.parse(value);
    }
};

const object = {
    createdAt: '12 Dec 2019 00:12:00 GMT',
    updatedAt: '12 Mac 2020 00:12:00 GMT'
};

let newObject = dig(object, { createdAt: 'createdAt&moment', updatedAt: 'updatedAt&moment' }, undefined, formatter);
console.log(typeof newObject.createdAt); // number
console.log(typeof newObject.updatedAt); // number

setFormatter(formatter);
newObject = dig(object, { createdAt: 'createdAt&moment', updatedAt: 'updatedAt&moment' });
console.log(typeof newObject.createdAt); // number
console.log(typeof newObject.updatedAt); // number
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
    // pipe: '|',
    // invoke: '&',
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
  ✓ Should dot string notation accepted. (3ms)
  ✓ Should object dot string notation accepted. (1ms)
  ✓ Should array dot string notation accepted. (1ms)
  ✓ Should equal symbol return object if target is array object based on condition.
  ✓ Should equal symbol return array if target is array based on condition.
  ✓ Should equal symbol return null when target not exists. (1ms)
  ✓ Should arrayMap symbol return specific key
  ✓ Should comma symbol work with arrayMap symbol return multiple keys (1ms)
  ✓ Should pipe symbol return first truth value
  ✓ Should return null if target exists. (1ms)
  ✓ Should return null if object is falsy value. (1ms)
  ✓ Should run invoke if function and data found. (1ms)
  ✓ Should skip if function not found. (1ms)
  ✓ Should `setOptions` update options object. (1ms)

----------|---------|----------|---------|---------|-------------------
| File       | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
| ---------- | --------- | ---------- | --------- | --------- | ------------------- |
| All files  | 100       | 94.12      | 100       | 100       |
| index.js   | 100       | 94.12      | 100       | 100       | 99,103              |
| ---------- | --------- | ---------- | --------- | --------- | ------------------- |
Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        1.552s
Ran all test suites.
```

# Maintainers & Contributors

- [Oskang09](https://github.com/Oskang09)
