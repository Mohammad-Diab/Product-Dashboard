export type ErrorMessageProps = {
  message?: string;
  className?: string;
};

export const ErrorMessage = ({
  message,
  className = '',
}: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <p
      className={`text-sm text-red-600 mt-1 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  );
};
