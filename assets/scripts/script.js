function runProgram() {
  const calculateEl = document.querySelector(`#calculate`);
  const bodyEl = document.querySelector(`body`);
  calculateEl.addEventListener(`click`, evaluate);
  bodyEl.addEventListener(`keypress`, function (e) {
    if (e.keyCode === 13) {
      evaluate();
    }
  })
}

function evaluate() {
  const wallWidthEl = document.querySelector(`#wall-width`);
  const itemWidthEl = document.querySelector(`#item-width`);
  const itemQuantityEl = document.querySelector(`#item-quantity`);
  const marginsEl = document.querySelector(`#side-margins`);
  const unitEl = document.getElementsByClassName(`unit`);


  let wallWidth = Number(wallWidthEl.value);
  let itemWidth = Number(itemWidthEl.value);
  let itemQuantity = Number(itemQuantityEl.value);
  let margins = Number(marginsEl.value);
  let unit = unitEl[document.querySelector(`#unit`).selectedIndex].value;
  let userValues = {
    wallWidth,
    itemWidth,
    itemQuantity,
    margins,
    unit
  };
  calculate(userValues);
}

function calculate(userValues) {
  const resultInnerWallEl = document.querySelector(`.result__inner-wall`);
  const resultSpecsEl = document.querySelector(`.result__specs`);
  userValues = includeMargins(userValues);
  let wallItems = createWallItems(userValues);
  resultInnerWallEl.innerHTML = createDivs(wallItems);
  displaySpecs(resultInnerWallEl, resultSpecsEl, wallItems);

}

function includeMargins(userValues) {
  let {margins, wallWidth} = userValues;
  let wallWidthPercent = 100 - (margins * 2);
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
  this.title = `Item ${i+1}`;
  this.wallWidth = wallWidth;
  this.width = itemWidth;
  this.widthPercent = (itemWidth / wallWidth) * 100;
  this.unit = unit;
  let spaceBetween = (wallWidth - itemWidth * itemQuantity) / (itemQuantity + 1);
  this.center = ((i + 1) * spaceBetween) + (i * itemWidth) + (itemWidth / 2) + leftOver;
}

function createDivs(wallItems) {
  let divs = ``;
  for (let i = 0; i < wallItems.length; i++) {
    divs += `
    <div class="wall-item" id="${i}" style="width: ${wallItems[i].widthPercent}%">
      <p class="wall-item-title">${wallItems[i].title}</p>
    </div>
    `
  }
  return divs;
}

function displaySpecs(resultInnerWallEl, resultSpecsEl, wallItems) {
  resultInnerWallEl.addEventListener(`click`, function (e) {
    let currentItem = e.target;
    if (currentItem.classList.contains(`wall-item`)) {
      let i = currentItem.getAttribute(`id`);
      // centerPoint = rounder(centerPoint);
      resultSpecsEl.innerHTML = `<h2>${wallItems[i].title}</h2>
      <p>Center: ${wallItems[i].center}</p>`;
    }
  });
}

runProgram();





// let {wallWidth, itemWidth, itemQuantity, unit} = userValues;







// const userValues = {
//   wallWidth: document.querySelector(`#wall-width`),
//   itemWidth: document.querySelector(`#item-width`),
//   itemQuantity: document.querySelector(`#item-quantity`),
// };

// let {
//   wallWidth,
//   itemWidth,
//   itemQuantity
// } = userValues;

// let unit = document.getElementsByClassName(`unit`);
// const calculateButton = document.querySelector(`#calculate`);
// let resultDiagram = document.querySelector(`.result__diagram`);
// let resultSpecs = document.querySelector(`.result__specs`);

// function setUnit() {
//   if (unit[document.querySelector(`#unit`).selectedIndex].value === `inches`) {
//     wallWidth.setAttribute(`placeholder`, `Wall Width (in)`);
//     itemWidth.setAttribute(`placeholder`, `Item Width (in)`)
//   } else {
//     wallWidth.setAttribute(`placeholder`, `Wall Width (cm)`);
//     itemWidth.setAttribute(`placeholder`, `Item Width (cm)`);
//   }
//   document.querySelector(`#unit`).addEventListener(`change`, setUnit);
// }

// function clickCalculate() {
//   calculateButton.addEventListener(`click`, doEverything);
// }









// function doEverything() {

//   // gets user-inputted values from the form
//   let myWallWidth = Number(wallWidth.value);
//   let myItemWidth = Number(itemWidth.value);
//   let myItemQuantity = Number(itemQuantity.value);
//   let wallItems = [];
//   for (let i=0; i<myItemQuantity; i++) {
//     let wallItem = new WallItem(i, myWallWidth, myItemWidth, myItemQuantity);
//     wallItems.push(wallItem);
//   }
//   let resultDiagramHTML = ``
//   for (let i=0; i<wallItems.length; i++) {
//     let newWallItem = `<div class="wall-item" id="${wallItems[i].number}" style="width: ${wallItems[i].widthPercent}%">
//     <p class="wall-item-number">${Number(wallItems[i].number) + 1}</p>
//     </div>`;
//     resultDiagramHTML += newWallItem;
//   }
//   resultDiagram.innerHTML = resultDiagramHTML;
//   resultDiagram.addEventListener(`click`, function(e) {
//     if (e.target.classList.contains(`wall-item`)) {
//       let parentPos = e.target.parentNode.getBoundingClientRect();
//       let childPos = e.target.getBoundingClientRect();
//       let relativePos = childPos.left - parentPos.left;
//       let centerPoint = ((relativePos / e.target.parentNode.scrollWidth) + ((myItemWidth/myWallWidth) / 2)) * myWallWidth;
//       centerPoint = rounder(centerPoint);
//       let i = e.target.getAttribute(`id`);
//       // let centerPoint = wallItems[i].center;
//       resultSpecs.innerHTML = `<h2>Item ${Number(wallItems[i].number) + 1}</h2>
//       <p>Center: ${centerPoint}</p>`;
//     }
//   })
// }

// function WallItem(i, myWallWidth, myItemWidth, myItemQuantity) {
//   this.number = `${i}`;
//   this.width = myItemWidth;
//   this.widthPercent = (myItemWidth / myWallWidth) * 100;
//   let spaceBetween = (myWallWidth - myItemWidth * myItemQuantity) / (myItemQuantity + 1);
//   this.center = ((i + 1) * spaceBetween) + (i * myItemWidth) + (myItemWidth/2);
//   this.left = this.center - (myItemWidth/2);
//   this.right = this.center + (myItemWidth/2);
// }

// function displaySpecs(e) {

// }

// function rounder(num) {
//   let myUnit = unit[document.querySelector(`#unit`).selectedIndex].value;
//   if (myUnit === `inches`) {
//     return toFraction(Math.round(16 * num) / 16) + `"`;
//   } else {
//     return Math.round(10 * num) / 10 + `cm`;
//   }
// }

// let toFraction = num => {
//   if (num % 1 === 0) {
//     return num.toString();
//   } else {
//     let newNum = ``;
//     newNum += num - num % 1;
//     newNum += ` ${decimalToFraction(num % 1)}`;
//     return newNum;
//   }
// };

// let decimalToFraction = number => {
//   var numerator = 1.0;
//   var denominator = 1.0;
//   if (number === 0.0) {
//     return "0/1";
//   }
//   var isNegative = number < 0.0;
//   if (isNegative) {
//     number = number - number * 2;
//   }
//   while (numerator / denominator !== number) {
//     if (numerator / denominator < number) {
//       numerator++;
//       denominator--;
//     } else if (numerator / denominator > number) {
//       denominator++;
//     }
//   }
//   if (isNegative) {
//     return "-" + numerator.toString() + "/" + denominator.toString();
//   }
//   return numerator.toString() + "/" + denominator.toString();
// };




// setUnit();
// clickCalculate();