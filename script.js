const gridContainer = document.querySelector('#grid');
const newButton = document.querySelector('#new');
const clearButton = document.querySelector('#clear');
const radioButtons = document.querySelector('#radio-buttons');
const colorPicker = document.querySelector('#color-picker');

var cell = [];
var currentlyActive = false;

// Activating or deactivating (toggling) the pen on click
gridContainer.addEventListener('click', function() { togglePen()});

// Range slider and displaying the number of cells in a paragraph
var rangeSlider = document.querySelector('#range-slider');
rangeSlider.value = 16;
var paraNrOfCells = document.querySelector('#para-nr-of-cells');
paraNrOfCells.textContent = rangeSlider.value;

rangeSlider.addEventListener('mousemove', function() {
    paraNrOfCells.textContent = rangeSlider.value;
});

// Color theme radio buttons
radioButtons.addEventListener('click', function(){
    if(radioButtons.color.value == 'darken') {
        cell.forEach(item => {
            item.dataset.darken = 0; //reset # of steps needed to get to black
        })
    }
});

// Setting the default color
radioButtons.color.value = 'default';

// Color picker's default color
colorPicker.value = '0';

// Initializing the grid
createGrid(rangeSlider.value);

// Clear the grid
clearButton.addEventListener('click', clear);

// Reset the grid
newButton.addEventListener('click', function() {
  clear();
  createGrid(rangeSlider.value);
});

// FUNCTIONS:

// Create a grid with desirable number of cells per side
function createGrid(cellsPerSide) {
    removeCells();
    gridContainer.style.gridTemplateColumns = (`repeat(${cellsPerSide}, 1fr`);
    gridContainer.style.gridTemplateRows = (`repeat(${cellsPerSide}, 1fr`);
    let numberOfCells = cellsPerSide * cellsPerSide;

    for (let i = 0; i < numberOfCells; i++) {
        cell[i] = document.createElement('div');
        cell[i].classList.add('cell');
        cell[i].dataset.darken = 0;
        cell[i].style = 'background-color: rgba(255, 255, 255, 1)';
        cell[i].addEventListener('click', activatePen);
        gridContainer.appendChild(cell[i]);
    }
}

function removeCells() {
    while(gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
}

function clear() {
    cell.forEach(item => {
        item.style = 'background-color: rgba(255, 255, 255, 1)';
        item.removeEventListener('mouseenter', activatePen);
        item.dataset.darken = 0;
    });

    currentlyActive = false;
}

function togglePen() {
    if(!currentlyActive) {
        cell.forEach(item => {
            item.addEventListener('mouseleave', activatePen);
        });

        currentlyActive = true;
    } else {
        cell.forEach(item => {
            item.removeEventListener('mouseleave', activatePen);
        });

        currentlyActive = false;
    }
}

function activatePen(e) {
    colorTheme = radioButtons.color.value;

    switch(colorTheme) {
        case('user'):
            currentColor = colorPicker.value;
            e.target.style = `background-color: ${currentColor}`;
            break;
        case('darken'):
            currentColor = darken(e);
            e.target.style = `background-color: rgba(${currentColor})`
            break;
        case('random'):
            currentColor = randomColor();
            e.target.style = `background-color: rgba(${currentColor})`;
            break;
        default:
            currentColor = [0, 0, 0];
            e.target.style = `background-color: rgb(${currentColor})`;
    }
}

// Darkening function
function darken(e) {
    let oldColor = e.target.style.backgroundColor;
    let rgbaString = (oldColor.charAt(3) == 'a') ? oldColor.slice(5, -1) : oldColor.slice(4, -1);
    let rgbaArray = rgbaString.split(',');

    // rgba values
    let red = rgbaArray[0];
    let green = rgbaArray[1];
    let blue = rgbaArray[2];
    let alpha = rgbaArray[3] ? rgbaArray[3] : 1;

    let currentDarkeningStep = e.target.dataset.darken;
    if(currentDarkeningStep == 9) return [0, 0, 0, 1];

    // New rgba values
    let newRed = getNewColorValue(red, currentDarkeningStep, false);
    let newGreen = getNewColorValue(green, currentDarkeningStep, false);
    let newBlue = getNewColorValue(blue, currentDarkeningStep, false);
    let newAlpha = getNewColorValue(alpha, currentDarkeningStep, true);

    currentDarkeningStep++;
    e.target.dataset.darken = currentDarkeningStep;

    return [newRed, newGreen, newBlue, newAlpha];
}

function getNewColorValue(currentColorValue, step, alpha) {
    let increment;
    let newValue;

    if (!alpha) {
        increment = currentColorValue / (10 - step);
        newValue = currentColorValue - increment;
    } else {
        increment = (1 - currentColorValue) / (10 - step);
        newValue = +currentColorValue + increment; 
    }

    return (newValue);
}

// Random color
function randomColor() {
    let red = Math.floor(Math.random() * 200);
    let green = Math.floor(Math.random() * 200);
    let blue = (Math.floor(Math.random() * 200));
    let alpha = (0.5 * Math.random() + 0.5);

    return [red, green, blue, alpha];
} 


