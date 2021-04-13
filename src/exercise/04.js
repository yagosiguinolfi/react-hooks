import * as React from 'react'
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'

function PokemonInfo({ pokemonName }) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState('idle') // Ocioso

  React.useEffect(() => {

    if (!pokemonName) return   // Nome vazio, retorna sem fazer nada

    // Resetar o estado do pokemon
    setPokemon(null)
    setError(null)

    /*
    // Essa abordagem não funciona porque o JS trabalha de forma ASSÍNCRONA
    const pokemonData = fetchPokemon(pokemonName)   // Chamada da API
    setPokemon(pokemonData)     // Atualizar o estado com os dados retornados da API
    */
    // Callback é um função que será executada pela função assíncrona assim que ela
    // tiver terminado de fazer sua tarefa

    // Tecnicamente, uma função assíncrona retorna um objeto do tipo Promise (promessa).
    // Uma Promise suporta dois callbacks, um para quando a execução assíncrona dá certa
    // e outro para o caso de erro.
    /*
    // MÉTODO 1: Promise com then..catch
    fetchPokemon(pokemonName)
        .then(     // Callback para quando dá certo ("do bem")
            pokemonData => setPokemon(pokemonData)
        )
        .catch(    // Callback para quando dá errado ("do mal")
            erro => alert(erro.message)
        )
    */

    // MÉTODO 2: função com async...await
    async function getPokemonFromServer() {     // Declaração da função assíncrona
      try {   // TENTA fazer a chamada ao servidor remoto da API
        setStatus('pending')
        const pokemonData = await fetchPokemon(pokemonName)
        setPokemon(pokemonData)
        setStatus('resolved')
      }
      catch (erro) {   // Em caso de erro no bloco try, caímos no bloco catch()
        setError(erro)
        setStatus('rejected')
      }
    }
    // Chamada da função assíncrona
    getPokemonFromServer()

  }, [pokemonName])

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  switch (status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'rejected':
      return (
        <div role="alert">
          There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
        </div>
      )
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    //case 'resolved':
    default:
      return <PokemonDataView pokemon={pokemon} />
  }

}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App