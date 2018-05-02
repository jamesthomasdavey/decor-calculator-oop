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
      let i = e.target.getAttribute(`id`);
      let centerPoint = wallItems[i].center;
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







setUnit();
clickCalculate();