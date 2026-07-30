import Image from "next/image";

const About = () => {
  return (
    <section id="about" className="bg-secondary py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <Image
            src="/images/campus.png"
            alt="Modern Ash Academy library overlooking the city skyline"
            width={720}
            height={560}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Built for Learners, <span className="text-primary">Not Just Learning</span>
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            ASH Academy LMS started with a simple observation, most online
            courses are built for content, not for people. We set out to change
            that designing a platform where every course is crafted with care,
            every lesson respects your time and every learner has the freedom
            to move at their own pace.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            What began as a small idea has grown into a platform trusted by
            learners worldwide. Today, we offer lifetime access to expertly
            designed courses that turn curiosity into real, career-ready skills
            because we believe education should adapt to your life, not the
            other way around.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
