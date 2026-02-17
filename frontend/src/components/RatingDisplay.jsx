import { Star } from 'lucide-react';

const RatingDisplay = ({ 
  userRating, 
  averageRating, 
  totalRatings,
  onRateClick,
}) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* User's Rating */}
      {userRating ? (
        <div className="flex items-center bg-green-600/20 border border-green-600 rounded-lg px-3 py-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
          <div>
            <p className="text-xs text-gray-400">Your Rating</p>
            <p className="text-lg font-bold text-white">{userRating}/10</p>
          </div>
        </div>
      ) : (
        <button
          onClick={onRateClick}
          className="flex items-center bg-purple-600 hover:bg-purple-700 rounded-lg px-4 py-2 transition"
        >
          <Star className="w-5 h-5 mr-2" />
          Rate This
        </button>
      )}

      {/* Average Rating */}
      {averageRating && (
        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <div>
            <p className="text-xs text-gray-400">Average</p>
            <p className="text-sm font-semibold text-white">
              {averageRating}/10 ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;