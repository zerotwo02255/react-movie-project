import React, { useEffect,useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/spinner";
import MovieCard from "./components/MovieCard";
import {useDebounce} from react-use;

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {

  const [searchTerm,setSearchTerm] = useState('');

  const[error,setError] = useState(null);

  const[movieList,setMovielist] = useState([]);

  const[loading,setLoading] = useState(false);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('');

  useDebounce( () => setDebouncedSearchTerm(searchTerm),500,[searchTerm]);

  
    const fetchMovies = async (query ='') => {
        setLoading(true);
        setError(null);
          




      try{
        const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
       

        const response = await fetch(endpoint,API_OPTIONS);

        if(!response.ok){
          throw new Error("Failed to fetch movies");
        }

        const data=await response.json();
         
        if (data.response === "False") {
          throw new Error("failed to fetch movies" || data.error);
          setMovielist([]);
          return;
        }
        console.log(import.meta.env.VITE_TMDB_API_KEY);
        setMovielist(data.results);
      } 
      
      catch (error) {
        console.error("Error fetching movies:" + error);
        setError("Failed to fetch movies. Please try again later.");
      }finally{
        setLoading(false);
      }
    }

   useEffect(() => {
    fetchMovies(debouncedSearchTerm);


  },[debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero" />
          <h1>
            Find <span className="text-gradient"> Movie   
            </span>
              that youll enjoy without any time waste  
           
            <span className="text-gradient"> ACTION HORROR </span>
          </h1>
        </header>

        < Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <section className="all-movies">
           <h2 className="mt-10">All Movies</h2>


          {loading ? (
            <Spinner />
          ): error ? (
            <p className="text-shadow-light-100">{error}</p>
          ):(
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              

              ))}
            </ul>
          )}
      
        </section>


      </div>
    </main>
  );
};

export default App;
