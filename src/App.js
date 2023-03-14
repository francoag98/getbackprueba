import "./App.css";
import { getPokemons } from "./getPokemons";
import { useState } from "react";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [translatedPokemon, setTranslatedPokemon] = useState(null);
  const apiKey = process.env.REACT_APP_MICROSOFT_TRANSLATOR_API_KEY;

  const changePokemon = async () => {
    const response = await getPokemons();
    const sacandoGuion = response.moves.map((move) => {
      if (move.move.name.includes("-")) {
        const name = move.move.name.replace("-", " ");
        return name;
      }
      return move.move.name;
    });
    const pokemonToTranslate = {
      name: response.name,
      moves: sacandoGuion.slice(0, 4),
      types: response.types.slice(0, 4),
    };
    console.log(pokemonToTranslate.name);
    setPokemon({
      ...pokemonToTranslate,
      image: response.sprites.front_default,
    });
    translatePokemon(pokemonToTranslate);
  };

  const translateText = async (text, fromLang, toLang) => {
    const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${fromLang}&to=${toLang}`;
    const body = [{ text: text }];
    const headers = new Headers({
      "Ocp-Apim-Subscription-Key": apiKey,
      "Content-Type": "application/json",
    });
    const result = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => data[0].translations[0].text)
      .catch((error) => console.error(error));
    return result;
  };

  const translatePokemon = async (pokemon) => {
    const translatedName = await translateText(pokemon.name, "en", "es");
    const translatedMoves = await Promise.all(
      pokemon.moves.map((movex) => {
        return translateText(movex, "en", "es");
      })
    );
    const translatedTypes = await Promise.all(
      pokemon.types.map((typex) => translateText(typex.type.name, "en", "es"))
    );

    const translatdPokemon = {
      name: translatedName,
      moves: translatedMoves,
      types: translatedTypes,
    };
    setTranslatedPokemon(translatdPokemon);
    return translatdPokemon;
  };
  return (
    <div className="App">
      {pokemon && translatedPokemon ? (
        <div>
          <h1>{translatedPokemon.name.toUpperCase()}</h1>
          <img src={pokemon.image} alt={translatedPokemon.name} />
          <h4>Movimientos</h4>
          <div>
            {translatedPokemon.moves?.map((poke, index) => (
              <p key={index}>{poke}</p>
            ))}
          </div>
          <h4>Tipo de pokemon</h4>
          <div>
            {translatedPokemon.types?.map((poke, index) => (
              <p key={index}>{poke}</p>
            ))}
          </div>
          <div>
            <button onClick={changePokemon}>OBTEN OTRO POKEMON</button>
          </div>
        </div>
      ) : (
        <button onClick={changePokemon}>OBTEN UN POKEMON</button>
      )}
    </div>
  );
}

export default App;
