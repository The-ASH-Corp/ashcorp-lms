import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react'

const faqItems = [
  {
    question: "What are your support hours?",
    answer:
      "Our support team is available Monday through Friday, 9 AM to 6 PM EST. Weekend inquiries are responded to by Monday morning.",
  },
  {
    question: "How can I request a demo?",
    answer:
      "Visit our demo request page or email support@ashacademy.edu with your organization details. We typically respond within 24 hours.",
  },
  {
    question: "Do you offer on-site training?",
    answer:
      "Yes, we offer customized on-site training programs for enterprise clients. Contact our partnerships team for detailed pricing.",
  },
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