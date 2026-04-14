package busqueda;

public class Lineal {

    public static void probar(int[] a, int n) {
        // Búsqueda en la serie A para el numero N.
        for (int index = 0; index < a.length; index++) {
            if ( a[index] == n )
                return;  // se encontró N en este índice!
        }

    }

}
