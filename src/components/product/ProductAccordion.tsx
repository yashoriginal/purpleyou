'use client';

import { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

interface AccordionItem {
  title: string;
  content: string;
}

export default function ProductAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-0 border-t border-[#e6e0da]">
      {items.map((item, index) => (
        <div key={index} className="border-b border-[#e6e0da]">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-4 text-left hover:text-[#5540b7] transition-colors"
          >
            <h3 className="font-medium text-[#111111]">{item.title}</h3>
            <HiOutlineChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="pb-4 text-sm text-[#6b6b6b] font-light leading-relaxed">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
