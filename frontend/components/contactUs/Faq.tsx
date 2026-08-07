"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useGetContactSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";

const defaultFaqs = [
  {
    id: "faq-1",
    question: "Why should I choose ASH Academy?",
    answer:
      "ASH Academy focuses on practical, industry-relevant education through expert mentorship, hands-on training, real-world projects, and dedicated career support, helping learners become confident and job-ready professionals.",
  },
  {
    id: "faq-2",
    question: "Will I receive a certificate after completing the course?",
    answer:
      "Yes. Once you complete the course and successfully pass the final assessment, your certificate will be issued after verification.",
  },
  {
    id: "faq-3",
    question: "How can I contact support if I have an issue?",
    answer:
      "You can reach our support team anytime through the Contact Us page, and we'll get back to you promptly.",
  },
  {
    id: "faq-4",
    question: "What happens if I lose internet access mid-lesson?",
    answer:
      "You can pause and resume lessons anytime - your progress is automatically saved.",
  },
];

const Faq = () => {
  const { data: settings } = useGetContactSettingsQuery();
  const faqSettings = settings?.faqs;
  const isVisible = settings?.sectionVisibility?.faqs !== false;

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isVisible) {
    return null;
  }

  const faqItems = faqSettings?.items || defaultFaqs;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {faqSettings?.title || "Frequently Asked Questions"}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {faqSettings?.subtitle || "Quick answers to common inquiries"}
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqItems.map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full rounded-lg border border-border bg-card p-6 text-left transition-all hover:bg-secondary/50 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`size-5 text-primary transition-transform ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openFaq === index && (
                <p className="mt-4 leading-relaxed text-muted-foreground whitespace-pre-line">
                  {item.answer}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;