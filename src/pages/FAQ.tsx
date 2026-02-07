import  { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";

// 1. Define the shape of your FAQ data
interface FAQItem {
  question: string;
  answer: string;
}

// 2. Move static data outside the component to keep logic clean
// Ideally, this should be in your i18n JSON files, but this works for code-based content.
const FAQ_DATA: FAQItem[] =   [
    {
      question: "Does Next-Commerce charge a commission on each order?",
      answer: "No, we do not charge any commission on your orders, this is the case and will always be the case.",
    },
    {
      question: "How do Next-Commerce subscriptions work?",
      answer: "With Next-Commerce plans, you can set your own subscription price, so you only pay for what you need...",
    },
    {
      question: "What happens if I receive new orders after my subscription expires?",
      answer: "Unlike other platforms... we'll keep them on your behalf for two days...",
    },
    {
      question: "What payment methods are available to pay for my subscription?",
      answer: "Currently, you can pay for your subscription via CCP, BaridiMob or Wise account.",
    },
    {
      question: "Do I need coding or design skills to create my store on Next-Commerce?",
      answer: "No, you don't need to. In fact, Next-Commerce was designed for just that purpose...",
    },
  ]


const FAQ: React.FC = () => {
  // Fixed typo: "constanst" -> "constants" (Ensure this matches your file name)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Robust language detection (handles 'ar', 'ar-EG', etc.)
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <PageContainer
    title={"FrequentlyAsked "}
    about={"Questions"}
    >

      <div className="w-full">
        {FAQ_DATA.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border my-2 border-gray-200 rounded-xl shadow-sm bg-white py-2 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                className="w-full flex justify-between items-center px-4 py-3 text-neutral-800 font-medium hover:scale-[1.01] transition-colors text-start"
                // 'text-start' ensures alignment works for both RTL and LTR
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div 
                id={`faq-answer-${index}`}
                className="px-4 pb-4 text-sm text-gray-600 animate-in slide-in-from-top-2 duration-200"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
               </PageContainer>
  );
};

export default FAQ;