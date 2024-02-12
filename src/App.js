import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/images/logo.png';
import axios from 'axios';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allPokemons, setAllPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [loadPoke, setLoadPoke] = useState('https://pokeapi.co/api/v2/pokemon?limit=64');

  const getAllPokemons = async () => {
    try {
      const res = await fetch(loadPoke);
      const data = await res.json();
      setLoadPoke(data.next);

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          return await res.json();
        })
      );

      // Update total pages based on the number of Pokémon you want to display per page
      const itemsPerPage = 10; // Adjust this according to your needs
      const calculatedTotalPages = Math.ceil(pokemonDetails.length / itemsPerPage);
      setTotalPages(calculatedTotalPages);

      setAllPokemons(pokemonDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAllPokemons();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    // Update the current page
    setCurrentPage(newPage);
  };

  const searchHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search}`);

      // Check if it's a list or a single Pokémon
      if (Array.isArray(res.data.results)) {
        // If it's a list, set the list to the state
        setAllPokemons(res.data.results);
      } else {
        // If it's a single Pokémon, set it as an array with a single element
        setAllPokemons([res.data]);
      }

      console.log('single pokemon', res);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      // Clear the search term after the search
      setSearch('');
    }
  };
  

  return (
    <div className="App">
      <div className="pt-10 pb-10">
        <div className="flex justify-center">
          <img className="pb-8 flex" src={logo} alt="pokemon" width="600" />
        </div>
        <div id="search-bar" className="flex justify-center pb-2">
          <form className="w-96 flex items-center justify-center p-2" onSubmit={searchHandler}>
            <input
              type="text"
              placeholder="Search Pokemon here"
              className="w-full rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent normal-case"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            >
              Search
            </button>
          </form>
        </div>
        <div className="flex flex-wrap justify-center gap-5 pt-5">
          {allPokemons.map((pokemon, index) => (
            <div key={index}>
              <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
              <p className="text-white text-center" key={index}>
                {pokemon.name}
              </p>
            </div>
          ))}
        </div>
        <div className='pt-5 flex justify-center gap-2'>
            {/* Display pagination controls */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                className={`bg-white pt-2 pb-2 pl-3 pr-3 font-bold pagi ${currentPage === page ? 'active' : ''}`}
                key={page}
                onClick={() => handlePageChange(page)}
              >
              {page}
            </button>
            ))}
          </div>
      </div>
    </div>
  );
}

export default App;
