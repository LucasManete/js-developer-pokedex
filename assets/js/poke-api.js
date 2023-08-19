const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};

pokeApi.searchPokemons = async () => {
  var input = document.querySelector("#name");
  const pokemonDetails = document.getElementById("pokemonList");

  var texto = input.value.toLowerCase();

  const url = `https://pokeapi.co/api/v2/pokemon/${texto}`;

  let response = await fetch(url);

  const data = await response.json();

  console.log(data);

  const pokemonHTML = `
          <h2>${data.name.toUpperCase()}</h2>
          <img src="${data.sprites.front_default}" alt="${data.name}">
          <p>Altura: ${data.height}</p>
          <p>Peso: ${data.weight}</p>
          <p>Tipo(s): ${data.types
            .map((type) => type.type.name)
            .join(", ")}</p>`;

  pokemonDetails.innerHTML = pokemonHTML;
};
