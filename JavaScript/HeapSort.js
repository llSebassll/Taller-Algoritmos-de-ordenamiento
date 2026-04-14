// Traida de: https://www.geeksforgeeks.org/dsa/heap-sort/

// To heapify a subtree rooted with node i
function heapify(arr, n, i) {

    // Initialize largest as root
    let largest = i;

    // left index = 2*i + 1
    let l = 2 * i + 1;

    // right index = 2*i + 2
    let r = 2 * i + 2;

    // If left child is larger than root
    if (l < n && arr[l] > arr[largest])
        largest = l;

    // If right child is larger than largest so far
    if (r < n && arr[r] > arr[largest])
        largest = r;

    // If largest is not root
    if (largest != i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Main function to do heap sort
function heapSort(arr) {
    let n = arr.length;

    // Build heap (rearrange vector)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
        heapify(arr, n, i);

    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {

        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];

        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}

function probar(arreglo) {
    heapSort(arreglo);
}

module.exports = {
    probar
};