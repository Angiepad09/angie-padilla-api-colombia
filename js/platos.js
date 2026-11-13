
const URL = "https://api-colombia.com/api/v1/TypicalDish";

const contenedor = document.getElementById("contenedor");
const carga = document.getElementById("carga");
const total = document.getElementById("total");

// Consultar la API
fetch(URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al consultar los platos");
        }

        return response.json();
    })
    .then(platos => {

        carga.textContent = "";

        // Mostrar cantidad de platos
        total.textContent = "Total de platos: " + platos.length;

        // Recorrer los platos
        platos.forEach(plato => {

            // Crear tarjeta
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            // Crear imagen
            const imagen = document.createElement("img");

            imagen.alt = plato.name;

            cargarImagen(
                imagen,
                plato.imageUrl,
                plato.name + " plato típico Colombia"
            );

            // Crear nombre
            const titulo = document.createElement("h2");
            titulo.textContent = plato.name;

            // Crear descripción
            const descripcion = document.createElement("p");
            descripcion.textContent =
                plato.description || "Sin descripción disponible";

            // Crear departamento
            const departamento = document.createElement("p");
            departamento.textContent =
                "Departamento: " +
                (plato.department?.name || "No disponible");

            // Crear ingredientes
            const ingredientes = document.createElement("p");
            ingredientes.textContent =
                "Ingredientes: " +
                (plato.ingredients || "No disponibles");

            // Agregar elementos a la tarjeta
            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(departamento);
            tarjeta.appendChild(ingredientes);

            // Agregar tarjeta al DOM
            contenedor.appendChild(tarjeta);
        });

    })
    .catch(error => {
        carga.textContent =
            "No fue posible cargar los platos: " + error.message;
    });
