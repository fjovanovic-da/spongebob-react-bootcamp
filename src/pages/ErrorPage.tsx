import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  let title = "Oops!";
  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    // Handle route errors (404, etc.)
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you're looking for doesn't exist in Bikini Bottom.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || "An unexpected error occurred.";
    }
  } else if (error instanceof Error) {
    // Handle JavaScript errors
    message = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-error mb-4">{title}</h1>
        <p className="text-xl text-base-content mb-8">{message}</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn btn-outline"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
