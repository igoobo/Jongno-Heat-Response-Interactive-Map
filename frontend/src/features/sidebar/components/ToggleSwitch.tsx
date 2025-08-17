import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string; // Unique ID for the input
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only" // Hide the default checkbox visually
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`block w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        ></div>
      </div>
    </label>
  );
};