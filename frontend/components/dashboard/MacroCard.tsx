import React from 'react';

interface MacroCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
}

export default function MacroCard({ title, value, unit, color }: MacroCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mx-1">
      <div className={`w-8 h-1 ${color} rounded-full mb-3`} />
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-lg font-bold text-gray-900">
        {Math.round(value)}{unit}
      </p>
    </div>
  );
}
