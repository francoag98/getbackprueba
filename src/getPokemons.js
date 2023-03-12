export const getPokemons = async () => {
  const pokemons = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=1281"
  ).then((response) => response.json());
  const randomPokemon =
    pokemons.results[Math.floor(Math.random() * pokemons.results.length)];
  const pokemon = await fetch(randomPokemon.url).then((response) =>
    response.json()
  );
  return pokemon;
};
