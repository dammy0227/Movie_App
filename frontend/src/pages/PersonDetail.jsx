import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonDetails } from '../features/people/peopleSlice';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Film, Tv } from 'lucide-react';

const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { details, loading } = useSelector((state) => state.people || {});

  useEffect(() => {
    dispatch(fetchPersonDetails(id));
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner />;
  if (!details) return null;

  const movies = details.movie_credits?.cast || [];
  const tvShows = details.tv_credits?.cast || [];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/4">
            <img
              src={details.profile_path 
                ? `https://image.tmdb.org/t/p/w500${details.profile_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
              }
              alt={details.name}
              className="w-full rounded-2xl"
            />
          </div>
          
          <div className="md:w-3/4 text-white">
            <h1 className="text-4xl font-bold mb-4">{details.name}</h1>
            
            <div className="flex gap-4 mb-4">
              {details.birthday && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Born: {new Date(details.birthday).toLocaleDateString()}</span>
                </div>
              )}
              {details.place_of_birth && (
                <span>in {details.place_of_birth}</span>
              )}
            </div>

            {details.biography && (
              <>
                <h2 className="text-xl font-semibold mb-2">Biography</h2>
                <p className="text-gray-300 leading-relaxed">{details.biography}</p>
              </>
            )}
          </div>
        </div>

        {movies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Film className="w-6 h-6 mr-2" />
              Known for Movies
            </h2>
            <MovieRow
              title=""
              movies={movies.slice(0, 10).map(m => ({
                id: m.id,
                title: m.title,
                poster_path: m.poster_path,
                vote_average: m.vote_average,
                release_date: m.release_date
              }))}
              onMovieClick={(movie) => navigate(`/movie/${movie.id}`)}
            />
          </div>
        )}

        {tvShows.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Tv className="w-6 h-6 mr-2" />
              Known for TV Shows
            </h2>
            <MovieRow
              title=""
              movies={tvShows.slice(0, 10).map(t => ({
                id: t.id,
                title: t.name,
                poster_path: t.poster_path,
                vote_average: t.vote_average,
                release_date: t.first_air_date
              }))}
              onMovieClick={(show) => navigate(`/tv/${show.id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetail;