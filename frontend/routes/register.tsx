import { createFileRoute } from "@tanstack/react-router";
import RegisterForm from "../src/pages/Register";


export const Route = createFileRoute("/register")({
    component: () => <RegisterForm />,
});
