package orden;

import java.util.Random;

// Traido de: https://codegym.cc/es/groups/posts/es.147.clasificacion-de-burbuja-java

public class Burbuja {

    public static void probar(int[] arreglo) {
        bubbleSort(arreglo);
    }

    public static int[] bubbleSort(int[] myArray) {
        int temp = 0;  //  temporary element for swapping
        for (int i = 0; i < myArray.length; i++) {
            for (int j = 1; j < (myArray.length - i); j++) {
                if (myArray[j - 1] > myArray[j]) {
                    //  swap array’s elements using temporary element
                    temp = myArray[j - 1];
                    myArray[j - 1] = myArray[j];
                    myArray[j] = temp;
                }
            }
        }
        return myArray;
    }

}