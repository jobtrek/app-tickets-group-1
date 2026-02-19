import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "../src/pages/Navbar";

export const rootRoute = createRootRoute({
  component: () => (
  <> 
    <nav className="w-2xl h-2xl">
      <Navbar />
    </nav>
    <Outlet /> 
  </>
)
});