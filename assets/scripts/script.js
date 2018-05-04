/*****************************
 ************ GLOBAL VARIABLES
 *****************************/

// get form elements
const bodyEl = document.querySelector(`body`);
const wallWidthEl = document.querySelector(`#wall-width`);
const itemWidthEl = document.querySelector(`#item-width`);
const itemQuantityEl = document.querySelector(`#item-quantity`);
const unitEl = document.getElementsByClassName(`unit`);
const marginAmountEl = document.querySelector(`.margin__amount`);
const marginDecreaseEl = document.querySelector(`.margin__decrease`);
const marginIncreaseEl = document.querySelector(`.margin__increase`);

// get submit elements
const calculateEl = document.querySelector(`#calculate`);
const resetEl = document.querySelector(`#reset`);

// get result elements
const marginAndResultsEl = document.querySelector(`.margin__and__results`);
const resultSpecsEl = document.querySelector(`.result__specs`);
const resultInnerWallEl = document.querySelector(`.result__inner-wall`);
const errorEl = document.querySelector(`.error`);
const errorDescriptionEl = document.querySelector(`.error__description`);

// create items to be accessible in global scope
let wallItems = [];
let margin = 0;
let maxMargin = 0;

/*****************************
 *********** PROGRAM FUNCTIONS
 *****************************/

function runProgram() {
  calculateEl.addEventListener(`click`, evaluate);
  bodyEl.addEventListener(`keypress`, function (e) {
    if (e.keyCode === 13) {
      evaluate();
    }
  });
}

// evaluate form for errors then calculate
function evaluate() {

  //hides errors that may have occured earlier
  errorEl.classList.add(`hide`);

  // checks if item specs were previously on display, and gets reference number
  let i = null;
  if (!!document.querySelector(`h2.wall-item-title`)) {
    let id = document.querySelector(`h2.wall-item-title`).getAttribute(`id`);
    id = id.split(`-`);
    i = Number(id[id.length - 1]);
  }

  // grabs values from html elements
  let wallWidth = Number(wallWidthEl.value);
  let itemWidth = Number(itemWidthEl.value);
  let itemQuantity = Number(itemQuantityEl.value);
  let unit = unitEl[document.querySelector(`#unit`).selectedIndex].value;
  maxMargin = Math.floor((wallWidth - (itemWidth * itemQuantity)) / (wallWidth) / 2 * 100);

  // scans for errors, and sends error code to error function
  if (wallWidth == `` || itemWidth == `` || itemQuantity == ``) {
    error(1);
  } else if (wallWidth <= 0 || itemWidth <= 0 || itemQuantity <= 0) {
    error(2);
  } else if (itemWidth * itemQuantity > wallWidth) {
    error(3);
  } else if (itemQuantity % 1 !== 0) {
    error(4);
  } else {

    // if margin is too large, it sets margin to maximum
    if (margin > maxMargin) {
      setMargin(maxMargin);
    }

  // stores values into object
    let userValues = {
      wallWidth,
      itemWidth,
      itemQuantity,
      margin,
      unit
    };

    // runs calculation function using uservalues as an argument
    calculate(userValues);

    // makes margin visible and takes you there
    marginAndResultsEl.style.maxHeight = `${marginAndResultsEl.scrollHeight}px`;
    setTimeout(function () {
      window.location.href = `#margin__and__results`;
    }, 201);

    // uses the reference number from before to display the correct specs
    if (i !== null) {
      if (i > itemQuantityEl.value - 1) {
        i = itemQuantityEl.value - 1;
      }
      displaySpecs(i);
    }
  }
}

// displays error messages depending on error code
function error(num) {
  switch (num) {
    case 1:
      errorDescriptionEl.innerHTML = `All fields are required.`;
      errorEl.classList.remove(`hide`);
      window.location.href = `#error`;
      break;
    case 2:
      errorDescriptionEl.innerHTML = `Please enter only positive values.`;
      errorEl.classList.remove(`hide`);
      window.location.href = `#error`;
      break;
    case 3:
      errorDescriptionEl.innerHTML = `Not enough wall space!`;
      errorEl.classList.remove(`hide`);
      window.location.href = `#error`;
      break;
    case 4:
      errorDescriptionEl.innerHTML = `Quantity must be a whole number.`;
      errorEl.classList.remove(`hide`);
      window.location.href = `#error`;
      break;
  }
}

// main part of function
function calculate(userValues) {
  userValues = includeMargin(userValues);
  wallItems = createWallItems(userValues);
  resultInnerWallEl.innerHTML = createDivs(wallItems);
  displaySpecsTrigger(wallItems);
}

// accounts for margin by replacing wallwidth with reduced size
function includeMargin(userValues) {
  let {
    margin,
    wallWidth
  } = userValues;
  let wallWidthPercent = 100 - (margin) * 2;
  let newWidth = (wallWidthPercent / 100) * wallWidth;
  userValues.leftOver = (wallWidth - (wallWidth * wallWidthPercent / 100)) / 2;
  userValues.wallWidth = newWidth;
  document.querySelector(`.result__inner-wall`).style.width = `${wallWidthPercent}%`;
  return userValues;
}

// creates a new object for each wall item
function createWallItems(userValues) {
  let wallItems = [];
  for (let i = 0; i < userValues.itemQuantity; i++) {
    let wallItem = new WallItem(userValues, i);
    wallItems.push(wallItem);
  }
  return wallItems;
}

// constructor for wall items
function WallItem(userValues, i) {
  let {
    wallWidth,
    itemWidth,
    itemQuantity,
    leftOver,
    unit
  } = userValues;
  this.number = `${i+1}`;
  this.width = itemWidth;
  this.widthPercent = (itemWidth / wallWidth) * 100;
  let spaceBetween = (wallWidth - itemWidth * itemQuantity) / (itemQuantity + 1);
  let number = ((i + 1) * spaceBetween) + (i * itemWidth) + (itemWidth / 2) + leftOver;
  this.center = rounder(number, unit);
}

// creates a div for each wall item
function createDivs(wallItems) {
  let divs = ``;
  for (let i = 0; i < wallItems.length; i++) {
    divs += `
  <div class="wall-item" id="${i}" style="width: ${wallItems[i].widthPercent}%">
    <p class="wall-item-number">${wallItems[i].number}</p>
  </div>
  `
  }
  return divs;
}

// adds event listener to display specs for item corresponding to div
function displaySpecsTrigger(wallItems) {
  resultInnerWallEl.addEventListener(`click`, function (e) {
    let currentItem = e.target;
    if (currentItem.classList.contains(`wall-item`)) {
      let i = currentItem.getAttribute(`id`);
      displaySpecs(i);
      setTimeout(function () {
        window.location.href = "#result__specs";
      }, 210);
    }
  });
}

function displaySpecs(i) {
  resultSpecsEl.innerHTML = `<h2 class="wall-item-title" id="wall-item-spec-${i}">Item ${wallItems[i].number}</h2>
    <p>Center: ${wallItems[i].center}</p>`;
  marginAndResultsEl.style.maxHeight = `${marginAndResultsEl.scrollHeight}px`;
  changeUnit();
}

function changeUnit() {
  document.querySelector(`#unit`).addEventListener(`change`, function () {
    evaluate();
  });
}

function changeMargin() {
  marginDecreaseEl.addEventListener(`click`, function () {
    if (margin > 0) {
      margin--;
      marginAmountEl.innerHTML = `${margin}%`;
      evaluate();
    }
  });
  marginIncreaseEl.addEventListener(`click`, function () {
    if (margin < maxMargin) {
      margin++;
      marginAmountEl.innerHTML = `${margin}%`;
      evaluate();
    }
  });
}

function setMargin(i) {
  margin = i;
  marginAmountEl.innerHTML = `${margin}%`;
  evaluate();
}

function resetForm() {
  resetEl.addEventListener(`click`, function () {
    wallWidthEl.value = ``;
    itemWidthEl.value = ``;
    itemQuantityEl.value = ``;
    marginAndResultsEl.style.maxHeight = null;
    margin = 0;
    marginAmountEl.innerHTML = `${margin}%`;
    wallWidthEl.focus();
  });
}

/*****************************
 ********* FRACTION CONVERSION
 *****************************/

function rounder(number, unit) {
  if (unit === `inches`) {
    return toFraction(Math.round(16 * number) / 16) + `"`;
  } else {
    return Math.round(10 * number) / 10 + `cm`;
  }
}

function toFraction(number) {
  if (number % 1 === 0) {
    return number.toString();
  } else {
    let newNumber = ``;
    newNumber += number - number % 1;
    newNumber += ` ${decimalToFraction(number % 1)}`;
    return newNumber;
  }
};

function decimalToFraction(number) {
  var numerator = 1.0;
  var denominator = 1.0;
  if (number === 0.0) {
    return "0/1";
  }
  var isNegative = number < 0.0;
  if (isNegative) {
    number = number - number * 2;
  }
  while (numerator / denominator !== number) {
    if (numerator / denominator < number) {
      numerator++;
      denominator--;
    } else if (numerator / denominator > number) {
      denominator++;
    }
  }
  if (isNegative) {
    return "-" + numerator.toString() + "/" + denominator.toString();
  }
  return numerator.toString() + "/" + denominator.toString();
};

/*****************************
 ************************* NAV
 *****************************/

const navEl = document.querySelector(`.nav`);
const hamburgerEl = document.querySelector(`.hamburger`);
const hamburgerBarEls = document.querySelectorAll(`.bar`);
const containerEl = document.querySelector(`.container`);
const aboutEl = document.querySelector(`#about`);
const aboutPageEl = document.querySelector(`.nav__about`);
const navAboutCloseEl = document.querySelector(`.nav__about-close`);

function openNav() {
  hamburgerEl.addEventListener(`click`, function () {
    navEl.classList.toggle(`change`);
    containerEl.classList.toggle(`change`);
    for (let bar of hamburgerBarEls) {
      bar.classList.toggle(`change`);
    }
    setTimeout(function () {
      aboutPageEl.classList.remove(`change`);
    }, 300);
  })
}

function openAbout() {
  aboutEl.addEventListener(`click`, function () {
    aboutPageEl.classList.add(`change`);
  })
}

function closeAbout() {
  navAboutCloseEl.addEventListener(`click`, function () {
    aboutPageEl.classList.remove(`change`);
  })
}

/*****************************
 ***************** RUN PROGRAM
 *****************************/

runProgram();
changeMargin();
resetForm();

openNav();
openAbout();
closeAbout();