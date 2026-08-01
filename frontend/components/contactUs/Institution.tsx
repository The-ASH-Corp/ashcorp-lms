const Institution = () => {
  return (
    <section className="bg-secondary py-20">
      <div className="w-full px-0">
        <div className="overflow-hidden border-y border-border shadow-sm">
          {/* <div>
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
          </div> */}
          {/* <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <Image
              src="/images/partnership.png"
              alt="Team meeting in modern office discussing partnership"
              width={600}
              height={450}
              className="h-full w-full object-cover"
            />
          </div> */}

          <iframe
            title="Ashcorp location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d712.5535472308395!2d75.94660271623343!3d10.953023494019337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b35545b7a371%3A0x59efa33ed27234a7!2sAshcorp%20Technology-%20Digital%20Marketing%2C%20Software%20Development%2C%20Flutter%20%2C%20MERN%20Stack%20Development%20in%20Tirur!5e1!3m2!1sen!2sin!4v1785563688272!5m2!1sen!2sin"
            className="block h-[62vh] min-h-80 w-full sm:h-[68vh] lg:h-[74vh]"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Institution;
