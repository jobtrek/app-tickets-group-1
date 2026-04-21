import { CircleAlertIcon, CircleCheckBig } from "lucide-react";
import type { ReactNode } from "react";
import React from "react";

type AlertVariant = "success" | "error";

interface AlertProps {
	variant: AlertVariant;
	message: string | null | undefined;
	className?: string;
}

interface AlertErrorBoundaryProps {
	fallbackMessage?: string;
	children: ReactNode;
}

interface AlertErrorBoundaryState {
	hasError: boolean;
	errorMessage: string;
}

const variantClasses: Record<AlertVariant, string> = {
	success: "bg-green-100 border border-green-200 text-green-800",
	error: "bg-red-100 border border-red-200 text-red-800",
};

export function Alert({ variant, message, className = "" }: AlertProps) {
	if (!message) return null;
	return (
		<div
			role={variant === "error" ? "alert" : "status"}
			aria-live={variant === "error" ? "assertive" : "polite"}
			className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium ${variantClasses[variant]} ${className}`}
		>
			{variant === "success" ? (
				<CircleCheckBig color="#22c55e" />
			) : (
				<CircleAlertIcon color="#ef4444" />
			)}{" "}
			<span>{message}</span>
		</div>
	);
}

export class AlertErrorBoundary extends React.Component<
	AlertErrorBoundaryProps,
	AlertErrorBoundaryState
> {
	constructor(props: AlertErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, errorMessage: "" };
	}

	static getDerivedStateFromError(error: Error): AlertErrorBoundaryState {
		return {
			hasError: true,
			errorMessage: error.message || "Une erreur inattendue est survenue.",
		};
	}

	override componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error("[AlertErrorBoundary]", error, info);
	}

	override render() {
		if (this.state.hasError) {
			return (
				<Alert
					variant="error"
					message={this.props.fallbackMessage ?? this.state.errorMessage}
				/>
			);
		}
		return this.props.children;
	}
}
