import React, { useState,useEffect } from 'react'
import Search from "./components/Search"
import MovieCard from './components/MovieCard'; 
import BG from './assets/BG.png';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}
//Api-application progeamming interface
//a set of rules that allows one software applictiaon to talk to another
const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const[errorMessage,setErrorMessage] = useState('');
    const [MovieList,setMovieList] = useState([]);
    const [isLoading,setisLoading] = useState(false);

    const fetchMovies = async () => {
        setisLoading(true);
        setErrorMessage('');
        try{
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint,API_OPTIONS);

            if(!response.ok){
                throw new Error('Failede to fetch movies');
            }
            const data = await response.json();

            if(data.response === 'False'){
                setErrorMessage(data.error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);
            console.log(data);
        }catch(error){
            console.log(`Error fetching movies: ${error}`);
        }finally{
            setisLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies()
    },[])

      return (
    <main>
       <div className='pattern' style={{backgroundImage: `url(${BG})`}}>
       <header>
        <img src='hero-img.png' alt="Hero Banner"/>
        <h1>
        Find <span className='text-gradient'>Movies</span> You will enjoy without the hassle 
        </h1>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
       <h1 className='text-white'>{searchTerm}</h1>
       </header>
       
       <section className='allMovies'>
        <h2 className='text-center  my-[40px] box'>All Movies</h2>

        {isLoading? (
            <p className='text-white'>Loading...</p>
        ): errorMessage? (
            <p className='text-red-500'>{errorMessage}</p>
        ): (
            <ul className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
               {MovieList.map((movie) => (
                 <MovieCard key={movie.id} movie={movie}/>
                 ))}
             </ul>
        )}
       </section>
       </div>
    </main>
  )
}

export default App
