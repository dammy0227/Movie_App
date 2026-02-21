const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
      <p className="text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-500 hover:text-red-400 underline"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;