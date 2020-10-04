
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

const selectionSort = (array, onAction) => {
                                            
    for(let outer = 0; outer < array.length; outer++)
    {
        let smallest = outer;

        for(let inner = outer + 1; inner < array.length; inner++)
        {   
            onAction({type: ACTIONS.COMPARE, data: [smallest, inner]});
            if(array[smallest] > array[inner])
            {
                smallest = inner;
            }
        }

        if(smallest != outer)
        {
            let temp = array[outer];
            array[outer] = array[smallest];
            array[smallest] = temp;
            onAction({type: ACTIONS.SWAP, data: [outer, smallest]});
        }

        onAction({type: ACTIONS.SORT, data: outer});
    }

    return array;
};


//------------------        Insertion Sort Algorithm        -------------------

const insertionSort = (array, onAction) => {
    let counter = 1;
    for(let outer = 1; outer < array.length; outer++)
    {
        let marker = array[outer];
        let inner = outer;

        while(inner > 0 && array[inner-1] >= marker)
        {
            onAction({type: ACTIONS.COMPARE, data: [outer, inner]});
            array[inner] = array[inner-1];
            onAction({type: ACTIONS.SWAP, data: [inner, inner-1]});
            inner--;
            outer--;
        }

        array[inner] = marker;
        outer = counter;
        counter++;
    }

    // Need to perform sort action separately since none are sorted till the end.
    for(let i = 0; i < array.length; i++)
    {
        onAction({type: ACTIONS.SORT, data: i});
    }

    return array;
};


//------------------        Merge Sort Algorithm        -----------------------

const mergeSort = (array, onAction) => {
    const workspace = new Array(array.length);
    recursiveMergeSort(array, workspace, 0, array.length-1);

    for(let i = 0; i < workspace.length; i++)
    {
        onAction({type: ACTIONS.SORT, data: i});
    }

    function merge(array, workspace, lowerPortion, upperPortion, upperBound)
    {
        let j = 0;
        let lowerBound = lowerPortion;
        let midpoint = upperPortion - 1;
        let numOfItems = upperBound - lowerBound + 1;

        while(lowerPortion <= midpoint && upperPortion <= upperBound)
        {
            if( array[lowerPortion] < array[upperPortion])
            {
                workspace[j++] = array[lowerPortion++];
            }
            else
            {
                workspace[j++] = array[upperPortion];
            }
        }

        while(lowerPortion <= mid)
        {
            workspace[j++] = array[lowerPortion++];
        }

        while(upperPortion <= upperBound)
        {
            workspace[j++] = array[upperPortion++];
        }

        for(j=0; j < numOfItems; j++)
        {
            array[lowerBound+j] = workspace[j];
        }
    } // End of merge().

    function recursiveMergeSort(array, workspace, lowerBound, upperBound)
    {
        if(lowerBound == upperBound)
        {
            return; // Array of only 1 element.
        }
        else
        {
            let midpoint = (lowerBound + upperBound)/2;

            // Sort lower half.
            recursiveMergeSort(array, workspace, lowerBound, midpoint);

            // Sort upper half.
            recursiveMergeSort(array, workspace, midpoint+1, upperBound);

            // Merge the two halfs.
            merge(array, workspace, lowerBound, midpoint+1, upperBound);
        }
    } // End of recursiveMergeSort().
};


//--------------------      Quick Sort Algorithm        -----------------------

const quickSort = (array, onAction) => {
    recursiveQuickSort(0, array.length-1);

    // Need to perform sort action separately since none are sorted till the end.
    for(let i = 0; i < array.length; i++)
    {
        onAction({type: ACTIONS.SORT, data: i});
    }

    // Function that partitions the array.
    function partitionArray(leftIndex, rightIndex, pivot)
    {
        let leftPartition = leftIndex - 1;
        let rightPartition = rightIndex;

        while(true)
        {
            // Find bigger value than pivot.
            while(array[++leftPartition] < pivot);

            // Find smaller value than pivot.
            while(rightPartition > 0 && array[--rightPartition] > pivot);

            if(leftPartition >= rightPartition)
            {
                break;      // If pointers cross, then done.
            }
            else            // Else swap the elements.
            {
                onAction({type: ACTIONS.SWAP, data: [leftPartition, rightPartition]});
                let temp = array[leftPartition];    
                array[leftPartition] = array[rightPartition];
                array[rightPartition] = temp;
            }
        } // End of while(true).

        // Restore the pivot.
        onAction({type: ACTIONS.SWAP, data: [leftPartition, rightIndex]});
        let temp2 = array[leftPartition];
        array[leftPartition] = array[rightIndex];
        array[rightIndex] = temp2;
        
        // Return pivot's location.
        return leftPartition;
    } // End of partitionArray().

    // Function that sorts the array recursively.
    function recursiveQuickSort(leftIndex, rightIndex)
    {
        if(rightIndex - leftIndex <= 0)
        {
            return;
        }
        else
        {
            let pivot = array[rightIndex];

            // Set the partition range.
            let partition = partitionArray(leftIndex, rightIndex, pivot);

            // Sort left side.
            recursiveQuickSort(leftIndex, partition-1);
            // Sort right side.
            recursiveQuickSort(partition+1, rightIndex);
        }
    }

    return array;
};


//---------------------     Creating the Animations      ----------------------

const randomArray = startingArray();
const arrayMembers = randomArray.map((v,i) => {

    // Adjusting bar width and height based on window size.
    let barWidth = window.innerWidth/29.7;
    let barHeight = v*window.innerHeight/32;

    return new rectangleBar(barWidth*i+i+4, 0, barWidth, barHeight);
});

const drawAll = () => arrayMembers.forEach((m) => m.draw());
drawAll();

let ticks = 0;
const speed = 40;

//---------------       Bubble Sort Animation       -----------------
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

document.getElementById("newSort").onclick = function() {
    location.reload();
}

//--------------     Selection Sort Animation        ----------------
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


//--------------     Insertion Sort Animation        ----------------
document.getElementById("insertionSort").onclick = function() {
    document.getElementById("start").onclick = function() {
        insertionSort(randomArray, (action) => {
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


//----------------     Merge Sort Animation        ------------------
document.getElementById("mergeSort").onclick = function() {
    document.getElementById("start").onclick = function() {
        mergeSort(randomArray, (action) => {
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


//----------------     Quick Sort Animation        ------------------
document.getElementById("quickSort").onclick = function() {
    document.getElementById("start").onclick = function() {
        quickSort(randomArray, (action) => {
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

let testArray = [1,2,4,3,5,7,6];

let result = quickSort(testArray);
console.log(result);