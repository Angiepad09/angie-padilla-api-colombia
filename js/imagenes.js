const IMAGEN_POR_DEFECTO = "https://placehold.co/300x200?text=Sin+imagen";
 
function cargarImagen(imagen, urlApi, textoBusqueda) {
 
    // Evita que algunos servidores bloqueen la imagen por "hotlinking"
    imagen.referrerPolicy = "no-referrer";
    imagen.loading = "lazy";
 
    let yaSeBuscoEnWikipedia = false;
 
    imagen.onerror = function () {
        if (!yaSeBuscoEnWikipedia) {
            yaSeBuscoEnWikipedia = true;
            buscarImagenWikipedia(textoBusqueda)
                .then(urlWiki => {
                    imagen.src = urlWiki || IMAGEN_POR_DEFECTO;
                })
                .catch(() => {
                    imagen.src = IMAGEN_POR_DEFECTO;
                });
        } else {
            // Si la de Wikipedia también falla, usar la de respaldo
            imagen.onerror = null;
            imagen.src = IMAGEN_POR_DEFECTO;
        }
    };
 
    if (urlApi && urlApi.trim() !== "") {
        imagen.src = urlApi;
    } else {
        // La API no trajo imagen: ir directo a Wikipedia
        imagen.onerror();
    }
}
 
// Busca en Wikipedia en español y devuelve la URL de la imagen principal del artículo
function buscarImagenWikipedia(texto) {
    const url =
        "https://es.wikipedia.org/w/api.php" +
        "?action=query&format=json&origin=*" +
        "&generator=search&gsrlimit=1" +
        "&gsrsearch=" + encodeURIComponent(texto) +
        "&prop=pageimages&piprop=thumbnail&pithumbsize=400";
 
    return fetch(url)
        .then(response => response.json())
        .then(datos => {
            if (!datos.query) {
                return null;
            }
            const paginas = Object.values(datos.query.pages);
            return paginas[0]?.thumbnail?.source || null;
        });
}