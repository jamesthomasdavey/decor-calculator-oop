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

// get result elements
const marginAndResultsEl = document.querySelector(`.margin__and__results`);
const resultSpecsEl = document.querySelector(`.result__specs`);
const resultInnerWallEl = document.querySelector(`.result__inner-wall`);

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
  let i = null;
  if (!!document.querySelector(`h2.wall-item-title`)) {
    let id = document.querySelector(`h2.wall-item-title`).getAttribute(`id`);
    id = id.split(`-`);
    i = Number(id[id.length - 1]);
  }

  let wallWidth = Number(wallWidthEl.value);
  let itemWidth = Number(itemWidthEl.value);
  let itemQuantity = Number(itemQuantityEl.value);
  let unit = unitEl[document.querySelector(`#unit`).selectedIndex].value;
  maxMargin = Math.floor((wallWidth - (itemWidth * itemQuantity)) / (wallWidth) / 2 * 100);

  if (wallWidth == `` || itemWidth == `` || itemQuantity == ``) {
    console.log(`error1`);
  } else if (itemWidth * itemQuantity > wallWidth) {
    console.log(`error2`);
  } else if (wallWidth <= 0 || itemWidth <= 0 || itemQuantity <= 0) {
    console.log(`error3`);
  } else if (itemQuantity % 1 !== 0) {
    console.log(`error4`);
  } else {
    if (margin > maxMargin) {
      setMargin(maxMargin);
    }
    let userValues = {
      wallWidth,
      itemWidth,
      itemQuantity,
      margin,
      unit
    };
    calculate(userValues);
    marginAndResultsEl.style.maxHeight = `${marginAndResultsEl.scrollHeight}px`;
    if (i !== null) {
      if (i > itemQuantityEl.value - 1) {
        i = itemQuantityEl.value - 1;
      }
      displaySpecs(i);
    }
  }
}

// 
function calculate(userValues) {
  userValues = includeMargin(userValues);
  wallItems = createWallItems(userValues);
  resultInnerWallEl.innerHTML = createDivs(wallItems);
  displaySpecsTrigger(wallItems);
}

// accounts for margin by reducing wallwidth
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

function createWallItems(userValues) {
  let wallItems = [];
  for (let i = 0; i < userValues.itemQuantity; i++) {
    let wallItem = new WallItem(userValues, i);
    wallItems.push(wallItem);
  }
  return wallItems;
}

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

function displaySpecsTrigger(wallItems) {
  resultInnerWallEl.addEventListener(`click`, function (e) {
    let currentItem = e.target;
    if (currentItem.classList.contains(`wall-item`)) {
      let i = currentItem.getAttribute(`id`);
      displaySpecs(i);
    }
  });
}

function displaySpecs(i) {
  resultSpecsEl.innerHTML = `<h2 class="wall-item-title" id="wall-item-spec-${i}">Item ${wallItems[i].number}</h2>
    <p>Center: ${wallItems[i].center}</p>`;
  marginAndResultsEl.style.maxHeight = `${marginAndResultsEl.scrollHeight}px`;
}

function changeUnit() {
  document.querySelector(`#unit`).addEventListener(`change`, function () {
    setUnit();
    reEvaluate();
  });
}

function setUnit() {
  if (unitEl[document.querySelector(`#unit`).selectedIndex].value === `inches`) {
    wallWidthEl.setAttribute(`placeholder`, `WALL WIDTH (in)`);
    itemWidthEl.setAttribute(`placeholder`, `ITEM WIDTH (in)`);
  } else {
    wallWidthEl.setAttribute(`placeholder`, `WALL WIDTH (cm)`);
    itemWidthEl.setAttribute(`placeholder`, `ITEM WIDTH (cm)`);
  }
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
 ***************** RUN PROGRAM
 *****************************/

runProgram();
changeMargin();
changeUnit();
setUnit();