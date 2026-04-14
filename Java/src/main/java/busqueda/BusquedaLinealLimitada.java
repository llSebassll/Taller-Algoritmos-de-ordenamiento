package busqueda;

public class BusquedaLinealLimitada {

    public static int probar(int[] array, int objetivo, int limite) {
        // Asegurarse de que el límite no exceda el tamaño del arreglo
        int maxIndex = Math.min(limite, array.length);

        for (int i = 0; i < maxIndex; i++) {
            if (array[i] == objetivo) {
                return i; // Retorna el índice donde se encontró el objetivo
            }
        }

        return -1; // Retorna -1 si no se encuentra el objetivo
    }

}
