import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="grain relative flex min-h-screen items-center justify-center bg-background px-6">
      <div className="not-found-enter max-w-md text-center">
        <span className="hud hud-accent">Signal lost</span>
        <h1 className="display-xl mt-5">404</h1>
        <p className="mt-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="btn-primary mt-9">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
