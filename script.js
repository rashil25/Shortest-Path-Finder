/* ------------------------------------ */
/* ---- Var Declarations & Preamble---- */
/* ------------------------------------ */

var totalRows = 25;
var totalCols = 40;
var inProgress = false;
var cellsToAnimate = [];
var createWalls = false;
var algorithm = null;
var justFinished = false;
var animationSpeed = "Fast";
var animationState = null;
var startCell = [11, 15];
var endCell = [11, 25];
var movingStart = false;
var movingEnd = false;

// here we are creating the table of the requirede size on which we would find the path.

function generateGrid(rows, cols) {
    var tbl = document.createElement("table");
    for (row = 1; row <= rows; row++) {
        let row = document.createElement("tr");
        for (col = 1; col <= cols; col++) {
            let cell = document.createElement("td");
            row.appendChild(cell);
        }
        tbl.appendChild(row);
    }
    return tbl;
}

var myGrid = generateGrid(totalRows, totalCols);
document.getElementById("tableContainer").appendChild(myGrid);

/* ------------------------- */
/* ---- MOUSE FUNCTIONS ---- */
/* ------------------------- */

var xx = document.getElementsByTagName('TD');
for (let i = 0; i < xx.length; i = i + 1) {
    xx[i].addEventListener('mousedown', () => {
        var index = i;
        var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
        var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
        if (!inProgress) {
            // Clear board if just finished
            if (justFinished && !inProgress) {
                clearBoard(keepWalls = true);
                justFinished = false;
            }
            if (index == startCellIndex) {
                movingStart = true;

            } else if (index == endCellIndex) {
                movingEnd = true;

            } else {
                createWalls = true;
            }
        }
    });
}

for (let i = 0; i < xx.length; i = i + 1) {
    xx[i].addEventListener('mouseup', () => {
        createWalls = false;
        movingStart = false;
        movingEnd = false;
    });
}
for (let i = 0; i < xx.length; i = i + 1) {
    xx[i].addEventListener('mousemove', function() {
        if (!createWalls && !movingStart && !movingEnd) { return; }
        var index = i;
        var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
        var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
        if (!inProgress) {
            if (justFinished) {
                clearBoard(keepWalls = true);
                justFinished = false;
            }
            //console.log("Cell index = " + index);
            if (movingStart && index != endCellIndex) {
                moveStartOrEnd(startCellIndex, index, "start");
            } else if (movingEnd && index != startCellIndex) {
                moveStartOrEnd(endCellIndex, index, "end");
            } else if (index != startCellIndex && index != endCellIndex) {
                this.classList.toggle('wall');
            }
        }
    });
}

for (let i = 0; i < xx.length; i = i + 1) {
    xx[i].addEventListener('click', function() {
        var index = i;
        var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
        var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
        if ((inProgress == false) && !(index == startCellIndex) && !(index == endCellIndex)) {
            if (justFinished) {
                clearBoard(keepWalls = true);
                justFinished = false;
            }
            this.classList.toggle('wall');
        }
    });
}
var xxx = document.getElementsByTagName('BODY')[0];
xxx.addEventListener('mouseup', () => {
    createWalls = false;
    movingStart = false;
    movingEnd = false;
});

/* ----------------- */
/* ---- BUTTONS ---- */
/* ----------------- */

document.getElementById("startBtn").addEventListener('click', function() {
    if (algorithm == null) { return; }
    if (inProgress) { update("wait"); return; }
    traverseGraph(algorithm);
});

document.getElementById("clearBtn").addEventListener('click', function() {
    if (inProgress) { update("wait"); return; }
    clearBoard(keepWalls = false);
});


/* --------------------- */
/* --- NAV BAR MENUS --- */
/* --------------------- */

var xxxx = document.getElementsByClassName('dropdown-item');
for (let i = 0; i < xxxx.length; i = i + 1)
    xxxx[i].addEventListener('click', () => {
        if (inProgress) { update("wait"); return; }
        algorithm = xxxx[i].innerHTML;
        updateStartBtnText();
        console.log("Algorithm has been changd to: " + algorithm);
    });

/* ----------------- */
/* --- FUNCTIONS --- */
/* ----------------- */

function moveStartOrEnd(prevIndex, newIndex, startOrEnd) {
    var newCellY = newIndex % totalCols;
    var newCellX = Math.floor((newIndex - newCellY) / totalCols);
    if (startOrEnd == "start") {
        startCell = [newCellX, newCellY];
        console.log("Moving start to [" + newCellX + ", " + newCellY + "]")
    } else {
        endCell = [newCellX, newCellY];
        console.log("Moving end to [" + newCellX + ", " + newCellY + "]")
    }
    clearBoard(keepWalls = true);
    return;
}

function updateStartBtnText() {
    if (algorithm == "Depth-First Search (DFS)") {
        document.getElementById("startBtn").innerHTML = ("Start DFS");
    } else if (algorithm == "Breadth-First Search (BFS)") {
        document.getElementById("startBtn").innerHTML = ("Start BFS");
    } else if (algorithm == "Dijkstra") {
        document.getElementById("startBtn").innerHTML = ("Start Dijkstra");
    } else if (algorithm == "A*") {
        document.getElementById("startBtn").innerHTML = ("Start A*");
    } else if (algorithm == "Greedy Best-First Search") {
        document.getElementById("startBtn").innerHTML = ("Start Greedy BFS");
    }
    return;
}

// Used to display error messages
function update(message) {
    document.getElementById("resultsIcon").classList.remove();
    document.getElementById("resultsIcon").classList.add("fa-exclamation");
    document.getElementById('results').style.backgroundColor = '#ffc107';
    document.getElementById("length").textContent = "";
    if (message == "wait") {
        document.getElementById("duration").textContent = "Please wait for the algorithm to finish.";
    }
}

// Used to display results
function updateResults(duration, pathFound, length) {
    var firstAnimation = "swashOut";
    var secondAnimation = "swashIn";
    document.getElementById("resultsIcon").classList.remove('fa-exclamation');
    document.getElementById("results").classList.add("magictime-" + firstAnimation);
    setTimeout(function() {
        document.getElementById("resultsIcon").classList.remove();
        if (pathFound) {
            document.getElementById('results').style.backgroundColor = '#77dd77';
            document.getElementById("resultsIcon").classList.add("fa-check");
        } else {
            document.getElementById('results').style.backgroundColor = '#ff6961';
            document.getElementById("resultsIcon").classList.add("fa-times");
        }
        document.getElementById("duration").textContent = "Duration: " + duration + " ms";
        document.getElementById("length").textContent = "Length: " + length;
        document.getElementById("resultsIcon").classList.remove(firstAnimation);
        document.getElementById("results").classList.add(secondAnimation);
    }, 1100);
}

// Counts length of success
function countLength() {
    var cells = document.getElementsByTagName("td");
    var l = 0;
    for (var i = 0; i < cells.length; i++) {
        if ((cells[i]).classList.contains("success")) {
            l++;
        }
    }
    return l;
}

async function traverseGraph(algorithm) {
    inProgress = true;
    clearBoard(keepWalls = true);
    var startTime = Date.now();
    var pathFound = executeAlgo();
    var endTime = Date.now();
    await animateCells();
    if (pathFound) {
        anime();
        updateResults((endTime - startTime), true, countLength());
    } else {
        updateResults((endTime - startTime), false, countLength());
    }
    inProgress = false;
    justFinished = true;
}

function executeAlgo() {
    if (algorithm == "Depth-First Search (DFS)") {
        var visited = createVisited();
        var pathFound = DFS(startCell[0], startCell[1], visited);
    } else if (algorithm == "Breadth-First Search (BFS)") {
        var pathFound = BFS();
    } else if (algorithm == "Dijkstra") {
        var pathFound = dijkstra();
    } else if (algorithm == "A*") {
        var pathFound = AStar();
    } else if (algorithm == "Greedy Best-First Search") {
        var pathFound = greedyBestFirstSearch();
    }
    return pathFound;
}

async function animateCells() {
    animationState = null;
    var cells = document.getElementsByTagName('td');
    var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
    var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
    var delay = 10;
    for (var i = 0; i < cellsToAnimate.length; i++) {
        var cellCoordinates = cellsToAnimate[i][0];
        var x = cellCoordinates[0];
        var y = cellCoordinates[1];
        var num = (x * (totalCols)) + y;
        if (num == startCellIndex || num == endCellIndex) { continue; }
        var cell = cells[num];
        var colorClass = cellsToAnimate[i][1];
        await new Promise(resolve => setTimeout(resolve, delay));

        (cell).className = '';
        (cell).classList.add(colorClass);
    }
    cellsToAnimate = [];
    return new Promise(resolve => resolve(true));
}

function clearBoard(keepWalls) {
    var cells = document.getElementsByTagName('td');
    var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
    var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
    for (var i = 0; i < cells.length; i++) {
        isWall = (cells[i]).classList.contains("wall");
        (cells[i]).className = '';
        if (i == startCellIndex) {
            (cells[i]).classList.add("start");
        } else if (i == endCellIndex) {
            (cells[i]).classList.add("end");
        } else if (keepWalls && isWall) {
            (cells[i]).classList.add("wall");
        }
    }
}

clearBoard();

function anime() {
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
};