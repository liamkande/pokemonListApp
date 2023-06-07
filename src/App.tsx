import React, { useEffect, useState } from "react"

interface PokemonState {
  name: string
  sprites: { other: { dream_world: { front_default: string } } }
}

interface PokemonProps {
  url: string
}

const Pokemon: React.FC<PokemonProps> = ({ url }) => {
  const [pokemon, setPokemon] = useState<PokemonState | null>(null)

  const getPokemon = async () => {
    const response = await fetch(url)
    const data: PokemonState = await response.json()
    setPokemon(data)
  }

  useEffect(() => {
    getPokemon()
  }, [])

  if (!pokemon) return null

  return (
    <li className="pokemon">
      <img
        alt={pokemon.name}
        src={pokemon.sprites.other.dream_world.front_default}
      />
      <strong>{pokemon.name}</strong>
    </li>
  )
}

const PAGE_SIZE = 50

interface PokeListState {
  page_num: number
  pokemon_list: { url: string }[] | null
}

const PokeList: React.FC = () => {
  const [page_num, setPageNum] = useState(0)
  const [pokemon_list, setPokemonList] =
    useState<PokeListState["pokemon_list"]>(null)

  const getPokemonList = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${
        page_num * PAGE_SIZE
      }`
    )
    const data: { results: { url: string }[] } = await response.json()
    setPokemonList(data.results)
  }

  useEffect(() => {
    getPokemonList()
  }, [page_num])

  const handlePrevPage = () => {
    setPageNum((prevPageNum) => prevPageNum - 1)
  }

  const handleNextPage = () => {
    setPageNum((prevPageNum) => prevPageNum + 1)
  }

  return (
    <div>
      {page_num >= 1 && (
        <button className="button" onClick={handlePrevPage}>
          Prev
        </button>
      )}
      <button className="button" onClick={handleNextPage}>
        Next
      </button>
      <ul>
        {pokemon_list?.map((pokemon) => (
          <Pokemon key={pokemon.url} url={pokemon.url} />
        ))}
      </ul>
    </div>
  )
}

export default PokeList
