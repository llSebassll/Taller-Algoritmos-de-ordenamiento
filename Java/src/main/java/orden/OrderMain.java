package orden;


import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

public class OrderMain {

    private static final int[] PRUEBA = { 10_000, 100_000, 1_000_000 };
    private static final Map<OrdenTipo, Double[]> RESULTADOS = new HashMap<>();

    public static void main(String[] args) throws IOException {

        List<Integer[]> numeros = new ArrayList<>();

        for (int n: PRUEBA) {
            File archivo = new File(n + "-numeros.txt");
            boolean cargarArchivo = archivo.exists();

            if (!archivo.exists() && archivo.createNewFile()) {
                List<String> lineas = new ArrayList<>();
                Random aleatorio = new Random();
                for (int i = 0; i < n; ++i) {
                    lineas.add(String.valueOf(aleatorio.nextInt(99_999_999 - 10_000_000 + 1) + 10_000_000));
                }
                escribirArchivo(archivo, lineas);
                cargarArchivo = true;
            }

            if (cargarArchivo) {
                List<String> lineas = Files.readAllLines(archivo.toPath());
                Integer[] arreglo = new Integer[lineas.size()];
                for (int i = 0; i < arreglo.length; ++i) {
                    arreglo[i] = Integer.parseInt(lineas.get(i));

                }
                numeros.add(arreglo);
            }

        }


        for (OrdenTipo tipo: OrdenTipo.values()) {

            System.out.println("======================================================");
            System.out.println(" ");
            System.out.println(tipo);
            System.out.println(" ");

            File tipoCarpeta = new File(tipo.name());
            if (!tipoCarpeta.exists() && tipoCarpeta.mkdirs()) {
                System.out.println("Carpeta creada.");
            }

            File tipoArchivo = new File(tipoCarpeta, "datos.txt");
            if (tipoArchivo.exists()) {
                List<String> tipoLineas = Files.readAllLines(tipoArchivo.toPath());
                for (String linea: tipoLineas) {
                    String[] lineaArgs = linea.split("=");
                    Double[] resultados = RESULTADOS.getOrDefault(tipo, new Double[PRUEBA.length]);
                    for (int i = 0; i < PRUEBA.length; ++i) {
                        if (lineaArgs[0].equals(String.valueOf(PRUEBA[i]))) {
                            System.out.println(lineaArgs[0] + " cargó " + lineaArgs[1]);
                            resultados[i] = Double.parseDouble(lineaArgs[1]);
                            break;
                        }
                    }
                    RESULTADOS.put(tipo, resultados);
                }
            }

            Double[] resultados = RESULTADOS.getOrDefault(tipo, new Double[PRUEBA.length]);
            for (int i = 0; i < PRUEBA.length; ++i) {

                if (resultados[i] == null) {

                    System.out.println(PRUEBA[i] + " generando...");

                    Integer[] original = numeros.get(i);
                    int[] copia = new int[original.length];
                    for (int j = 0; j < copia.length; ++j) {
                        copia[j] = original[j];
                    }

                    long inicioTiempo = System.currentTimeMillis();
                    if (tipo == OrdenTipo.DUAL_PIVOT_QUICK) {
                        DualPivotQuicksort.probar(copia);
                    } else if (tipo == OrdenTipo.COCKKTAIL) {
                        CocktailSort.probar(copia);
                    } else if (tipo == OrdenTipo.HEAP) {
                        HeapSort.probar(copia);
                    } else if (tipo == OrdenTipo.MERGE) {
                        MergeSort.probar(copia);
                    } else if (tipo == OrdenTipo.RADIX) {
                        RadixSort.probar(copia);
                    } else {
                        throw new RuntimeException("No existe tipo.");
                    }

                    long finalTiempo = System.currentTimeMillis();
                    resultados[i] = (finalTiempo - inicioTiempo) / 1000D;
                    RESULTADOS.put(tipo, resultados);
                    guardarResultados();
                }
            }


        }



        for (int i = 0; i < PRUEBA.length; ++i) {

            int n = PRUEBA[i];
            DefaultCategoryDataset dataset = new DefaultCategoryDataset();

            // Agregar datos al dataset

            List<Map.Entry<OrdenTipo, Double>> tiempos = new ArrayList<>();
            for (OrdenTipo tipo: OrdenTipo.values()) {
                tiempos.add(new AbstractMap.SimpleEntry<>(tipo, RESULTADOS.get(tipo)[i]));
            }
            tiempos.sort((a, b) -> Double.compare(a.getValue(), b.getValue()) * -1);

            for (Map.Entry<OrdenTipo, Double> tiempo: tiempos) {
                dataset.addValue(tiempo.getValue(), "Tiempo", tiempo.getKey().name() + " (" + tiempo.getValue() + "s)");
            }

            // Crear el gráfico de barras
            JFreeChart chart = ChartFactory.createBarChart(
                    "Diagrama de Barras de " + n + " datos", // Título del gráfico
                    "Algoritmo",                     // Etiqueta del eje X
                    "Tiempo en segundos",                        // Etiqueta del eje Y
                    dataset                           // Conjunto de datos
            );

            File archivo = new File(n + "-diagrama.png");
            try {
                ChartUtils.saveChartAsPNG(archivo, chart, 1280, 400);
                System.out.println("Gráfico guardado como " + archivo.getAbsolutePath());
            } catch (IOException e) {
                System.err.println("Error al guardar el gráfico: " + e.getMessage());
            }

        }

    }

    private static void guardarResultados() throws IOException {
        for (Map.Entry<OrdenTipo, Double[]> entrada: RESULTADOS.entrySet()) {
            OrdenTipo tipo = entrada.getKey();
            File tipoCarpeta = new File(tipo.name());
            File archivo = new File(tipoCarpeta, "datos.txt");
            if (archivo.exists()) {
                archivo.delete();
            }
            archivo.createNewFile();
            Double[] datos = entrada.getValue();
            List<String> lineas = new ArrayList<>();
            for (int i = 0; i < PRUEBA.length; ++i) {
                if (datos[i] != null) {
                    lineas.add(PRUEBA[i] + "=" + datos[i]);
                }
            }
            escribirArchivo(archivo, lineas);
        }
    }

    private static void escribirArchivo(File file, List<String> lineas) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            for (String linea : lineas) {
                writer.write(linea);
                writer.newLine(); // Agrega una nueva línea
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
