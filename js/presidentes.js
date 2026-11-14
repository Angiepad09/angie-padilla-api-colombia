
const URL = "https://api-colombia.com/api/v1/President";

const contenedor = document.getElementById("contenedor");
const carga = document.getElementById("carga");

const BANREP = "https://enciclopedia.banrepcultural.org/images/";

const imagenesCorregidas = {
    "olaya": {
        wiki: "Enrique Olaya Herrera",
        banrep: BANREP + "7/7d/Enrique_Olaya_Herrera.jpg"
    },
    "urdaneta arbel": {
        wiki: "Roberto Urdaneta Arbeláez",
        banrep: BANREP + "e/ed/Roberto_Urdaneta_Arbelaez.jpg"
    },
    "montalvo": {
        wiki: "José Antonio Montalvo Berbeo",
        banrep: BANREP + "9/9f/Jose_Antonio_Montalvo_Berbeo.jpg"
    },
    "monsalvo": {
        wiki: "José Antonio Montalvo Berbeo",
        banrep: BANREP + "9/9f/Jose_Antonio_Montalvo_Berbeo.jpg"
    },
    "azuero": {
        wiki: "Rafael Azuero Manchola",
        banrep: BANREP + "a/ab/Rafael_Azuero_Manchola.jpg"
    },
    "lievano": {
        wiki: "Indalecio Liévano Aguirre",
        banrep: BANREP + "5/5f/Indalecio_Lievano_Aguirre.jpg"
    },
    "betanc": {
        wiki: "Belisario Betancur",
        banrep: BANREP + "5/53/Belisario_Betancour_Cuartas.jpg"
    },
    "junta": {
        wiki: "Gabriel París Gordillo",
        banrep: BANREP + "2/2d/Gabriel_Paris_Gordillo.jpg"
    }
};

function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function buscarCorreccion(presidente) {
    const nombreCompleto = normalizar(presidente.name + " " + presidente.lastName);

    for (const clave in imagenesCorregidas) {
        if (nombreCompleto.includes(clave)) {
            return imagenesCorregidas[clave];
        }
    }
    return null;
}

function cargarImagenCorregida(imagen, correccion) {
    imagen.referrerPolicy = "no-referrer";

    function usarBanrep() {
        imagen.onerror = function () {
            imagen.onerror = null;
            imagen.src = IMAGEN_POR_DEFECTO;
        };
        imagen.src = correccion.banrep || IMAGEN_POR_DEFECTO;
    }

    const url =
        "https://es.wikipedia.org/w/api.php" +
        "?action=query&format=json&origin=*&redirects=1" +
        "&titles=" + encodeURIComponent(correccion.wiki) +
        "&prop=pageimages&piprop=thumbnail&pithumbsize=400";

    fetch(url)
        .then(response => response.json())
        .then(datos => {
            const pagina = Object.values(datos.query.pages)[0];
            const urlWiki = pagina?.thumbnail?.source;

            if (urlWiki) {
                imagen.onerror = usarBanrep;
                imagen.src = urlWiki;
            } else {
                usarBanrep();
            }
        })
        .catch(usarBanrep);
}
fetch(URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al consultar los presidentes");
        }

        return response.json();
    })
    .then(presidentes => {

        presidentes.sort((a, b) => {
            return new Date(a.startPeriodDate) -
                new Date(b.startPeriodDate);
        });

        carga.textContent = "";

        presidentes.forEach(presidente => {

            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");


            const imagen = document.createElement("img");
            imagen.alt = presidente.name + " " + presidente.lastName;
            const correccion = buscarCorreccion(presidente);

            if (correccion) {
                cargarImagenCorregida(imagen, correccion);
            } else {
                cargarImagen(
                    imagen,
                    presidente.image,
                    presidente.name + " " + presidente.lastName + " presidente de Colombia"
                );
            }

            const titulo = document.createElement("h2");

            titulo.textContent = presidente.name + " " + presidente.lastName;

            const periodo = document.createElement("p");
            periodo.textContent ="Periodo: " + (presidente.startPeriodDate || "No disponible") +
                " hasta " + (presidente.endPeriodDate || "Actualidad");

            const partido = document.createElement("p");
            partido.textContent ="Partido político: " + (presidente.politicalParty || "No disponible");

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(periodo);
            tarjeta.appendChild(partido);

            contenedor.appendChild(tarjeta);
        });

    })
    .catch(error => {
        carga.textContent =
            "No fue posible cargar los presidentes: " + error.message;
    });
