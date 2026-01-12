type ToggleOption = {
  label: string;
  value: string | boolean;
};

type ToggleButtonGroupProps = {
  options: ToggleOption[];
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  ariaLabel?: string;
};

export function ToggleButtonGroup({
  options,
  value,
  onChange,
  ariaLabel,
}: ToggleButtonGroupProps) {
  return (
    <div
      className="inline-flex rounded-md shadow-sm"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 text-sm font-medium transition-colors
              ${isFirst ? 'rounded-l-md' : ''}
              ${isLast ? 'rounded-r-md' : ''}
              ${!isFirst && !isLast ? '' : ''}
              ${
                isSelected
                  ? 'bg-blue-600 text-white hover:bg-blue-700 z-10'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }
              ${!isFirst && !isSelected ? '-ml-px' : ''}
              focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
