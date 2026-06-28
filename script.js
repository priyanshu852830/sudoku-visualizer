const board = document.getElementById("board");

let recursiveCalls = 0;
let backtracks = 0;

let customMode = false;
let paused = false;

let cells = [];

for(let i=0;i<9;i++){
    
    cells[i] = [];

    for(let j=0;j<9;j++){
        
        let cell = document.createElement("input");

        cell.addEventListener("input",()=>{

        let val = cell.value;

        if(
            val !== "" &&
            (isNaN(val) || val < 1 || val > 9)
        ){
            cell.value = "";
        }
        });

        cell.type = "text";
        cell.maxLength = 1;

        cell.classList.add("cell");

        if(i % 3 === 0)
        cell.style.borderTop = "4px solid black";

        if(j % 3 === 0)
        cell.style.borderLeft = "4px solid black";

        if(i === 8)
        cell.style.borderBottom = "4px solid black";

        if(j === 8)
        cell.style.borderRight = "4px solid black";

        board.appendChild(cell);
        cells[i][j] = cell;
    }
}

document.getElementById("generateBtn").onclick = generatePuzzle;

const easyPuzzles = [
[
[5,3,0,0,7,0,0,0,0],
[6,0,0,1,9,5,0,0,0],
[0,9,8,0,0,0,0,6,0],
[8,0,0,0,6,0,0,0,3],
[4,0,0,8,0,3,0,0,1],
[7,0,0,0,2,0,0,0,6],
[0,6,0,0,0,0,2,8,0],
[0,0,0,4,1,9,0,0,5],
[0,0,0,0,8,0,0,7,9]
],

[
[0,0,0,2,6,0,7,0,1],
[6,8,0,0,7,0,0,9,0],
[1,9,0,0,0,4,5,0,0],
[8,2,0,1,0,0,0,4,0],
[0,0,4,6,0,2,9,0,0],
[0,5,0,0,0,3,0,2,8],
[0,0,9,3,0,0,0,7,4],
[0,4,0,0,5,0,0,3,6],
[7,0,3,0,1,8,0,0,0]
]

];

const mediumPuzzles = [

[
[0,0,0,2,6,0,7,0,1],
[6,8,0,0,7,0,0,9,0],
[1,9,0,0,0,4,5,0,0],
[8,2,0,1,0,0,0,4,0],
[0,0,4,6,0,2,9,0,0],
[0,5,0,0,0,3,0,2,8],
[0,0,9,3,0,0,0,7,4],
[0,4,0,0,5,0,0,3,6],
[7,0,3,0,1,8,0,0,0]
],

[
[0,2,0,6,0,8,0,0,0],
[5,8,0,0,0,9,7,0,0],
[0,0,0,0,4,0,0,0,0],
[3,7,0,0,0,0,5,0,0],
[6,0,0,0,0,0,0,0,4],
[0,0,8,0,0,0,0,1,3],
[0,0,0,0,2,0,0,0,0],
[0,0,9,8,0,0,0,3,6],
[0,0,0,3,0,6,0,9,0]
],

[
[0,0,0,0,0,0,2,0,0],
[0,8,0,0,0,7,0,9,0],
[6,0,2,0,0,0,5,0,0],
[0,7,0,0,6,0,0,0,0],
[0,0,0,9,0,1,0,0,0],
[0,0,0,0,2,0,0,4,0],
[0,0,5,0,0,0,6,0,3],
[0,9,0,4,0,0,0,7,0],
[0,0,6,0,0,0,0,0,0]
]

];

const hardPuzzles = [

[
[0,0,0,0,0,0,0,1,2],
[0,0,0,0,3,5,0,0,0],
[0,0,1,0,0,0,0,0,0],
[0,0,0,5,0,0,4,0,7],
[0,0,4,0,0,0,2,0,0],
[8,0,2,0,0,9,0,0,0],
[0,0,0,0,0,0,5,0,0],
[0,0,0,9,8,0,0,0,0],
[5,7,0,0,0,0,0,0,0]
],

[
[0,0,0,0,0,0,6,8,0],
[0,0,0,0,7,3,0,0,9],
[3,0,9,0,0,0,0,4,5],
[4,9,0,0,0,0,0,0,0],
[8,0,3,0,5,0,9,0,2],
[0,0,0,0,0,0,0,3,6],
[9,6,0,0,0,0,3,0,8],
[7,0,0,6,8,0,0,0,0],
[0,2,8,0,0,0,0,0,0]
],

[
[8,0,0,0,0,0,0,0,0],
[0,0,3,6,0,0,0,0,0],
[0,7,0,0,9,0,2,0,0],
[0,5,0,0,0,7,0,0,0],
[0,0,0,0,4,5,7,0,0],
[0,0,0,1,0,0,0,3,0],
[0,0,1,0,0,0,0,6,8],
[0,0,8,5,0,0,0,1,0],
[0,9,0,0,0,0,4,0,0]
]

];

function generatePuzzle(){

    recursiveCalls = 0;
    backtracks = 0;

    document.getElementById("calls").innerText = 0;
    document.getElementById("backtracks").innerText = 0;
    document.getElementById("time").innerText = "0 ms";
    document.getElementById("algorithm").innerText = "None";
    document.getElementById("predictedDifficulty").innerText = "Unknown";

    let difficulty =
        document.getElementById("difficulty").value;

    let puzzleList;

    if(difficulty === "Easy")
        puzzleList = easyPuzzles;

    else if(difficulty === "Medium")
        puzzleList = mediumPuzzles;

    else
        puzzleList = hardPuzzles;

    let idx =
        Math.floor(Math.random() * puzzleList.length);

    let puzzle = puzzleList[idx];

    for(let i=0;i<9;i++){

        for(let j=0;j<9;j++){

            cells[i][j].style.background = "white";
            cells[i][j].style.color = "black";

            if(puzzle[i][j] === 0)
                cells[i][j].value = "";
            else
                cells[i][j].value = puzzle[i][j];
        }
    }

    document.getElementById("difficultyText")
        .innerText = difficulty;
}

document.getElementById("solveBtn").onclick = solveSudoku;
function getBoard(){

    let grid = [];

    for(let i=0;i<9;i++){

        grid[i] = [];

        for(let j=0;j<9;j++){

            let val = cells[i][j].value;

            if(val==="")
                grid[i][j] = 0;
            else
                grid[i][j] = parseInt(val);
        }
    }

    return grid;
}

function isValid(grid,row,col,num){

    for(let x=0;x<9;x++){

        if(grid[row][x]===num)
            return false;

        if(grid[x][col]===num)
            return false;
    }

    let startRow = row-row%3;
    let startCol = col-col%3;

    for(let i=0;i<3;i++){

        for(let j=0;j<3;j++){

            if(
                grid[startRow+i][startCol+j]
                === num
            )
                return false;
        }
    }

    return true;
}

function findEmptyCell(grid){

    for(let row=0;row<9;row++){

        for(let col=0;col<9;col++){

            if(grid[row][col]===0)
                return [row,col];

        }

    }

    return null;

}

function findBestCell(grid){

    let best = null;
    let bestCount = 10;

    for(let row=0;row<9;row++){

        for(let col=0;col<9;col++){

            if(grid[row][col]!==0)
                continue;

            let cnt = 0;

            for(let num=1;num<=9;num++){

                if(isValid(grid,row,col,num))
                    cnt++;
            }

            if(cnt<bestCount){

                bestCount = cnt;

                best = [row,col];

                if(cnt==1)
                    return best;
            }
        }
    }

    return best;
}

async function solveMRV(grid){

    document
    .getElementById("algorithm")
    .innerText =
    "Optimized Backtracking (MRV)";

    let speed =
    Math.max(
        0,
        Math.floor(
            (101 -
            document.getElementById("speedSlider").value)
            / 10
        )
    );

    recursiveCalls++;

    document
    .getElementById("calls")
    .innerText = recursiveCalls;

    let cell = findBestCell(grid);

    if(cell==null)
        return true;

    let row = cell[0];
    let col = cell[1];

    for(let num=1;num<=9;num++){

        if(isValid(grid,row,col,num)){

            grid[row][col]=num;

            cells[row][col].value=num;
            cells[row][col].style.color="blue";
            cells[row][col].style.background="#cfe2ff";

            await checkPause();
            await sleep(speed);

            if(await solveMRV(grid)){

                cells[row][col].style.background="#d4edda";

                return true;
            }

            grid[row][col]=0;

            cells[row][col].style.background="#f8d7da";

            await sleep(speed);

            cells[row][col].value="";
            cells[row][col].style.background="white";

            backtracks++;

            document
            .getElementById("backtracks")
            .innerText=backtracks;

            await checkPause();
            await sleep(speed);
        }
    }

    return false;
}

async function solveBacktracking(grid){

    document
    .getElementById("algorithm")
    .innerText =
    "Standard Backtracking";

    let speed =
    Math.max(
        0,
        Math.floor(
            (101 -
            document.getElementById("speedSlider").value)
            / 10
        )
    );

    recursiveCalls++;

    document
    .getElementById("calls")
    .innerText = recursiveCalls;

    let cell = findEmptyCell(grid);

    if(cell==null)
        return true;

    let row = cell[0];
    let col = cell[1];

    for(let num=1;num<=9;num++){

        if(isValid(grid,row,col,num)){

            grid[row][col]=num;

            cells[row][col].value=num;
            cells[row][col].style.color="blue";
            cells[row][col].style.background="#cfe2ff";

            await checkPause();
            await sleep(speed);

            if(await solveBacktracking(grid)){

                cells[row][col].style.background="#d4edda";

                return true;
            }

            grid[row][col]=0;

            cells[row][col].style.background="#f8d7da";

            await sleep(speed);

            cells[row][col].value="";
            cells[row][col].style.background="white";

            backtracks++;

            document
            .getElementById("backtracks")
            .innerText=backtracks;

            await checkPause();
            await sleep(speed);
        }
    }

    return false;
}

async function solveSudoku(){

    recursiveCalls = 0;
    backtracks = 0;

    let start = performance.now();

    let grid = getBoard();

    let algo =
    document
    .getElementById("algorithmSelect")
    .value;

    if(algo=="bt"){

       await solveBacktracking(grid);

    }
    else{

       await solveMRV(grid);

    }

    for(let i=0;i<9;i++){

    for(let j=0;j<9;j++){

        cells[i][j].style.background =
            "#d1e7dd";
    }
}

    let end = performance.now();

    document.getElementById("time")
        .innerText =
        Math.round(end-start)
        + " ms";

    let score =
        backtracks +
        recursiveCalls / 5;

    let level;

    if(score < 2000)
        level = "Easy";
    else if(score < 10000)
        level = "Medium";
    else
        level = "Hard";

    document.getElementById(
        "predictedDifficulty"
    ).innerText = level;

    updateChart();
}

document.getElementById("customBtn").onclick = () => {

    customMode = true;

    clearBoard();

    alert("Enter your Sudoku manually");
};

document.getElementById("clearBtn").onclick = clearBoard;

function clearBoard(){

    for(let i=0;i<9;i++){

        for(let j=0;j<9;j++){

            cells[i][j].value = "";
            cells[i][j].style.color = "black";
            cells[i][j].style.background = "white";
        }
    }

    recursiveCalls = 0;
    backtracks = 0;

    document.getElementById("calls").innerText = 0;
    document.getElementById("backtracks").innerText = 0;
    document.getElementById("time").innerText = "0 ms";
    document.getElementById("difficultyText").innerText = "None";

    paused = false;
    document.getElementById("pauseBtn").innerText = "Pause";
}

document.getElementById("pauseBtn").onclick = () => {

    console.log("clicked");

    paused = !paused;

    console.log(paused);

    if(paused)
        document.getElementById("pauseBtn").innerText = "Resume";
    else
        document.getElementById("pauseBtn").innerText = "Pause";
};

async function checkPause(){

    while(paused){

        await sleep(100);
    }
}
function solveInstant(grid){

    for(let row=0;row<9;row++){

        for(let col=0;col<9;col++){

            if(grid[row][col]===0){

                for(let num=1;num<=9;num++){

                    if(
                        isValid(
                            grid,
                            row,
                            col,
                            num
                        )
                    ){

                        grid[row][col]=num;

                        if(solveInstant(grid))
                            return true;

                        grid[row][col]=0;
                    }
                }

                return false;
            }
        }
    }

    return true;
}

document.getElementById("solutionBtn").onclick =
showSolution;
function showSolution(){

    let grid = getBoard();

    solveInstant(grid);

    for(let i=0;i<9;i++){

        for(let j=0;j<9;j++){

            cells[i][j].value =
                grid[i][j];

            cells[i][j].style.color =
                "green";
        }
    }
}

let chart;

function updateChart(){

    let ctx =
        document.getElementById("statsChart");

    if(chart)
        chart.destroy();

    chart = new Chart(ctx,{
        type:"bar",

        data:{
            labels:[
                "Calls",
                "Backtracks",
                "Time(ms)"
            ],

            datasets:[{
                label:"Sudoku Stats",

                data:[
                    recursiveCalls,
                    backtracks,
                    parseInt(
                        document
                        .getElementById("time")
                        .innerText
                    )
                ]
            }]
        }
    });
}


function sleep(ms){
    return new Promise(
        resolve => setTimeout(resolve,ms)
    );
}
