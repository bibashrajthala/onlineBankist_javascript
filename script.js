'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  // just like .textContent = 0,'',1,etc
  containerMovements.innerHTML = '';
  // empty container at first when displayMovements() is called then forEach() below fills the container

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} deposit</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // console.log(balance);
  // console.log(acc.balance);
  // console.log(accounts);

  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // console.log(incomes);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // console.log(out);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(deposit => deposit > 0)
    // or , do belows' map and reduce at once only using reduce as:
    // .reduce((acc, deposit) => acc + (deposit * 1.2) / 100, 0);
    .map(deposit => (deposit * acc.interestRate) / 100) // gives array of interest on each deposit
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // console.log(interest);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

// const user = 'Steven Thomas Willaims';

// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(name => name[0])
//   //or
//   //  .map(name => name.slice(0, 1))
//   .join('');

// console.log(username);

const createUsername = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      //or
      //  .map(name => name.slice(0, 1))
      .join('');

    // console.log(username);
  });
};
createUsername(accounts);
// console.log(accounts);

// console.log(containerMovements.innerHTML);

let currentAccount;

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

// EVENT HANDLERS

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting
  // console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('LOGIN');

    //display login message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    // display UI
    containerApp.style.opacity = 1;

    // clear user input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // console.log('TRANSFER VALID');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update UI
    updateUI(currentAccount);

    // clear/empty input field
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add the requested amount to movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);

    // cleaning the input fields after loan
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('DELETE');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // console.log('DELETE');

    // find index of account to delete using findIndex() to use that index in slice to delete the account
    const index = accounts.findIndex(
      acc => inputCloseUsername.value === currentAccount.username
    );
    // console.log(index);

    // console.log(accounts.indexOf(account1)) // 0

    // delete account
    accounts.splice(index, 1);

    // log out/hide UI after deleting the account
    containerApp.style.opacity = 0;
  }

  // clear input fields after closing account
  inputCloseUsername.value = inputClosePin.value = ''; // this needs to below if() otherwise empty string will be used while comparison in if statement
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*

//////////////////////
//// simple array methods

// slice method = returns new array with sliced/extracted parts, doesnot mutate original array
//syntax =slice(),slice(start_index),slice(start_index,end_index)

let arr = ['a', 'b', 'c', 'd', 'e'];
///// index=0,   1,   2,  3,  4
//also index=-5,-4,  -3,  -2, -1

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice()); // shallow copy using slice()
console.log([...arr]); // shallow copy using spread operator

//splice method = to delete / extract elements of array, mutate original array
// syntax = splice(start_index),splice(start_index,end_index)

//console.log(arr.splice(2));
console.log(arr);

arr.splice(-1);
console.log(arr);

arr.splice(1, 2);
console.log(arr);

// reverse method = reverse the elements and their index of the array,mutates original array

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2); // original array is mutated / changed => here reversed

// concat method = concatenate two arrays, doesnot mutate original array
// syntax = array1.concat(),array1.concat(array2)

// concatenation using concat() method
const letters = arr.concat(arr2);
console.log(letters);

// concatenation using spread operator
console.log([...arr, ...arr2]);

// join method = returns a string by joining the elements of array using a joiner, doesnot mutate original array
// syntax = array.join('joiner');

console.log(letters.join('-'));

// some already learnt array methods:
//  push,pop,unshift,shift,includes,indexOf

*/

//////////////////////////////////////////////////////

/*

////////////////////////////
//// looping array - forEach loop- forEach() method

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// positives = deposits , negatives = withdrawals

// first, using for_of loop{
for (const movement of movements) {
  if (movement > 0) console.log(`You deposited ${movement}`);
  else console.log(`You withdrew ${Math.abs(movement)}`);
}

// same, using forEach() method/loop
console.log('---- FOR EACH ----');
movements.forEach(function (movement) {
  // here movement parameter of callback function used in forEach() method is current element of array
  if (movement > 0) console.log(`You deposited ${movement}`);
  else console.log(`You withdrew ${Math.abs(movement)}`);
});

// accesing index of array elements using for_of needs to use array.entries() method{
for (const [i, movement] of movements.entries()) {
  if (movement > 0) console.log(`movement ${i + 1}:You deposited ${movement}`);
  else console.log(`movement ${i + 1}:You withdrew ${Math.abs(movement)}`);
}

// but in forEach(),the callback function used has defaultly  3 arguments passed as: current_element, current_index, entire array --------> in order------->
movements.forEach(function (mov, i, arr) {
  if (mov > 0) console.log(`movement ${i + 1}:You deposited ${mov}`);
  else console.log(`movement ${i + 1}:You withdrew ${Math.abs(mov)}`);
});

// but forEach always loops entire array ie break and continue cant be used while using forEach,  if we want to break loop at middle or something we need to use for_of, otherwise forEach is better option

*/

//////////////////////////////////////////////

/*

////////////////////////
///// forEach() with Maps an Sets

// forEach() with Maps
// same concept but 3 argument passed in callback are: current_value, current_key, entire_map ------>in order------->

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

console.log(currencies);

currencies.forEach(function (value, key, map) {
  console.log(`${key}:${value}`);
});

// forEach() for sets
// just like is maps=>
// same concept but 3 argument passed in callback are: current_value, current_key, entire_map ------>in order------->
// here current_key = current_value, map ={key => value}
// sets dont have index

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
// });

// currenciesUnique.forEach(function (value,value, map) {} // gives error as we cant use same parameter name more than once

currenciesUnique.forEach(function (value, _, map) {
  // underscore(_) means throwaway variable => unnecessary/unused but still cant leave empty
  console.log(`${value}:${value}`);
});

*/

////////////////////////////////////////////

////////////////
//// Project => Bankist app is started . It's is done above.

//////////////////////////////////////////////////

/*

/////////////////////////
///// coding challenge #1

const JuliaData = [3, 5, 2, 12, 7];
const KateData = [4, 1, 15, 8, 3];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice(); // shallow copy
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  // chianing two splice() at once wont work as it returns extracted/deleted elements actually not the remanining array
  console.log(dogsJuliaCorrected);

  // OR,
  // const dogsJuliaCorrect = dogsJuliaCorrected.slice(1, 3);
  // console.log(dogsJuliaCorrect);

  //combine array
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  //or
  // const dogs = [...dogsJuliaCorrecte,...dogsKate];
  console.log(dogs);

  dogs.forEach(function (dog, i) {
    if (dog >= 3)
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    else console.log(`Dog number ${i + 1} is a puppy🐶`);
  });
};
checkDogs(JuliaData, KateData); // test data 1
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]); // test data 1

*/

///////////////////////////////////////////

/////////////////////
//// Data transformation methods
//// map(),filter(),reduce()

////////////////////////////////////////////

/*

//////////////////////
//// the map method

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// above movement are in Euro
// convert then to USD
// 1 Euro =  1.1 USD

const euroToUsd = 1.1;

// using map
// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });

// using arrow function as callback function
const movementsUSD = movements.map(mov => mov * euroToUsd);

console.log(movementsUSD);

// same thing using for_of or forEach():
const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * euroToUsd);
}
console.log(movementsUSDfor);

// comparision of forEach and map

//forEach
movements.forEach(function (mov, i) {
  if (mov > 0) console.log(`movement ${i + 1}:You deposited ${mov}`);
  else console.log(`movement ${i + 1}:You withdrew ${Math.abs(mov)}`);
  // forEach creates side-effects.
});

//map
const movementsDescriptions = movements.map(
  (mov, i) =>
    // if (mov > 0) return `movement ${i + 1}:You deposited ${mov}`;
    // else return `movement ${i + 1}:You withdrew ${Math.abs(mov)}`;

    `movement ${i + 1}:You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescriptions);

*/

/////////////////////////////////////

//////////////////
// computing username => in bankist app => done above

/////////////////////////////////////

/*

///////////////////////
///// the filter method => returns the new array with only the elements of original array that satisfies certain condition returned in callback function

// using filter
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

// same, using for_of loop
const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) depositsFor.push(mov);
}
console.log(depositsFor);

// withdrawals using filter
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

*/

//////////////////////////////////////

/*

/////////////////////
// the reduce method => boil down/reduce elements of array to a single value., uses accumulator as first parameter of callback function, first parameter of reduce method is callback function and second parameter is initial value of accumulator.

// calculate overall balance using reduce
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// accumulator => SNOWBALL
// const balance = movements.reduce(function (accu, mov, i, arr) {
//   console.log(`Iteration ${i}: ${accu}`);
//   return accu + mov;
// }, 0);
// console.log(balance);

// simplifying above code
const balance = movements.reduce((accu, mov) => accu + mov, 0);
console.log(balance);

// same using for_of loop
let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

// calculating maximum value using reduce
console.log(movements);

const max = movements.reduce(
  (acc, mov) => (acc > mov ? acc : mov),
  movements[0]
);
console.log(max);

*/

///////////////////////////////////////////

/*

///////////////////
/////coding challenge #2

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(dogAge =>
    dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
  );
  const adults = humanAges.filter(age => age >= 18);
  console.log(humanAges);
  console.log(adults);

  // Way 1 of calculationg average
  // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

  // Way 2 of calculationg average
  const average = adults.reduce(
    (acc, age, i, arr) => acc + age / arr.length, // arr.length = adults.length
    0
  );

  // console.log(average);
  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);

*/

/////////////////////////////////////////

/*

///////////////////////
///// the magic of chaining methods

// while chaining we need to know on what we are chaining.
// we need to be aware of what the method used beforehand is returining ,then only chain after that method
// eg: we cant chain map() right after reduce() as, reduce returns a single value it will be like applying map() on single value , not on a array.

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

const euroToUsd = 1.1;

// PIPELINE => chaining
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  // .filter(mov => mov < 0) // assume we made a bug
  .map((mov, i, arr) => {
    // console.log(arr); // dubugging
    return mov * euroToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

*/

//////////////////////////////////////

/*

//////////////////////
//// coding challenge #3

const calcAverageHumanAge = ages =>
  ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(age => age >= 18)
    .reduce(
      // Way 2 of calculationg average: used in coding challenge 2
      (acc, age, i, arr) => acc + age / arr.length, // arr.length = adults.length
      0
    );

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);

*/

////////////////////////////////////////

/*

//////////////
//// the find method => returns a element by finding/retrieve the first element that satisfies a condition returned in callback function

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

// find method is usually used to find the object using certain key-value pair,from the array of objects
console.log(accounts);

// using find() method to find an object in an array of objects
// eg find an object from accounts array of objects who has owner:'Jessica Davis' key-value pair
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// same, using for_of loop
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    console.log(acc);
    // or
    // const account = acc;
    // console.log(account);
  }
}


// will use find() while implementing login funcitonality

*/

////////////////////////////

////////////
// implementing login in above app : done above

////////////////////////////

////////////
// implementing transfer in above app : done above

///////////////////////////////

//////////////////
//// the findIndex method => returns index of that first element of array matching the condition returned in callback function.
//// does job similar to indexOf() method but uses condition instead of element of array itself.

// lets use it to implement closing account in above project => deleting the account

//////////////////////////////////////////////////

/*

//////////////////////////
///// the some and every methods
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

// some() method => returns boolean value, gives true if any (atleast one) satisfies condition returned in callback function, otherwise gives false
// includes() checks equality , but some() can check any condition including equality condition

// includes()  => checks equality
console.log(movements.includes(-130));

// some() => checks any condition
console.log(movements.some(mov => mov === -130));
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);
const anyDepositBiggerThan5000 = movements.some(mov => mov > 5000);
console.log(anyDepositBiggerThan5000);

// lets implement the request loan functionality in above bankist project

// the every() method =>returns boolean value, gives true if Every element of the array satisfies condition returned in callback function, otherwise gives false

// every method=> any condition
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// separate callback function
const deposit = mov => mov > 0; // separate callback function
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

*/

////////////////////////////////////

/*

///////////////////
// flat and flatMap method

// flat() method => flattens array => removes nesting of array
// doesnot mutate original array
// syntax= flat(depth) ,depth =level of nesting in array,depth =1,2,3,....
//bt default , initially depth = 1

const arr = [[1, 2, 3], [4, 5, 6], 7, 8]; // array of array
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8]; // array of array of array
console.log(arrDeep.flat());
console.log(arrDeep.flat(2));

// calculate overall balamce of all movements of all accounts of bankist app

// const accountMovements = accounts.map(acc => acc.movements); //arrayy of array => array of movements of all accounts
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallMovements = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallMovements);

// same as above, but all at once using chaining
const overallMovements = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallMovements);

// the flatMap method => combination of flat and map method

// using flatMap() for same above:
const overallMovements2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallMovements2);

*/

/////////////////////////////////////

/*

/////////////////
//// sorting arrays(sort() method)  => used to sort elements of array => mutates original array

// sorting strings in array
const owners = ['Jonas', 'Adam', 'Martha', 'Zach'];
console.log(owners.sort());
console.log(owners);

const owners2 = ['Jonas', 'adam', 'Martha', 'zach'];
console.log(owners2.sort());

// sorting numbers in array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
console.log(movements.sort()); // does sorting as string , not as number => so, doesnot work

// return > 0 , switch order, a,b => b,a
// return < 0 , keeps order, a,b => a,b
// a= current element, b= next element

// sorting numbers of array in ascending
movements.sort((a, b) => {
  if (a > b) return 1; // can use any number greater than 0
  if (a < b) return -1; // can use any number less than 0
});
console.log(movements);

// sorting numbers of array in ascending
movements.sort((a, b) => {
  if (a < b) return 1; // can use any number greater than 0
  if (a > b) return -1; // can use any number less than 0
});
console.log(movements);

// simplyfying above code // better way
//ascending
movements.sort((a, b) => a - b);
console.log(movements);

//desscending
movements.sort((a, b) => b - a);
console.log(movements);

// lets implement the sort functionality in above bankist app

*/

///////////////////////////////////////////////

/*

/////////////////////////
/// more ways of fillling and recreating arrays
// the fill() and Array.from() methods

// 2 ways to create array studied till now:
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// empty arrays and fill method
const x = new Array(7); // creates empty array with 7 empty elements
console.log(x);

// other methods except fill method wont work in empty arrays
console.log(x.map(() => 5));

// syntax= fill(value_to_fill),fill(value,start_index),fill(value,start_index,end_index)
// console.log(x.fill(1));
// console.log(x.fill(1, 3));
console.log(x.fill(1, 3, 5));

// fill works in any array,not just empty array
arr.fill(23, 2, 6);
console.log(arr);

// Array.from()
// recreate [1,1,1,1,1,1,1] array
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

// create [1,2,3,4,5,6,7,8] array
const z = Array.from({ length: 8 }, (_, i) => i + 1);
console.log(z);

// create array with 100 random dice rolls
console.log(Math.trunc(Math.random() * 7));
const diceRolls100 = Array.from(
  { length: 20 },
  () => Math.trunc(Math.random() * 6) + 1
);

console.log(diceRolls100);

// real life use caseof Array.from() is to convert array like structure like Iterables(sets,maps,strings) and nodelist,etc to array.
// already learnt => queryselectorAll() generates nodelist
// lets convert nodelist to array
console.log(document.querySelectorAll('.movements__value'));

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   console.log(movementsUI);
//   console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
// });
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  // same but without using Array.from(),ie, using spread operator to destructure array like structure to array
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
  console.log(movementsUI2.map(el => Number(el.textContent.replace('€', ''))));
});

*/

///////////////////////////////////////////////

////////////////////
// array methods summary: which one to use and when?

//////////////////////////////////////////////

/*

////////////////////////
///// array methods practice

//1. find sum of all deposits of all accounts
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

//2. how many deposits have been made in bank with at least $1,000 ?
// a) using easy way
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposits1000);

// a) using reduce (to find counter)
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

// or
const numDeposits1000_b = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000)
  .reduce((count, cur) => ++count, 0);
console.log(numDeposits1000_b);

// postfixed ++ operator =>increment by 1 but return old previous value
let a = 10;
console.log(a++);
console.log(a);

// prefixed ++ operator =>increment by 1 and return incremented value
let b = 10;
console.log(++b);
console.log(b);

//3. create an object which contains sum of the deposits and of the withdrawals (use reduce to create object)
const sumsAll = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      //using dot notation
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sumsAll);

//destructuring above thing
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      //using dot notation
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//4. create a simple function to convert any string to TitleCase
// eg: this is a nice title -----> This Is a Nice Title.,,,a= exception here

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'the', 'an', 'with', 'and', 'but', 'or', 'on', 'in'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  // console.log(titleCase);
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('and this is a nice TITLE'));

*/

//////////////////////////////////////

/*

///////////////////
//// coding challenge #4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 20, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1.
dogs.forEach(
  (dog, i, arr) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);

//2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);

//3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much.`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little.`);

//5.
console.log(dogs.some(dog => dog.curFood === dog.recFood));

//6.
// okay amount of food= (curFood > recFood * 0.9) and (curFood < recFood * 1.10)
const checkEatingOkayAmount = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.some(checkEatingOkayAmount));

//7.
const dogsOkay = dogs.filter(checkEatingOkayAmount);
console.log(dogsOkay);

//8.
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);

*/
