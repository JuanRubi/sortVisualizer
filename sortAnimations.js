
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

    if(array.length < 2)    // 1 Element array.
    {
        return array;
    }

    // onAction WORKS HERE.
    // Need to perform sort action separately since none are sorted till the end.
    for(let k = 0; k < array.length; k++)
    {
        onAction({type: ACTIONS.SORT, data: k});
    }

    const midpoint = Math.floor(array.length/2);
    const leftPortion = array.slice(0,midpoint);
    const rightPortion = array.slice(midpoint);

    array = merge(mergeSort(leftPortion), mergeSort(rightPortion));

    console.log(array); // Array is sorted! 

    function merge(left, right)
    {
        //Maybe new array doesn't have onAction ability?
        let sorted = [];
        let i = 0;
        let j = 0;
        
        if(left != null && right != null)
        {
            onAction({type: ACTIONS.COMPARE, data: [i,j]});
            while(i < left.length && j < right.length)
            {
                if(left[i] < right[j])
                {
                    sorted.push(left[i]);
                    i++;
                }
                else
                {
                    sorted.push(right[j]);
                    j++;
                }
            }
        
            while(i < left.length)
            {
                sorted.push(left[i]);
                i++;  
            }
        
            while(j < right.length)
            {
                sorted.push(right[j]);
                j++;
            }
        }
    
        return sorted;
    }

    //let result = merge(mergeSort(leftPortion), mergeSort(rightPortion));

    return array;
};


//--------------------    Second Merge Sort Algorithm     ---------------------

const unsortedArray = [31,27,28,42,13,8,11,30,17];

const mergeSort2 = (arr, onAction) => {

    //onAction({type: ACTIONS.COMPARE, data: [i++, i+2]})

    let result = recursiveMergeSort2(arr);

    function recursiveMergeSort2(subArray)
    {
        if(subArray.length <= 1)
        {
            return subArray;
        }

        let mid = Math.floor(subArray.length/2);
        let left = recursiveMergeSort2(subArray.slice(0, mid));
        let right = recursiveMergeSort2(subArray.slice(mid));

        const merge2 = (arr1, arr2) => {
            let sorted = [];
            var i = 0;
        
            while(arr1.length && arr2.length)
            {
                //onAction({type: ACTIONS.COMPARE, data: [i++, i+2]})
                if(arr1[0] < arr2[0])
                {
                    sorted.push(arr1.shift());
                }
                else
                {
                    sorted.push(arr2.shift());
                }
            }
        
            return sorted.concat(arr1.slice().concat(arr2.slice()));
        }

        return merge2(left, right);
    }

    console.log(arr);
    console.log(result);
    //onAction({type: ACTIONS.COMPARE, data: [i++, i+10]})
};

//console.log(mergeSort2(unsortedArray));


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
        mergeSort2(randomArray, (action) => {
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
            let speed = 120;

            setTimeout(() => {
                actionsMap[action.type] (action, arrayMembers);
                sortingArea.clearRect(0, 0, innerWidth, innerHeight);
                drawAll(arrayMembers);
                arrayMembers.forEach((m) => m.resetColor());
            }, ticks*speed);
        });
    }
}
