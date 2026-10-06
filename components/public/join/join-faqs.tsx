"use client"

import { useState } from "react"

interface FaqItem {
  question: string
  answer: string
}

export function JoinFaqs({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div
            key={item.question}
            className={`rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isOpen
                ? "border-primary/20 bg-surface-2 dark:border-accent-orange/30 dark:bg-[#1A1A1F]"
                : "border-primary/10 bg-white dark:border-white/10 dark:bg-[#121214]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-body text-sm font-semibold text-primary dark:text-white">{item.question}</span>
              <span
                className={`text-xl leading-none text-accent-orange transition-transform duration-300 ease-out ${isOpen ? "rotate-45" : "rotate-0"}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`pt-3 font-body text-sm leading-6 text-muted transition-all duration-300 ease-out dark:text-gray-300 ${
                    isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
