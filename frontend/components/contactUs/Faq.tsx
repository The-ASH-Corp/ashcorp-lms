import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react'

const faqItems = [
  {
    question: "Why should I choose ASH Academy?",
    answer:
      "ASH Academy focuses on practical, industry-relevant education through expert mentorship, hands-on training, real-world projects, and dedicated career support, helping learners become confident and job-ready professionals.",
  },
  {
    question: "Will I receive a certificate after completing the course?",
    answer:
      "Yes. Once you complete the course and successfully pass the final assessment, your certificate will be issued after verification.",
  },
  {
    question: "How can I contact support if I have an issue?",
    answer:
      "You can reach our support team anytime through the Contact Us page, and we'll get back to you promptly.",
  },
  {
    question: "What happens if I lose internet access mid-lesson?",
    answer:
      "You can pause and resume lessons anytime - your progress is automatically saved.",
  }
];

const Faq = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Quick answers to common inquiries
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full rounded-lg border border-border bg-card p-6 text-left transition-all hover:bg-secondary/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`size-5 text-primary transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                />
              </div>
              {openFaq === index && (
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq