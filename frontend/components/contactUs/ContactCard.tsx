import { useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitInquiryMutation } from '@/lib/redux/features/contact/contactApi';

const contactCards = [
  {
    icon: MessageSquare,
    title: "Student Support",
    description:
      "Dedicated assistance for enrollment, course access, and technical inquiries.",
    email: "connect@ashacademy.ai",
    phone: "+91 9037009400",
  },
  {
    icon: Phone,
    title: "Partnership Inquiries",
    description:
      "Explore institutional collaboration and corporate training opportunities.",
    email: "hr@ashacademy.ai",
  },
];





const ContactCard = () => {
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    const [submitInquiry, { isLoading }] = useSubmitInquiryMutation();

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      try {
        const payload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        };

        const response = await submitInquiry(payload).unwrap();

        toast.success(response.message || 'Inquiry submitted successfully');

        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } catch (error: unknown) {
        const errorMessage =
          typeof error === 'object' &&
          error !== null &&
          'data' in error &&
          typeof (error as { data?: { message?: unknown } }).data?.message === 'string'
            ? (error as { data?: { message?: string } }).data?.message
            : 'Failed to submit inquiry';

        toast.error(errorMessage);
      }
    };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: Contact Cards */}
          <div className="space-y-6 lg:col-span-1">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <card.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Mail className="size-4 text-primary" />
                    <a
                      href={`mailto:${card.email}`}
                      className="hover:text-primary"
                    >
                      {card.email}
                    </a>
                  </div>
                  {card.phone && (
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Phone className="size-4 text-primary" />
                      <a
                        href={`tel:${card.phone}`}
                        className="hover:text-primary"
                      >
                        {card.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground">
                Send an Inquiry
              </h2>
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary "
                    required
                  />
                  <input
                    type="email"
                    placeholder="Work Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="student">Student Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="press">Press Inquiry</option>
                    <option value="general">General Support</option>
                  </select>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="How can we assist you today?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={6}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactCard