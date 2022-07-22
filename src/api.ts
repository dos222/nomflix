
const API_KEY = "94bb8be93aa678fb54ba0a61ac2b5dc3";
const BASE_URL = "https://api.themoviedb.org/3";
// region =kr
interface IMovie{
    // 필요한 것만 처리해도 된다.
    id : number;  
    backdrop_path : string; 
    poster_path : string; 
    title : string; 
    overview : string;
}

export interface IGetMoviesResult {
    dates : { 
        maximum : string; 
        minmum : string; 
    };
    page :number; 
    results : IMovie[]; 
    total_pages : number; 
    total_result : string ;
}

export const getMovies = ()=>{
    return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`)
    .then(res=>res.json())
}