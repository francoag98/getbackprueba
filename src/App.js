import "./App.css";
import { getPokemons } from "./getPokemons";
import { useState } from "react";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

function App() {
  const [pokemon, setPokemon] = useState({});
  const { t } = useTranslation();
  const changePokemon = async () => {
    const response = await getPokemons();
    console.log("hola", response);
    setPokemon(response);
  };

  return (
    <div className="App">
      {pokemon && pokemon.name ? (
        <div>
          <h1>{t(pokemon.name)}</h1>
          <img
            src={pokemon.sprites && pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <h4>Movimientos</h4>
          <div>
            {pokemon.moves?.slice(0, 4).map((poke, index) => (
              <p key={index}>{t(poke.move.name)}</p>
            ))}
          </div>
          <h4>Tipo de pokemon</h4>
          <div>
            {pokemon.types?.map((poke, index) => (
              <p key={index}>{t(poke.type.name)}</p>
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
