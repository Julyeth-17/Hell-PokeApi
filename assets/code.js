let listaPokemon = document.querySelector('#listaPkmn')
let pknURL = "https://pokeapi.co/api/v2/pokemon"

// 1. Crear una funcion donde se puedan realizar las peticiones sin repetir fetch
// 2. Enlazar el resultado de la primera extrayendo ".results"` para la funcion que pinta pokemones

//Esta función usa fetch, que por defecto es sincronica, y a través de un for, pide datos de cada pokemon
//Los pokemones se devuelven en order que las promesas se resuelven
function pedidoEnOrderDeComidaLista() {
    fetch(pknURL)
        .then(response => response.json())
        .then(response => {
            const results = response.results;
            for (var i = 0; i < results.length; i++) {
                let pokemon = results[i];
                entregaCuandoElPedidoEsteListo(pokemon);
            }
        })
}


// Esta función usa fech pero con async/await (asincrona), lo cual significa que cada llamado SE ESPERA hasta que se complete, antes de moverse
//a la siguiente instrucción

async function salidaEnOrderDeLlegada() {
    let response = await fetch(pknURL)
    let list = await response.json();
    const results = list.results;
    for (var i = 0; i < results.length; i++) {
        let pokemon = results[i];
        await entregaEnOrderDePedido(pokemon);
    }
}
salidaEnOrderDeLlegada();


const entregaEnOrderDePedido = async (pokemon) => {
    let promesa = await fetch(pokemon.url);
    let pokemonCompleto = await promesa.json();
    const habilidades = pokemonCompleto.abilities;
    let nombresDeHabilidadesEnEspanol = [];

    listaPokemon.innerHTML += `
    <div class="pokemon">
        <p class="pkmnIdBack">#${pokemonCompleto.id}</p>
        <div class="pkmnInfo">
            <div class="nombre-contenedor">
                <p class="pkmnId">${pokemonCompleto.id}</p>
                <h2 class="pkmnName">${pokemon.name}</h2>
            </div>
            <div class="pkmnAbility" id="habilidadesPokemon_${pokemonCompleto.id}">
            </div>
            <div class="pkmnStats">
                <p class="stat">${pokemonCompleto.height}</p>
                <p class="stat">${pokemonCompleto.weight}kg</p>
            </div>
        </div>
    </div>
`

    habilidades.forEach(async (ability) => {
        let promesa = await fetch(ability.ability.url);
        let habilidadCompleta = await promesa.json();
        console.log(habilidadCompleta);

        //buscar dentro del arreglo de nombres, el que corresponsa a espanol;
        let es = habilidadCompleta.names.find(x => x.language.name === 'es');
        //let efecto = habilidadCompleta.effect_entries.find(x => x.language.name === 'es');
        //console.log(es);
        //console.log(es.name);
        //console.log(efecto)

        nombresDeHabilidadesEnEspanol.push(es.name);
        console.log(habilidades);

        let listaHabilidades = document.querySelector(`#habilidadesPokemon_${pokemonCompleto.id}`)
        listaHabilidades.innerHTML += `<p class="${es.name}">${es.name}</p>`;
    })
}

function entregaCuandoElPedidoEsteListo(pokemon) {
    fetch(pokemon.url)
        .then((res) => res.json())
        .then(pokemonCompleto => {

            // codigo para crear cada tarjeta y que muestre el nombre
            //let div = document.createElement('div')
            //.classList.add(pknURL)
            listaPokemon.innerHTML += `
                        <div class="pokemon">
                            <p class="pkmnIdBack">#025</p>
                            <div class="pkmnInfo">
                                <div class="nombre-contenedor">
                                    <p class="pkmnId">${pokemonCompleto.id}</p>
                                    <h2 class="pkmnName">${pokemon.name}</h2>
                                </div>
                                <div class="pkmnType">
                                    <p class="electrico type">Eléctrico</p>
                                    <p class="lucha type">Lucha</p>
                                </div>
                                <div class="pkmnStats">
                                    <p class="stat">4m</p>
                                    <p class="stat">60kg</p>
                                </div>
                            </div>
                        </div>
                    `
        })
}

//     let div = document.createElement("div")
//     div.classList.add("pknURL")
//     div.innerHTML = `
//     <p class="pkmnIdBack">#${pknURL.id}</p>
//     <div class="pkmnImg">
//         <img src="${pknURL.sprites.other[official-artwork].front_default}">
//     </div>
//     <div class="pkmnInfo">
//         <div class="nombre-contenedor">
//             <p class="pkmnId">#${pknURL.id}</p>
//             <h2 class="pkmnName">${pknURL.name}</h2>
//         </div>
//         <div class="pkmnType">
//             <p class="electrico type">Eléctrico</p>
//             <p class="lucha type">Lucha</p>
//         </div>
//         <div class="pkmnStats">
//             <p class="stat">${pknURL.height}</p>
//             <p class="stat">${pknURL.weight}</p>
//         </div>
//     </div>
// </div>
// `
//     listaPokemon.append('div')
