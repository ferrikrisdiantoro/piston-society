import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold text-[#1E293B]"
          >
            {label}
            {props.required && (
              <span className="text-[#EF4444] ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-3 pr-10 rounded-xl border bg-white text-[#1E293B] text-sm appearance-none',
              'transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent',
              error
                ? 'border-[#EF4444] bg-[#FEF2F2]'
                : 'border-[#CBD5E1] hover:border-[#94A3B8]',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#F1F5F9]',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p className="text-xs text-[#EF4444]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#64748B]">{hint}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
