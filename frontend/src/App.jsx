import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MovieDetail from './pages/MovieDetail';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import TVDetail from './pages/TVDetail';
import PersonDetail from './pages/PersonDetail';
import SearchResults from './pages/SearchResults';
import AISuggestionsPage from './pages/AISuggestionsPage';
import Ratings from './pages/Ratings'; 
import VideoPlayer from './components/VideoPlayer';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      {/* VideoPlayer will render here when a video is playing */}
      <VideoPlayer />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tv"
          element={
            <ProtectedRoute>
              <TVShows />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ai-suggestions"
          element={
            <ProtectedRoute>
              <AISuggestionsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tv/:id"
          element={
            <ProtectedRoute>
              <TVDetail />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/person/:id"
          element={
            <ProtectedRoute>
              <PersonDetail />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/ratings"
          element={
            <ProtectedRoute>
              <Ratings />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;