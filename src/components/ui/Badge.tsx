import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'new' | 'popular' | 'best-value' | 'featured' | 'default'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  new: 'bg-[#0EA5E9] text-white',
  popular: 'bg-[#2563EB] text-white',
  'best-value': 'bg-[#22C55E] text-white',
  featured: 'bg-[#1E40AF] text-white',
  default: 'bg-[#64748B] text-white',
}

function getLabelVariant(label: string): BadgeVariant {
  const lower = label.toLowerCase()
  if (lower === 'new') return 'new'
  if (lower === 'popular') return 'popular'
  if (lower === 'best value') return 'best-value'
  if (lower === 'featured') return 'featured'
  return 'default'
}

export function Badge({ label, variant, className }: BadgeProps) {
  const resolvedVariant = variant ?? getLabelVariant(label)
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase',
        variantStyles[resolvedVariant],
        className
      )}
    >
      {label}
    </span>
  )
}
