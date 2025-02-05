"use client";

interface IProps {
  loadingText: string;
}

export const LoadingSpinner = ({ loadingText }: IProps) => (
  <div className="flex flex-col items-center space-y-4">
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
    </div>
    <div className="text-sm text-gray-500">{loadingText}</div>
  </div>
);
