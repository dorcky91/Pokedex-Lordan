let arregloDatos = [];
let searchInput = document.querySelector("#search input");

//Obtener datos del api
window.addEventListener("load", obtenerDatosDelApi);
async function obtenerDatosDelApi() {
  //  let urlApi = "https://storage.googleapis.com/campus-cvs/00000000000-images-lectures/pokemons.json";

  //   const response = await fetch("pokemon.json");
  //   let datos = await response.json();
  //   console.log(datos);
  try {
    await fetch("pokemon.json")
      .then((res) => res.json())
      .then((datos) => {
        arregloDatos = datos;
        rellenarCards();
      });
  } catch (error) {
    console.log(error);
  }
}

//Rellenar las columnas con cards
function rellenarCards() {
  let contenedorPokemon = document.querySelector("#contenedor-pokemon");
  arregloDatos.forEach((pokemon) => {
    let contenedorTipo = "";
    let tipos = pokemon.type;
    tipos.forEach((tipo) => {
      contenedorTipo += `
            <li
                class="list-group-item border-0 border-bottom rounded-0">
                    ${tipo}
            </li>`;
    });

    contenedorPokemon.innerHTML += ` 
        <div class="col-sm-6 col-md-4 col-lg-3 colum-pokemon position-relative">
            <div class="card h-100 border-0 shadow overflow-hidden">
              <img loading="lazy" src="${pokemon.ThumbnailImage}" class="card-img-top" alt="${pokemon.ThumbnailAltText}" />
              <div class="card-body">
                <small>No. ${pokemon.number}</small>
                <p class="fw-bold">${pokemon.name}</p>
                <div>
                  <p class="fw-bold mb-1">Type</p>
                  <ol class="list-group list-group-numbered small">
                    ${contenedorTipo}
                  </ol>
                </div>
              </div>
              <div
                class="d-flex justify-content-center align-items-center detalle">
                <p class="px-2 text-center small">4m Read</p>
                <p class="px-2 text-center small">100k Views</p>
                <p class="px-2 text-center small">50 Comments</p>
              </div>
              <a
                data-bs-toggle="modal"
                data-bs-target="#modalDetalle"
                href="#" onclick="mostrarInformacionDeUnPokemon(${pokemon.id})"
                class="stretched-link"></a>
            </div>
          </div>`;
  });
}

//Mostrar datos del modal
function mostrarInformacionDeUnPokemon(idPokemon) {
  let nombre = document.querySelector("#nombre-pokemon");
  let numero = document.querySelector("#numero-pokemon");
  let img = document.querySelector("#img-pokemon");
  let weight = document.querySelector("#weight-pokemon");
  let height = document.querySelector("#height-pokemon");
  let listaTipo = document.querySelector("#tipo-pokemon");
  let listaWeakness = document.querySelector("#weakness-pokemon");
  let listaAbilities = document.querySelector("#abilities-pokemon");
  let slug = document.querySelector("#slug-pokemon");

  const resultado = arregloDatos.find(({ id }) => id === idPokemon);
  nombre.innerHTML = resultado.name;
  numero.innerHTML = `(No. ${resultado.number})`;
  img.src = resultado.ThumbnailImage;
  img.alt = resultado.ThumbnailAltText;

  weight.innerHTML = `${resultado.weight} kg`;
  height.innerHTML = `${resultado.height} cm`;
  slug.innerHTML = resultado.slug;

  listaTipo.innerHTML = "";
  resultado.type.forEach((tipo) => {
    listaTipo.innerHTML += `
            <li
                class="list-group-item border-0 border-bottom rounded-0">
                    ${tipo}
            </li>`;
  });

  listaWeakness.innerHTML = "";
  resultado.weakness.forEach((weakness) => {
    listaWeakness.innerHTML += `
            <li
                class="list-group-item border-0 border-bottom rounded-0">
                    ${weakness}
            </li>`;
  });

  listaAbilities.innerHTML = "";
  resultado.abilities.forEach((ability) => {
    listaAbilities.innerHTML += `
            <li
                class="list-group-item border-0 border-bottom rounded-0">
                    ${ability}
            </li>`;
  });
}

//Controlar búsqueda
searchInput.addEventListener("input", controlarInput);
function controlarInput() {
  let valor = searchInput.value.toLowerCase();
  if (valor.length > 0) {
    searchInput.classList.add("active");
  } else {
    searchInput.classList.remove("active");
  }

  buscarPokemon(valor);
}

//Controlar búsqueda
function buscarPokemon(valorEntrado) {
  var txtValue, cardBody;
  let contenedorPokemon = document.querySelector("#contenedor-pokemon");
  let columna = contenedorPokemon.getElementsByClassName("colum-pokemon");

  for (i = 0; i < columna.length; i++) {
    cardBody = columna[i].getElementsByClassName("card-body")[0];
    txtValue = cardBody.textContent || cardBody.innerText;
    if (txtValue.toLowerCase().indexOf(valorEntrado) > -1) {
      if (valorEntrado.length > 0) {
        columna[i].style.display = "block";
      } else {
        if (i < currentItems) {
          columna[i].style.display = "block";
        } else {
          columna[i].style.display = "none";
        }
      }
    } else {
      columna[i].style.display = "none";
    }
  }
}

const loadMore = document.querySelector("#load-more");
let currentItems = 12;
loadMore.addEventListener("click", (e) => {
  const elementList = [...document.querySelectorAll(".colum-pokemon")];
  e.target.querySelector(".spinner-border").classList.remove("visually-hidden");
  for (let i = currentItems; i < currentItems + 12; i++) {
    setTimeout(function () {
      e.target
        .querySelector(".spinner-border")
        .classList.add("visually-hidden");
      if (elementList[i]) {
        elementList[i].style.display = "block";
      }
    }, 1000);
  }
  currentItems += 12;

  //   hide load button after fully load
  if (currentItems >= elementList.length) {
    e.target.classList.add("loaded");
  }
});
