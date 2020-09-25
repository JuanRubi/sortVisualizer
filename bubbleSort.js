
// var live = true;

// // Function dealing with bubble sort.
// function bubbleSort(array)
// {
//     // Function to perform swapping.
//     function swap(leftIndex, rightIndex)
//     {
//         let temp = array[leftIndex];
//         array[leftIndex] = array[rightIndex];
//         array[rightIndex] = temp;
//     }

//     // Bubble sort algorithm.
//     for(var outer = array.length-1; outer > 1; outer--)
//     {
//         for(let inner = 0; inner < outer; inner++)
//         {
//             if(array[inner] > array[inner+1])
//             {
//                 swap(inner, inner+1)
//             }
//         }
//     }

//     return array; // Returns the array sorted.
// }

// function theShow()
// {
//         // Displaying bars base on amount of numbers in array.
//         var sortLocation = document.getElementById("sortArea");
//         var room = sortLocation.getContext("2d");
    
//         var barColor = '#1111DD';   // Bar color.
    
//         var i = Math.floor((Math.random()*10)+1);
//         var barHeight = Math.floor((Math.random()*6) + 1);
    
//         // Creating the bars where the height adjusts base on array item value.
//         room.lineWidth = 5;
//         room.strokeStyle = barColor;
//         room.moveTo(i*10, 150);
//         room.lineTo(i*10, 150-barHeight*25);
//         room.lineCap = "squared";
//         room.stroke();



// }

// var animation;

// // Activates bubble sort once start is clicked.
// document.getElementById("start").onclick = function() {
//     var numArray = [1,3,2,5];   // Test array.
    
//     if(live)
//     {
//         animation = setInterval(theShow, 10);
//         live = false;
//     }
//     else
//     {
//         alert("There is an error in the code!");
//     }
// }

// document.getElementById("stop").onclick = function() {
//     clearInterval(animation);       // Ends the sort animation.
//     live = true;        // Allows the sort to start again.
// }



//---------------------     Getting our Canvas Element      -------------------

const canvas = document.querySelector("canvas"); // Gets first matching tag.
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const sortingArea = canvas.getContext("2d");

//---------------------       Actions to Perform      -------------------------

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
        let temp = members[i].getValue();
        members[i].setValue(members[j].getValue(), "red");
        members[j].setValue(temp, "yellow");
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
        for(let inner = 0; inner < outer; inner++)
        {
            onAction({type: ACTIONS.COMPARE, data: [inner, inner+1]});
            if(array[inner] > array[inner+1])
            {
                let temp = array[inner];
                array[inner] = array[inner+1];
                array[inner+1] = array[inner];
                onAction({type: ACTIONS.SWAP, data: [inner, inner+1]});
            }
        }

        onAction({type: ACTIONS.SORT, data: array.length-outer-1});
    }

    return array;
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


// TEST TO SEE IF EVERYTHIN WORKS.
const randomArray = startingArray();
const arrayMembers = randomArray.map((v,i) => {
    return new rectangleBar(35*i + i, 0, 35, v*40);
});

const drawAll = () => arrayMembers.forEach((m) => m.draw());
drawAll();

let ticks = 0;
const speed = 50;

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