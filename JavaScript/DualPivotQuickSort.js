// Traida de: https://www.geeksforgeeks.org/dsa/dual-pivot-quicksort/

// JavaScript program to implement
// dual pivot QuickSort

function swap(arr,i,j)
{
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
    
function dualPivotQuickSort(arr,low,high)
{
    if (low < high)
    {
        
        // piv[] stores left pivot and right pivot.
        // piv[0] means left pivot and
        // piv[1] means right pivot
        let piv = [];
        piv = partition(arr, low, high);
        
        dualPivotQuickSort(arr, low, piv[0] - 1);
        dualPivotQuickSort(arr, piv[0] + 1, piv[1] - 1);
        dualPivotQuickSort(arr, piv[1] + 1, high);
    }
}
    
function partition(arr,low,high)
{
    if (arr[low] > arr[high])
        swap(arr, low, high);
        
    // p is the left pivot, and q
    // is the right pivot.
    let j = low + 1;
    let g = high - 1, k = low + 1,
        p = arr[low], q = arr[high];
        
    while (k <= g)
    {
        
        // If elements are less than the left pivot
        if (arr[k] < p)
        {
            swap(arr, k, j);
            j++;
        }
            
        // If elements are greater than or equal
        // to the right pivot
        else if (arr[k] >= q)
        {
            while (arr[g] > q && k < g)
                g--;
                
            swap(arr, k, g);
            g--;
            
            if (arr[k] < p)
            {
                swap(arr, k, j);
                j++;
            }
        }
        k++;
    }
    j--;
    g++;
        
    // Bring pivots to their appropriate positions.
    swap(arr, low, j);
    swap(arr, high, g);
    
    // Returning the indices of the pivots
    // because we cannot return two elements
    // from a function, we do that using an array.
    return [ j, g ];
}

function probar(arreglo) {
    dualPivotQuickSort(arreglo, 0, arreglo.length - 1);
}

module.exports = {
    probar
};