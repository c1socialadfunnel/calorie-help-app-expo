import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: string;
}

export default function ProgressBar({
  progress,
  color = 'bg-blue-600',
  backgroundColor = 'bg-gray-200',
  height = 'h-2',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${backgroundColor} rounded-full ${height} overflow-hidden`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
