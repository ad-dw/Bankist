"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [
    {
      amount: 200,
      date: "2019-11-18T21:31:17.178Z",
    },
    {
      amount: 459,
      date: "2019-12-23T07:42:02.383Z",
    },
    {
      amount: -400,
      date: "2020-01-28T09:15:04.904Z",
    },
    {
      amount: 3000,
      date: "2020-04-01T10:17:24.185Z",
    },
    {
      amount: -650,
      date: "2020-05-08T14:11:59.604Z",
    },
    {
      amount: -130,
      date: "2020-05-27T17:01:17.194Z",
    },
    {
      amount: 70,
      date: "2020-07-11T23:36:17.929Z",
    },
    {
      amount: 1300,
      date: "2020-07-12T10:51:36.790Z",
    },
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [
    {
      amount: 5000,
      date: "2019-11-01T13:15:33.035Z",
    },
    {
      amount: 3400,
      date: "2019-11-30T09:48:16.867Z",
    },
    {
      amount: -150,
      date: "2019-12-25T06:04:23.907Z",
    },
    {
      amount: -790,
      date: "2020-01-25T14:18:46.235Z",
    },
    {
      amount: -3210,
      date: "2020-02-05T16:33:06.386Z",
    },
    {
      amount: -1000,
      date: "2020-04-10T14:43:26.374Z",
    },
    {
      amount: 8500,
      date: "2020-06-25T18:49:59.371Z",
    },
    {
      amount: -30,
      date: "2020-07-26T12:01:20.894Z",
    },
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [
    {
      amount: 200,
      date: "2019-11-01T13:15:33.035Z",
    },
    {
      amount: -200,
      date: "2019-11-30T09:48:16.867Z",
    },
    {
      amount: 340,
      date: "2019-12-25T06:04:23.907Z",
    },
    {
      amount: -300,
      date: "2020-01-25T14:18:46.235Z",
    },
    {
      amount: -20,
      date: "2020-02-05T16:33:06.386Z",
    },
    {
      amount: 50,
      date: "2020-04-10T14:43:26.374Z",
    },
    {
      amount: 400,
      date: "2020-06-25T18:49:59.371Z",
    },
    {
      amount: -460,
      date: "2020-07-26T12:01:20.894Z",
    },
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [
    {
      amount: 430,
      date: "2019-11-30T09:48:16.867Z",
    },
    {
      amount: 1000,
      date: "2019-12-25T06:04:23.907Z",
    },
    {
      amount: 700,
      date: "2020-01-25T14:18:46.235Z",
    },
    {
      amount: 90,
      date: "2020-02-05T16:33:06.386Z",
    },
    {
      amount: 50,
      date: "2020-04-10T14:43:26.374Z",
    },
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

let movementsSorted = false;
let currentUser = null;

const sortMovements = function (movements) {
  return movements.toSorted((a, b) => new Date(b.date) - new Date(a.date));
};

const calcDisplayMovements = function (movements, sort = false) {
  const sortedMovements = sort ? sortMovements(movements) : movements;
  containerMovements.innerHTML = "";
  sortedMovements.forEach((ele, idx) => {
    const type = ele.amount > 0 ? "deposit" : "withdrawal";
    const movDate = new Date(ele.date).toLocaleDateString();
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
          <div class="movements__date">${movDate}</div>
          <div class="movements__value">${ele.amount.toFixed(2)} ₹</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcUsername = function (accounts) {
  accounts.forEach((account) => {
    const username = account.owner
      .split(" ")
      .map((ownerName) => ownerName[0])
      .join("")
      .toLowerCase();
    account.username = username;
  });
};

const computeDisplayTotalBalance = function (movements) {
  const balance = movements.reduce((acc, movement) => movement.amount + acc, 0);
  labelBalance.textContent = `${balance.toFixed(2)}₹`;
};

const computeDisplayTotalDeposit = function (movements) {
  const totalDeposit = movements
    .filter((movement) => movement.amount > 0)
    .reduce((acc, mov) => acc + mov.amount, 0);
  labelSumIn.textContent = `${totalDeposit.toFixed(2)}₹`;
};

const computeDisplayTotalWithdrawal = function (movements) {
  const totalWithdrawal = movements
    .filter((movement) => movement.amount < 0)
    .reduce((acc, mov) => acc + mov.amount, 0);
  labelSumOut.textContent = `${Math.abs(totalWithdrawal).toFixed(2)}₹`;
};

const computeDisplayTotalInterest = function (movements, interest) {
  let totalInterest = movements
    .map((movement) => (movement.amount * interest) / 100)
    .filter((interest) => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${totalInterest.toFixed(2)}₹`;
};

const computeDisplayCurrentDate = function () {
  let date = new Date();
  labelDate.textContent = date.toLocaleString();
};

const displayWelcomeMessage = function () {
  labelWelcome.textContent = `Welcome! ${currentUser.owner}`;
};

const updateUI = function () {
  calcDisplayMovements(currentUser.movements);
  computeDisplayTotalBalance(currentUser.movements);
  computeDisplayTotalDeposit(currentUser.movements);
  computeDisplayTotalWithdrawal(currentUser.movements);
  computeDisplayTotalInterest(currentUser.movements, currentUser.interestRate);
  computeDisplayCurrentDate();
};

const login = function (event) {
  event.preventDefault();
  let username = inputLoginUsername.value;
  let pin = inputLoginPin.value;
  if (username) {
    currentUser = accounts.find((ele) => ele.username === username);
  }
  if (currentUser) {
    if (+pin === currentUser.pin) {
      inputLoginUsername.value = "";
      inputLoginPin.value = "";
      displayWelcomeMessage();
      updateUI();
      containerApp.style.opacity = 1;
      containerApp.style.height = "auto";
    } else {
      alert("wrong password");
    }
  } else {
    alert("User not found");
  }
};

const handleSortMovements = function () {
  movementsSorted = !movementsSorted;
  calcDisplayMovements(currentUser.movements, movementsSorted);
};

const deleteAccount = function () {
  const index = accounts.findIndex(
    (acc) => acc.username === currentUser.username
  );
  accounts.splice(index, 1);
};

const logout = function () {
  labelWelcome.textContent = "Log in to get started";
  containerApp.style.opacity = 0;
};

const closeAccount = function (event) {
  event.preventDefault();
  let accountToBeClosed = inputCloseUsername.value;
  if (accountToBeClosed === currentUser.username) {
    if (+inputClosePin.value === currentUser.pin) {
      deleteAccount();
      logout();
      alert("Account deleted successfully");
    } else {
      alert("Pin is not correct");
    }
  } else {
    alert("Account username is wrong!");
  }
};

const checkLoanEligibility = function (event) {
  event.preventDefault();
  const loanAmount = +inputLoanAmount.value;
  if (loanAmount <= 0) {
    alert("Invalid Amount!");
    return;
  }
  const isEligible = currentUser.movements.some(
    (ele) => ele >= loanAmount * 0.1
  );
  if (isEligible) {
    let accIdx = accounts.findIndex(
      (ele) => ele.username === currentUser.username
    );
    accounts[accIdx].movements.push(loanAmount);
    inputLoanAmount.value = "";
    updateUI();
  } else {
    alert("I'm sorry. You aren't eligible !");
  }
};

calcUsername(accounts);
btnLogin.addEventListener("click", login);
btnSort.addEventListener("click", handleSortMovements);
btnClose.addEventListener("click", closeAccount);
btnLoan.addEventListener("click", checkLoanEligibility);
