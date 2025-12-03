import { memo } from "react";
import type { LoadingSpinnerProps } from "../../types";

function LoadingSpinnerComponent({
  size = "lg",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <span
      className={`loading loading-spinner loading-${size} ${className}`.trim()}
    />
  );
}

export const LoadingSpinner = memo(LoadingSpinnerComponent);
