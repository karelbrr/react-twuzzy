interface ErrorProps {
  error?: string;
}

export function Error({ error }: ErrorProps) {
  return (
    <div className="border border-red-700 mt-2 p-3 text-red-700 rounded-lg">
      <h4>Error</h4>
      <p>{error}</p>
    </div>
  );
}
