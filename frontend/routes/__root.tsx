import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "../src/pages/Navbar";

export const rootRoute = createRootRoute({
  component: () => (
  <> 
    <nav>
      <Navbar />
    </nav>
    <Outlet /> 
  </>
)
});