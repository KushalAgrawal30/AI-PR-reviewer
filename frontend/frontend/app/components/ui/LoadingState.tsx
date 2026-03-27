type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="mb-4">
        <div className="w-8 h-8 border-2 border-[#2a2a2a] border-t-white rounded-full animate-spin" />
      </div>
      <p className="text-[#8b8b8b] text-sm">{message}</p>
    </div>
  );
}
