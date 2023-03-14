import React from "react";
import { getPokemons } from "../getPokemons";
import { useState } from "react";

export const PokemonsCard = ()=>{
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
        <div className="flex w-full h-screen items-center justify-center bg-slate-100">
            <div>
            {pokemon && translatedPokemon ? (
            <div className="card card-side bg-base-100 shadow-xl">
                    <figure><img src={pokemon?.image} className="w-64" alt="Movie"/></figure>
          <div className="card-body">
          <h1 className="card-title text-4xl ml-3">{translatedPokemon.name.toUpperCase()}</h1>
          <div className="p-4 flex flex-row gap-10">
              <div>
              <h3 className="text-left text-xl font-bold mb-2">Movimientos</h3>
              <div className="flex flex-col gap-2">
                  {translatedPokemon.moves?.map((poke, index) => (
                      <p key={index} className="text-left">{poke}</p>
                  ))}
              </div>
              </div>
              <div>
                  <h3 className="text-left text-xl font-bold mb-2">Tipo de Pokemon</h3>
                  <div>
                      {translatedPokemon.types?.map((poke, index) => (
                          <p key={index} className="text-left gap-2">{poke}</p>
                      ))}
                  </div>
              </div>
          </div>
          <div className="card-actions justify-start ml-3">
          <button className="btn btn-primary" onClick={changePokemon}>OBTEN OTRO POKEMON</button>
            </div>
        </div>
        </div>
        ) : (
            <div className="flex items-center justify-center h-screen w-screen bg-slate-100">
                <button className="btn btn-primary w-64 bg-white text-blue-800 hover:text-white" onClick={changePokemon}>OBTEN UN POKEMON</button>
            </div>
        )}
        </div>
        </div>
    )}