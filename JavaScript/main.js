const fs = require("node:fs");
const { Chart, registerables } = require('chart.js');
Chart.register(...registerables);
const { createCanvas } = require('canvas');

const PRUEBA = [10_000, 100_000, 1_000_000];

// Cargar números
const NUMEROS = PRUEBA
    .map(tamanio => String(fs.readFileSync("./" + tamanio + "-numeros.txt")))
    .map(tamanio => tamanio.split("\n"))
    .map(lista => lista
        .filter(t => t.length > 0)
        .map(n => parseInt(n)));

const ALGORITMOS = [
    {
        "nombre": "DUAL_PIVOT_QUICK",
        "ejecutar": require("./DualPivotQuickSort").probar
    },
    {
        "nombre": "COCKKTAIL",
        "ejecutar": require("./CockTailSort").probar
    },
    {
        "nombre": "HEAP",
        "ejecutar": require("./HeapSort").probar
    },
    {
        "nombre": "MERGE",
        "ejecutar": require("./MergeSort").probar
    },
    {
        "nombre": "RADIX",
        "ejecutar": require("./RadixSort").probar
    }
]

const RESULTADOS = {};

// Cargar resultados anteriores
ALGORITMOS.forEach(algoritmo => {
    const datos = "./" + algoritmo.nombre + "/datos.txt";
    if (fs.existsSync(datos)) {
        const actuales = {};
        const textoDatos = String(fs.readFileSync(datos)).split("\n");
        for (let linea of textoDatos) {
            const numero = linea.split("=")[0];
            const valor = linea.split("=")[1];
            actuales[numero] = parseFloat(valor);
        }
        RESULTADOS[algoritmo.nombre] = actuales;
    } else {
        RESULTADOS[algoritmo.nombre] = {};
    }
});

for (let algoritmo of ALGORITMOS) {

    if (!algoritmo.ejecutar) {
        continue;
    }

    console.log("======================================================");
    console.log(" ");
    console.log(algoritmo.nombre);
    console.log(" ");

    for (let i = 0; i < PRUEBA.length; ++i) {

        const rango = PRUEBA[i];
        if (typeof RESULTADOS[algoritmo.nombre][rango] !== "number") {
            console.log(rango + " generando...");

            const copia = [...NUMEROS[i]];
            const inicioTiempo = Date.now();
            algoritmo.ejecutar(copia);
            const finalTiempo = Date.now();

            const resultadoSegundos = ((finalTiempo - inicioTiempo) / 1000).toFixed(5);
            RESULTADOS[algoritmo.nombre][rango] = resultadoSegundos;
            guardarResultados(algoritmo.nombre);

        }

    }

}

// Formar gráficas
for (let rango of PRUEBA) {

    const orden = Object
        .entries(RESULTADOS)
        // Solo se obtiene el valor de ese algoritmo
        .map(([algoritmo, valores]) => {
            return [algoritmo, valores[rango]];
        })
        // Filtrar solo los que tienen un valor
        .filter(([_, valor]) => {
            return typeof valor == "number";
        })

        // Ordernar por valor
        .sort((a, b) => b[1] - a[1]);

    crearGrafica(
        rango + "-diagrama.png",
        orden.map(resultado => resultado[0]),
        orden.map(resultado => resultado[1])
    );

}

function crearGrafica(graficaNombre, nombres, valores) {

    // Crear canvas
    const width = 600;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const backgroundPlugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    // ✅ Fondo blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Datos de ejemplo (tiempos en ms)
    const data = {
        labels: nombres,
        datasets: [{
            label: 'Tiempo (s)',
            data: valores,
            backgroundColor: new Array(valores.length).fill("red")
        }]
    };

    // Configuración del gráfico
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 20,
                    right: 20
                }
            },
            backgroundColor: "white",
            plugins: {
                title: {
                    display: true,
                    text: 'Comparación de tiempos'
                }
            }
        },
        plugins: [backgroundPlugin]
    });

    // Guardar como imagen
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(graficaNombre, buffer);

    console.log('Gráfico generado: ' + graficaNombre);
}

function guardarResultados(algoritmo) {
    const lineas = [];
    const resultado = RESULTADOS[algoritmo];

    const carpeta = "./" + algoritmo;
    if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta);
        console.log("Carpeta creada.");
    }

    for (let rango of PRUEBA) {
        if (typeof RESULTADOS[algoritmo][rango] !== "number") {
            lineas.push(rango + "=" + resultado[rango]);
        }
    }

    const archivo = carpeta + "/datos.txt";
    fs.writeFileSync(archivo, lineas.join("\n"));

}