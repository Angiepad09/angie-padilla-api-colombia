
const URL = "https://api-colombia.com/api/v1/TypicalDish";

const contenedor = document.getElementById("contenedor");
const carga = document.getElementById("carga");
const total = document.getElementById("total");

fetch(URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al consultar los platos");
        }

        return response.json();
    })
    .then(platos => {

        carga.textContent = "";

        total.textContent = "Total de platos: " + platos.length;

        platos.forEach(plato => {

            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            const imagen = document.createElement("img");
            imagen.alt = plato.name;

            cargarImagen(
                imagen,
                plato.imageUrl,
                plato.name + " plato típico Colombia"
            );

            const titulo = document.createElement("h2");
            titulo.textContent = plato.name;

            const descripcion = document.createElement("p");
            descripcion.textContent = plato.description || "Sin descripción disponible";

            const departamento = document.createElement("p");
            departamento.textContent = "Departamento: " + (plato.department?.name || "No disponible");

            const ingredientes = document.createElement("p");
            ingredientes.textContent = "Ingredientes: " + (plato.ingredients || "No disponibles");

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(departamento);
            tarjeta.appendChild(ingredientes);

            contenedor.appendChild(tarjeta);
        });

    })
    .catch(error => {
        carga.textContent =
            "No fue posible cargar los platos: " + error.message;
    });
