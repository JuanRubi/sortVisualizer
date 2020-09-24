
// Function dealing with bubble sort.
function bubbleSort(array)
{
    // Function to perform swapping.
    function swap(leftIndex, rightIndex)
    {
        let temp = array[leftIndex];
        array[leftIndex] = array[rightIndex];
        array[rightIndex] = temp;
    }

    // Bubble sort algorithm.
    for(var outer = array.length-1; outer > 1; outer--)
    {
        for(let inner = 0; inner < outer; inner++)
        {
            if(array[inner] > array[inner+1])
            {
                swap(inner, inner+1)
            }
        }
    }

    // Displaying bars base on amount of numbers in array.
    var sortLocation = document.getElementById("sortArea");
    var room = sortLocation.getContext("2d");

    var barColor = '#1111DD';   // Bar color.

    var i = Math.floor((Math.random()*3)+1);

    // Creating the bars where the height adjusts base on array item value.
    room.lineWidth = 1;
    room.strokeStyle = barColor;
    room.moveTo(array[i]*10, 150);
    room.lineTo(array[i]*10, 150-array[i]*25);
    room.lineCap = "squared";
    room.stroke();
}

var animation;
var live = true;

// Activates bubble sort once start is clicked.
document.getElementById("start").onclick = function() {
    var numArray = [1,3,2,5];
    
    if(live)
    {
        animation = setInterval(bubbleSort(numArray), 100);
    }
    else
    {
        alert("There is an error in the code!");
    }
}