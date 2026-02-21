import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import movieReducer from '../features/movie/movieSlice';
import tvReducer from '../features/tv/tvSlice';              
import peopleReducer from '../features/people/peopleSlice';  
import collectionReducer from '../features/collection/collectionSlice'; 
import searchReducer from '../features/search/searchSlice';  
import userReducer from '../features/user/userSlice';
import aiReducer from '../features/ai/aiSlice';
import ratingReducer from '../features/rating/ratingSlice';
<<<<<<< HEAD
import movieboxReducer from '../features/moviebox/movieboxSlice';
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    tv: tvReducer,                    
    people: peopleReducer,            
    collection: collectionReducer,    
    search: searchReducer,            
    user: userReducer,
    ai: aiReducer,
    rating: ratingReducer,
<<<<<<< HEAD
    moviebox: movieboxReducer,
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
  },
});