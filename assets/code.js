let listaPokemon = document.querySelector('#listaPkmn')

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

// Esta función usa fech pero con async/await (asincrona), lo cual significa que cada llamado SE ESPERA hasta que se complete, antes de moverse a la siguiente instrucción

async function traerPokemones(pknURL = "https://pokeapi.co/api/v2/pokemon?limit=18") {
    // borrar lista existing
    document.querySelector('#listaPkmn').innerHTML = "";

    let response = await fetch(pknURL)
    let list = await response.json();

    document.querySelector("#paginacion").innerHTML = `
    <button type="button" class="btn btn-warning" id="btnAtras" onclick="traerPokemones('${list.previous}')">Anterior</button>
    <button type="button" class="btn btn-warning" id="btnSiguiente" onclick="traerPokemones('${list.next}')">Siguiente</button>
    `
    //console.log(list.previous)
    //console.log(list.next)

    const results = list.results;

    for (var i = 0; i < results.length; i++) {
        let pokemon = results[i];
        await traerPokemonCompletoYAgregarloAlDOM(pokemon);
    }

}
traerPokemones();

const traerPokemonCompletoYAgregarloAlDOM = async (pokemon) => {
    let promesa = await fetch(pokemon.url);
    let pokemonCompleto = await promesa.json();

    let pokeId = pokemonCompleto.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const habilidades = pokemonCompleto.abilities;
    const tipos = pokemonCompleto.types;
    const imagenes = pokemonCompleto.sprites;

    let nombresDeHabilidadesEnEspanol = [];
    let nombresDeTiposEnEspanol = [];

    listaPokemon.innerHTML += `

    <div class="pokemon">
        <p class="pkmnIdBack">#${pokeId}</p>
        <div class="pkmnImg" id="pokemonPic_${pokemonCompleto.id}">
                <img src="${imagenes.front_default}">
        </div>
        <div class="pkmnInfo">
            <div class="nombre-contenedor">
                <p class="pkmnId">${pokeId}</p>
                <h2 class="pkmnName">${pokemon.name}</h2>
            </div>
            <div class="pkmnAbility" id="habilidadesPokemon_${pokemonCompleto.id}">
            </div>
            <div class="pkmnType" style="" id="tiposDePokes_${pokemonCompleto.id}">
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
        //console.log(habilidadCompleta);

        //buscar dentro del arreglo de nombres, el que corresponda a espanol;
        let es = habilidadCompleta.names.find(x => x.language.name === 'es');
        //let efecto = habilidadCompleta.effect_entries.find(x => x.language.name === 'es');
        //console.log(es);
        //console.log(es.name);

        nombresDeHabilidadesEnEspanol.push(es.name);
        //console.log(habilidades);

        let listaHabilidades = document.querySelector(`#habilidadesPokemon_${pokemonCompleto.id}`)
        listaHabilidades.innerHTML += `<p class="${es.name}">${es.name}</p>`;
    })

    tipos.forEach(async (type) => {
        let promesa2 = await fetch(type.type.url)
        let tipoPkmn = await promesa2.json()
        //console.log(tipoPkmn)

        let tipoespa = tipoPkmn.names.find(x => x.language.name === 'es');

        nombresDeTiposEnEspanol.push(tipoespa.name);
        //console.log(tipos)
        //console.log(tipoespa.name);

        let listaTipos = document.querySelector(`#tiposDePokes_${pokemonCompleto.id}`)
        listaTipos.innerHTML += `<p class="${tipoespa.name}">${tipoespa.name}</p>`;
    })
}

async function traerPokemonesPorTipo(url = 'https://pokeapi.co/api/v2/type') {
    //borrar el contenido del tablero
    document.querySelector('#listaPkmn').innerHTML = "";
    //traer la lista de pokemones por typo
    let respuesta = await fetch(url)
    let typeList = await respuesta.json();



    let pokemones = typeList.pokemon;

    let primero = pokemones[0];
    //console.log(primero.pokemon);´

    for (const poke of pokemones) {
        console.log(poke.pokemon)
        traerPokemonCompletoYAgregarloAlDOM(poke.pokemon);
    }
}

