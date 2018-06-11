/*****************************
 ************ GLOBAL VARIABLES
 *****************************/

const bodyEl = document.querySelector(`body`); // only need this for the keypress event listener

// get form elements
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
const resultOuterWallEl = document.querySelector(`.result__outer-wall`)
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

// enables click and pressing enter
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
    i = Number(document.querySelector(`h2.wall-item-title`).getAttribute(`id`));
  }

  // grabs values from html elements
  let wallWidth = Number(wallWidthEl.value);
  let itemWidth = Number(itemWidthEl.value);
  let itemQuantity = Number(itemQuantityEl.value);
  let unit = unitEl[document.querySelector(`#unit`).selectedIndex].value;

  // calculates maximum amount of margin allowed on sides
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

    // if margin is too large, it sets margin to maxMargin
    if (margin > maxMargin) {
      margin = maxMargin;
    }

    // stores values into object
    let userValues = {
      wallWidth,
      itemWidth,
      itemQuantity,
      margin,
      unit
    };

    // runs calculation function using uservalues as an argument. the "i" indicates the wallItem number from the prior session (if it exists) so that it can be displayed at the end of the calculate function
    calculate(userValues, i);
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
function calculate(userValues, i) {
  userValues = calcInnerWallWidth(userValues);
  wallItems = createWallItems(userValues);
  addToHTML(wallItems);
  // uses the reference number from before to display the correct specs
  if (i !== null) {
    if (i > itemQuantityEl.value - 1) {
      i = itemQuantityEl.value - 1;
    }
    resultSpecsEl.innerHTML = wallItems[i].specs;
  } else {
    resultSpecsEl.innerHTML = wallItems[0].specs;
  }
  marginAmountEl.innerHTML = `${margin}%`;
  marginAndResultsEl.style.maxHeight = `${marginAndResultsEl.scrollHeight}px`;
  setTimeout(function () {
    window.location.href = `#result`;
  }, 205);
}

// accounts for margin by replacing wallwidth with reduced size
function calcInnerWallWidth(userValues) {
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

  // constructor for wall items
  function WallItem(userValues, i) {
    let {
      wallWidth,
      itemWidth,
      itemQuantity,
      leftOver,
      unit
    } = userValues;
    this.i = i;
    this.width = itemWidth;
    this.widthPercent = (itemWidth / wallWidth) * 100;
    let spaceBetween = (wallWidth - itemWidth * itemQuantity) / (itemQuantity + 1);
    let number = ((this.i + 1) * spaceBetween) + (this.i * itemWidth) + (itemWidth / 2) + leftOver;
    this.center = rounder(number, unit);
    this.div = `<div class="wall-item" id="${this.i}" style="width: ${this.widthPercent}%">
    <p class="wall-item-number">${this.i + 1}</p>
  </div>`;
    this.specs = `<h2 class="wall-item-title" id="${this.i}">Item ${this.i + 1}</h2>
  <p>Center: ${this.center}</p>`;
  }

  // loop to use constructor
  for (let i = 0; i < userValues.itemQuantity; i++) {
    let wallItem = new WallItem(userValues, i);
    wallItems.push(wallItem);
  }
  return wallItems;
}

// clears any possible wall item divs and adds them back
function addToHTML(wallItems) {
  resultInnerWallEl.innerHTML = ``;
  for (let wallItem of wallItems) {
    resultInnerWallEl.innerHTML += wallItem.div;
  }
}

// adds event listener to display specs for item corresponding to div
function displaySpecsTrigger() {
  resultOuterWallEl.addEventListener(`click`, function (e) {
    let currentItem = e.target;
    if (currentItem.classList.contains(`wall-item`)) {
      let i = currentItem.getAttribute(`id`);
      resultSpecsEl.innerHTML = wallItems[i].specs;
    }
  });
}

// listens for a unit change. if there are result specs on display, it evaluates again
function changeUnit() {
  document.querySelector(`#unit`).addEventListener(`change`, function () {
    setInitialUnit();
    let i = null;
    if (!!document.querySelector(`h2.wall-item-title`)) {
      i = Number(document.querySelector(`h2.wall-item-title`).getAttribute(`id`));
    }
    if (i !== null) {
      evaluate();
    }
  });
}

// listens for margin change and evaluates again. does not need to check for result specs, since users would not be able to see margin change if result specs were unavailable
function changeMargin() {
  marginDecreaseEl.addEventListener(`click`, function () {
    if (margin > 0) {
      margin--;
      evaluate();
    }
  });
  marginIncreaseEl.addEventListener(`click`, function () {
    if (margin < maxMargin) {
      margin++;
      evaluate();
    }
  });
}

// resets the whole form, brings user back to the top of the page, and focuses on the first form item
function resetForm() {
  resetEl.addEventListener(`click`, function () {
    wallWidthEl.value = ``;
    itemWidthEl.value = ``;
    itemQuantityEl.value = ``;
    resultSpecsEl.innerHTML = ``;
    margin = 0;
    marginAmountEl.innerHTML = `${margin}%`;
    marginAndResultsEl.style.maxHeight = null;
    errorEl.classList.add(`hide`);
    window.location.href = `#`;
    wallWidthEl.focus();
  });
}

function setInitialUnit() {
  let unit = unitEl[document.querySelector(`#unit`).selectedIndex].value;
  if (unit === `inches`) {
    wallWidthEl.setAttribute(`placeholder`, `WALL WIDTH (in)`);
    itemWidthEl.setAttribute(`placeholder`, `ITEM WIDTH (in)`);
  } else if (unit === `centimeters`) {
    wallWidthEl.setAttribute(`placeholder`, `WALL WIDTH (cm)`);
    itemWidthEl.setAttribute(`placeholder`, `ITEM WIDTH (cm)`);
  }
}

/*****************************
 ********* FRACTION CONVERSION
 *****************************/

// rounds the number to appropriate decimal place depending on the unit, and sends it to toFraction if the unit is inches
function rounder(number, unit) {
  if (unit === `inches`) {
    return toFraction(Math.round(16 * number) / 16) + `"`;
  } else {
    return Math.round(10 * number) / 10 + `cm`;
  }
}

// splits the non-whole part of the number and sends it to decimalToFraction
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

// converts any decimal to a fraction. this was stolen from somebody else
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
displaySpecsTrigger();
changeUnit();
setInitialUnit();

openNav();
openAbout();
closeAbout();