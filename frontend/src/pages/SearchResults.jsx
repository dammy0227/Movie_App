import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMultiSearch } from '../features/search/searchSlice';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import LoadingSpinner from '../components/LoadingSpinner';
import { Film, Tv, Users } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { movies = [], tv = [], people = [], loading } = useSelector((state) => state.search || {});

  useEffect(() => {
    if (query) {
      dispatch(fetchMultiSearch(query));
    }
  }, [query, dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Search Results for "{query}"
        </h1>

        {movies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Film className="w-6 h-6 mr-2 text-red-600" />
              Movies ({movies.length})
            </h2>
            <MovieRow
              title=""
              movies={movies}
              onMovieClick={(movie) => navigate(`/movie/${movie.id}`)}
            />
          </div>
        )}

        {tv.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Tv className="w-6 h-6 mr-2 text-red-600" />
              TV Shows ({tv.length})
            </h2>
            <MovieRow
              title=""
              movies={tv.map(show => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path,
                vote_average: show.vote_average
              }))}
              onMovieClick={(show) => navigate(`/tv/${show.id}`)}
            />
          </div>
        )}

        {people.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-red-600" />
              People ({people.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {people.map((person) => (
                <div
                  key={person.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/person/${person.id}`)}
                >
                  <img
                    src={person.profile_path 
                      ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                      : 'https://via.placeholder.com/300x450?text=No+Image'
                    }
                    alt={person.name}
                    className="w-full rounded-lg"
                  />
                  <h3 className="mt-2 text-white font-medium">{person.name}</h3>
                  <p className="text-xs text-gray-400">
                    {person.known_for_department}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!movies.length && !tv.length && !people.length && !loading && (
          <p className="text-center text-gray-400 py-12">No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;