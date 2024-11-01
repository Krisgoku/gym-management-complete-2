export function NotFound({ message = "Not Found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}