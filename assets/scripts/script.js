const userValues = {
  wallWidth: document.querySelector(`#wall-width`),
  itemWidth: document.querySelector(`#item-width`),
  itemQuantity: document.querySelector(`#item-quantity`),
};

let {
  wallWidth,
  itemWidth,
  itemQuantity
} = userValues;

let unit = document.getElementsByClassName(`unit`);
const calculateButton = document.querySelector(`#calculate`);
let resultDiagram = document.querySelector(`.result__diagram`);
let resultSpecs = document.querySelector(`.result__specs`);

function setUnit() {
  if (unit[document.querySelector(`#unit`).selectedIndex].value === `inches`) {
    wallWidth.setAttribute(`placeholder`, `Wall Width (in)`);
    itemWidth.setAttribute(`placeholder`, `Item Width (in)`)
  } else {
    wallWidth.setAttribute(`placeholder`, `Wall Width (cm)`);
    itemWidth.setAttribute(`placeholder`, `Item Width (cm)`);
  }
  document.querySelector(`#unit`).addEventListener(`change`, setUnit);
}

function clickCalculate() {
  calculateButton.addEventListener(`click`, doEverything);
}









function doEverything() {

  // gets user-inputted values from the form
  let myWallWidth = Number(wallWidth.value);
  let myItemWidth = Number(itemWidth.value);
  let myItemQuantity = Number(itemQuantity.value);
  let wallItems = [];
  for (let i=0; i<myItemQuantity; i++) {
    let wallItem = new WallItem(i, myWallWidth, myItemWidth, myItemQuantity);
    wallItems.push(wallItem);
  }
  let resultDiagramHTML = ``
  for (let i=0; i<wallItems.length; i++) {
    let newWallItem = `<div class="wall-item" id="${wallItems[i].number}" style="width: ${wallItems[i].widthPercent}%">
    <p class="wall-item-number">${Number(wallItems[i].number) + 1}</p>
    </div>`;
    resultDiagramHTML += newWallItem;
  }
  resultDiagram.innerHTML = resultDiagramHTML;
  resultDiagram.addEventListener(`click`, function(e) {
    if (e.target.classList.contains(`wall-item`)) {
      let parentPos = e.target.parentNode.getBoundingClientRect();
      let childPos = e.target.getBoundingClientRect();
      let relativePos = childPos.left - parentPos.left;
      let centerPoint = ((relativePos / e.target.parentNode.scrollWidth) + ((myItemWidth/myWallWidth) / 2)) * myWallWidth;
      centerPoint = rounder(centerPoint);
      let i = e.target.getAttribute(`id`);
      // let centerPoint = wallItems[i].center;
      resultSpecs.innerHTML = `<h2>Item ${Number(wallItems[i].number) + 1}</h2>
      <p>Center: ${centerPoint}</p>`;
    }
  })
}

function WallItem(i, myWallWidth, myItemWidth, myItemQuantity) {
  this.number = `${i}`;
  this.width = myItemWidth;
  this.widthPercent = (myItemWidth / myWallWidth) * 100;
  let spaceBetween = (myWallWidth - myItemWidth * myItemQuantity) / (myItemQuantity + 1);
  this.center = ((i + 1) * spaceBetween) + (i * myItemWidth) + (myItemWidth/2);
  this.left = this.center - (myItemWidth/2);
  this.right = this.center + (myItemWidth/2);
}

function displaySpecs(e) {

}

function rounder(num) {
  let myUnit = unit[document.querySelector(`#unit`).selectedIndex].value;
  if (myUnit === `inches`) {
    return toFraction(Math.round(16 * num) / 16) + `"`;
  } else {
    return Math.round(10 * num) / 10 + `cm`;
  }
}

let toFraction = num => {
  if (num % 1 === 0) {
    return num.toString();
  } else {
    let newNum = ``;
    newNum += num - num % 1;
    newNum += ` ${decimalToFraction(num % 1)}`;
    return newNum;
  }
};

let decimalToFraction = number => {
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




setUnit();
clickCalculate();