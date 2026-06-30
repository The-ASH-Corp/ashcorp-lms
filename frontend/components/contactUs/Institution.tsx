import Image from 'next/image';
import { Button } from '../ui/button';

const Institution = () => {
  return (
    <section className="bg-secondary/40 py-20">
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-12 items-center lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Institutional Partnerships
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Empower your organization with world-class curriculum and
            pedagogical expertise. We offer bespoke educational frameworks
            designed for global schools and innovative corporations.
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                ✓
              </span>
              <span className="text-foreground">
                Customizable curriculum for grades K-12
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                ✓
              </span>
              <span className="text-foreground">
                Corporate leadership development modules
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                ✓
              </span>
              <span className="text-foreground">
                Advanced tracking and performance analytics
              </span>
            </li>
          </ul>
          <Button size="lg" className="mt-8">
            Partner with Us
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <Image
            src="/images/partnership.png"
            alt="Team meeting in modern office discussing partnership"
            width={600}
            height={450}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
  )
}

export default Institution