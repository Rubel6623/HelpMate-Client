export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-pulse" />
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold text-black dark:text-white animate-pulse">Loading Workspace</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Preparing your personalized dashboard and tasks...
        </p>
      </div>
      
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
}
