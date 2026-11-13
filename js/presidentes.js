
const URL = "https://api-colombia.com/api/v1/President";

const contenedor = document.getElementById("contenedor");
const carga = document.getElementById("carga");

// Consultar información de la API
fetch(URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al consultar los presidentes");
        }

        return response.json();
    })
    .then(presidentes => {

        // Ordenar por año de inicio
        presidentes.sort((a, b) => {
            return new Date(a.startPeriodDate) -
                   new Date(b.startPeriodDate);
        });

        carga.textContent = "";

        // Recorrer los presidentes
        presidentes.forEach(presidente => {

            // Crear una tarjeta
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            // Crear imagen
            const imagen = document.createElement("img");

            imagen.alt = presidente.name + " " + presidente.lastName;

              cargarImagen(
                imagen,
                presidente.image,
                presidente.name + " " + presidente.lastName + " presidente de Colombia"
            );

            // Crear título
            const titulo = document.createElement("h2");

            titulo.textContent =
                presidente.name + " " + presidente.lastName;

            // Crear información del periodo
            const periodo = document.createElement("p");

            periodo.textContent =
                "Periodo: " +
                (presidente.startPeriodDate || "No disponible") +
                " hasta " +
                (presidente.endPeriodDate || "Actualidad");

            // Crear información del partido
            const partido = document.createElement("p");

            partido.textContent =
                "Partido político: " +
                (presidente.politicalParty || "No disponible");

            // Agregar elementos a la tarjeta
            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(periodo);
            tarjeta.appendChild(partido);

            // Agregar tarjeta al contenedor
            contenedor.appendChild(tarjeta);
        });

    })
    .catch(error => {
        carga.textContent =
            "No fue posible cargar los presidentes: " + error.message;
    });
