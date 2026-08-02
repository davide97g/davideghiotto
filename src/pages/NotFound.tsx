import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HoloButton } from "@/components/ui/holo-button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="grain relative flex min-h-screen items-center justify-center bg-background px-6">
      <div className="not-found-enter max-w-md text-center">
        <span className="hud text-primary">Signal lost</span>
        <h1 className="display-xl mt-5">404</h1>
        <p className="mt-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <HoloButton asChild variant="primary" size="lg" className="btn-hud text-xs font-medium mt-9">
          <a href="/">Return to Home</a>
        </HoloButton>
      </div>
    </div>
  );
};

export default NotFound;
