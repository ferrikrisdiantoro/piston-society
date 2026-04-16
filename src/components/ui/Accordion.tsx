'use client'

import * as RadixAccordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AccordionItem {
  id: string
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  defaultOpen?: string
  className?: string
}

export function Accordion({ items, defaultOpen, className }: AccordionProps) {
  return (
    <RadixAccordion.Root
      type="single"
      defaultValue={defaultOpen}
      collapsible
      className={cn('space-y-3', className)}
    >
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.id}
          value={item.id}
          className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden hover:border-[#1E40AF]/30 transition-colors"
        >
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group">
              <span className="text-[#1E293B] font-semibold text-base leading-snug group-data-[state=open]:text-[#1E40AF]">
                {item.question}
              </span>
              <ChevronDown
                className="h-5 w-5 text-[#64748B] flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#2563EB]"
                aria-hidden="true"
              />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_0.2s_ease] data-[state=closed]:animate-[slideUp_0.2s_ease]">
            <div className="px-6 pb-5 text-[#64748B] text-sm leading-relaxed border-t border-[#F1F5F9] pt-4">
              {item.answer}
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  )
}
