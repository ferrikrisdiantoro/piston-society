import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          rows={props.rows ?? 4}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-[#1E293B] text-sm resize-y',
            'placeholder:text-[#94A3B8] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent',
            error
              ? 'border-[#EF4444] bg-[#FEF2F2]'
              : 'border-[#CBD5E1] hover:border-[#94A3B8]',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#F1F5F9]',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
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

Textarea.displayName = 'Textarea'
