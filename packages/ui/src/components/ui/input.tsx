import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input"> & {
		variant?: "default" | "plain" | "catalogRange";
	}
>(function Input({ className, type, variant = "default", ...props }, ref) {
	const semanticClassName =
		variant === "catalogRange"
			? "block w-full bg-transparent pt-0.5 text-body font-semibold normal-case text-[var(--text-primary)] outline-none focus-visible:ring-[length:var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-soft)]"
			: undefined;
	return (
		<input
			ref={ref}
			type={type}
			data-slot="input"
			className={
				variant === "plain"
					? className
					: variant === "catalogRange"
						? cn(semanticClassName, className)
					: cn(
							"h-[var(--control-height-md)] w-full min-w-0 rounded-lg border border-[var(--input)] bg-transparent px-[var(--control-padding-sm)] text-body-lg text-[var(--foreground)] outline-none transition-colors duration-200 ease-in-out placeholder:text-[var(--muted-foreground)] focus-visible:border-[var(--ring)] focus-visible:ring-[length:var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-soft)] disabled:cursor-not-allowed disabled:opacity-50 md:text-body",
							className,
						)
			}
			{...props}
		/>
	);
});
