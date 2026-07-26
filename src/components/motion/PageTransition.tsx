import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

/**
 * A deliberately short route-enter transition. Keeping this CSS-driven avoids
 * competing with Lenis and lets each route keep ownership of its GSAP work.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}
