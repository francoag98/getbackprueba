import React, { useEffect } from "react";
import { getPokemons } from "../getPokemons";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export const PokemonsCard = () => {
  const [pokemon, setPokemon] = useState(null);
  const [translatedPokemon, setTranslatedPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.REACT_APP_MICROSOFT_TRANSLATOR_API_KEY;

  useEffect(() => {
    setTranslatedPokemon(null);
  }, [pokemon]);

  const reset = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const changePokemon = async () => {
    reset();
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
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-screen">
        <ClipLoader color="purple" size={100} />
        <h3 className="text-purple-800 text-2xl font-bold mt-4">
          Cargando Pokemon...
        </h3>
      </div>
    );
  } else {
    return (
      <div className="flex w-screen h-screen items-center justify-center bg-slate-100">
        <div>
          {pokemon && translatedPokemon ? (
            <div className="card card-side p-4 bg-base-100 shadow-xl max-sm:flex-col">
              <figure>
                <img
                  src={pokemon?.image}
                  className="w-64 ml-10 max-sm:ml-0"
                  alt="Movie"
                />
              </figure>
              <div className="card-body mr-16 max-sm:w-full">
                <h1 className="card-title text-4xl ml-3 max-sm:justify-center max-sm:text-2xl">
                  {translatedPokemon.name.toUpperCase()}
                </h1>
                <div className="p-4 flex flex-row gap-6 max-sm:justify-center">
                  <div className="max-sm:justify-center">
                    <h3 className="text-left text-xl font-bold mb-2 max-sm:mr-6">
                      Movimientos
                    </h3>
                    <div className="flex flex-col gap-2">
                      {translatedPokemon.moves?.map((poke, index) => (
                        <p key={index} className="text-left">
                          {poke}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-left text-xl font-bold mb-2 max-sm:ml-1">
                      Tipos
                    </h3>
                    <div className="flex flex-col max-sm:ml-2">
                      {translatedPokemon.types?.map((poke, index) => (
                        <p key={index} className="text-left max-sm:text-left">
                          {poke}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-start ml-3 max-sm:justify-center">
                  <button
                    className="btn btn-primary w-56 max-sm:w-64"
                    onClick={changePokemon}>
                    OBTEN OTRO POKEMON
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-screen w-screen bg-slate-100">
              <button
                className="btn btn-primary w-64 bg-white text-violet-800 hover:text-white"
                onClick={changePokemon}>
                OBTEN UN POKEMON
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
};
