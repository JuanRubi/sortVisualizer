
//---------------------     Getting our Canvas Element      -------------------

const canvas = document.querySelector("canvas"); // Gets first matching tag.
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const sortingArea = canvas.getContext("2d");

//---------------------       ACTIONS to Perform      -------------------------

const ACTIONS = {
    SORT: "SORT",
    COMPARE: "COMPARE",
    SWAP: "SWAP"
};


//-------------------        Defining ACTIONS Effects        ------------------

const actionsMap = {
    [ACTIONS.SORT]: (action, members) => members[action.data].sorted(),

    [ACTIONS.SWAP]: (action, members) => {
        const [i, j] = action.data;
        let temp2 = members[i].getValue();
        members[i].setValue(members[j].getValue(), "#000080");
        members[j].setValue(temp2, "#FFD700");
    },

    [ACTIONS.COMPARE]: (action, members) => {
        const [i, j] = action.data;
        members[i].setColor("gray");
        members[j].setColor("gray");
    }
};


//-----------------       Creating the Unsorted Array     ---------------------

const startingArray = (bottom = 1, top = 30) => {
    const unsortedArray = [];

    for(let i = bottom; i < top; i++)
    {
        unsortedArray.push(i);
    }
    
    return unsortedArray.sort((a,b) => (Math.random() > 0.5 ? 1: -1));
};


//--------------------      Bubble Sort Algorithm       -----------------------

const bubbleSort = (array, onAction) => {
    for(let outer = 0; outer < array.length; outer++)
    {
        for(let inner = 0; inner < array.length-1; inner++)
        {
            onAction({type: ACTIONS.COMPARE, data: [inner, inner+1]});
            if(array[inner] > array[inner+1])
            {
                let temp = array[inner];
                array[inner] = array[inner+1];
                array[inner+1] = temp;
                onAction({type: ACTIONS.SWAP, data: [inner, inner+1]});
            }
        }

        onAction({type: ACTIONS.SORT, data: array.length-outer-1});
    }

    return array;
};


//------------------        Selection Sort Algorithm        -------------------

const selectionSort = (array, onAction) => {        // Algorithm not working????
                                                    // Fails to detect smaller rectangle at times.
    for(let outer = 0; outer < array.length; outer++)
    {
        let smallest = outer;

        for(let inner = outer + 1; inner < array.length; inner++)
        {   
            onAction({type: ACTIONS.COMPARE, data: [smallest, inner]});
            if(array[smallest] > array[inner])
            {
                smallest = inner;
                onAction({type: ACTIONS.SWAP, data: [outer, smallest]});
            }
        }

        //onAction({type: ACTIONS.SWAP, data: [outer, smallest]});
        onAction({type: ACTIONS.SORT, data: outer});
    }
};


//-------------------       Creating the Rectangle Bars      ------------------

function rectangleBar(x, y, width, height, color = "royalblue")
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;

    // Drawing the rectangle.
    this.draw = () => {
        sortingArea.fillStyle = this.color;
        sortingArea.fillRect(this.x, this.y, this.width, this.height);
    };

    this.resetColor = () => this.setColor("royalblue");

    this.setColor = (color) => {
        if(!this.isSorted())  // If not sorted, then still royalblue.
        {
            this.color = color;
        }
    };

    this.isSorted = () => this.color === "green"; // If sorted, then green.
    this.sorted = () => (this.color = "green");

    this.setValue = (v, color) => {
        if(!this.isSorted())
        {
            this.height = v;
            this.setColor(color);
        }
    };

    this.getValue = (v) => this.height;
}


//---------------------     Creating the Animations      ----------------------

const randomArray = startingArray();
const arrayMembers = randomArray.map((v,i) => {
    return new rectangleBar(38*i + i, 0, 38, v*40);
});

const drawAll = () => arrayMembers.forEach((m) => m.draw());
drawAll();

let ticks = 0;
const speed = 30;

//---------       Bubble Sort Animation       -------------
document.getElementById("bubbleSort").onclick = function() {
    document.getElementById("start").onclick = function() {
        bubbleSort(randomArray, (action) => {
           ticks++; 
        
            setTimeout(() => {
                actionsMap[action.type] (action, arrayMembers);
                sortingArea.clearRect(0, 0, innerWidth, innerHeight);
                drawAll(arrayMembers);
                arrayMembers.forEach((m) => m.resetColor());
            }, ticks*speed);
        });
    }
}

// document.getElementById("stop").onclick = function() {
//     clearTimeout(); // Needs fixing.
//}

//---------     Selection Sort Animation        -----------
document.getElementById("selectionSort").onclick = function() {
    document.getElementById("start").onclick = function() {
        selectionSort(randomArray, (action) => {
            ticks++;
        
            setTimeout(() => {
                actionsMap[action.type] (action, arrayMembers);
                sortingArea.clearRect(0, 0, innerWidth, innerHeight);
                drawAll(arrayMembers);
                arrayMembers.forEach((m) => m.resetColor());
            }, ticks*speed);
        });
    }
}