// Variables
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const paginacion = document.querySelector("#paginacion");

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

const validarFomulario = e => {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    mostrarMensaje("Agrega un termindo de búsquedad");
    return;
  }

  buscarImagenes();
};

const mostrarMensaje = mensaje => {
  const existeAlerta = document.querySelector(".bg-red-100");

  if (!existeAlerta) {
    const alerta = document.createElement("p");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
            <strong class="font-bold">Error!</strong> 
            <span class="block sm:inline">${mensaje}</span>
        `;

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
};

const buscarImagenes = () => {
  const termino = document.querySelector("#termino").value;

  const key = "36243830-19a89048b6ab3a88faa0f6974";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      mostrarImagenes(resultado.hits);
    });
};

// Generador que va registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

const calcularPaginas = total => {
  return parseInt(Math.ceil(total / registroPorPagina));
};

const mostrarImagenes = imagenes => {
  limpiar(resultado);

  // Iterar sobre el arreglo de imagenes y contruir el HTML
  imagenes.forEach(imagen => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">        

                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me gusta</span> </p> 
                        <p class="font-bold">${views} <span class="font-light">Vistas</span> </p> 

                        <a href="${largeImageURL}" rel="noopener noreferrer" target="_blank" class="block bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                                
                    </div>
                </div>
            </div>
        `;
  });

  // Limpiar el paginador previo
  limpiar(paginacion);

  // Generamos el nuevo HTML
  imprimirPaginador();
};

const imprimirPaginador = () => {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    // Caso contrario, genera un botón por cada elemento en el generador
    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-4",
      "rounded"
    );

    boton.onclick = () => {
      paginaActual = value;

      buscarImagenes();
    };

    paginacion.appendChild(boton);
  }
};

const limpiar = elemento => {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
};

window.onload = () => {
  formulario.addEventListener("submit", validarFomulario);
};
