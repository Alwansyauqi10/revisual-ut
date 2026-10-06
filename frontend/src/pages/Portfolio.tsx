import { useState } from "react";
import { Link } from "react-router";

function Portfolio() {
  const projects = [
    {
      number: "01",
      title: "UT PUSAT",
      subtitle: "Graduation Documentation",
      category: "Photography · Event Documentation",
      year: "2025",
      images: ["/portfolio-1.jpg", "/portfolio-2.jpg", "/portfolio-3.jpg"],
    },
    {
      number: "02",
      title: "UT JAKARTA",
      subtitle: "Graduation Documentation",
      category: "Photography · Event Documentation",
      year: "2025",
      images: ["/portfolio-2.jpg", "/portfolio-3.jpg", "/portfolio-1.jpg"],
    },
    {
      number: "03",
      title: "UT BOGOR",
      subtitle: "Graduation Documentation",
      category: "Photography · Event Documentation",
      year: "2025",
      images: ["/portfolio-3.jpg", "/portfolio-1.jpg", "/portfolio-2.jpg"],
    },
    {
      number: "04",
      title: "UT SERANG",
      subtitle: "Graduation Documentation",
      category: "Photography · Event Documentation",
      year: "2025",
      images: ["/portfolio-1.jpg", "/portfolio-3.jpg", "/portfolio-2.jpg"],
    },
  ];

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-revisual-primary text-revisual-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background-hero.jpg')" }}
        />

        <div className="absolute inset-0 bg-revisual-primary/70" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">
          <div className="w-full max-w-3xl pt-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-secondary/50">
              Revisual Production
            </p>
            <h1 className="font-display mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              OUR
              <br />
              WORK.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-revisual-secondary/65 sm:text-lg">
              A collection of moments, stories, and visual experiences we've
              created through our productions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-revisual-secondary text-revisual-primary">
        <div className="mx-auto max-w-6xl px-6 lg:py-16">
          <div>
            {projects.map((project, index) => (
              <PortfolioProject
                key={project.number}
                project={project}
                isLast={index === projects.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-revisual-primary text-revisual-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background-hero.jpg')" }}
        />

        <div className="absolute inset-0 bg-revisual-primary/65" />
        <div className="relative z-10 flex min-h-[500px] items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-secondary/50">
              Start A Project
            </p>
            <h2 className="font-display my-5 text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              HAVE A STORY
              <br />
              TO TELL?
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-6 text-revisual-secondary/60 sm:text-base">
              Let's create something meaningful and <br /> turn your next
              project into a story worth remembering.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex h-11 items-center gap-3 rounded-full bg-revisual-secondary px-5 text-sm font-medium text-revisual-primary transition hover:bg-revisual-secondary/90"
            >
              Get In Touch
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PortfolioProject({
  project,
  isLast,
}: {
  project: {
    number: string;
    title: string;
    subtitle: string;
    category: string;
    year: string;
    images: string[];
  };
  isLast: boolean;
}) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <article
      className={`py-12 sm:py-16 ${
        !isLast ? "border-b border-revisual-primary/10" : ""
      }`}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="lg:col-span-1">
          <span className="font-display text-sm font-medium text-revisual-primary/35">
            {project.number}
          </span>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
              {project.category}
            </p>
            <span className="hidden h-px w-8 bg-revisual-primary/20 sm:block" />
            <p className="text-xs font-medium text-revisual-primary/35">
              {project.year}
            </p>
          </div>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {project.title}
          </h2>
          <p className="mt-2 text-sm text-revisual-primary/55 sm:text-base">
            {project.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-8 lg:mt-10 lg:ml-[8.333333%]">
        <div className="overflow-hidden rounded-[2rem] bg-revisual-secondary">
          <img
            src={project.images[activeImage]}
            alt={`${project.title} - ${project.subtitle}`}
            className="aspect-[16/8] w-full object-cover transition duration-500"
          />
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {project.images.map((image, index) => (
            <button
              key={`${project.number}-${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`View ${project.title} image ${index + 1}`}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl transition sm:h-24 sm:w-36 ${
                activeImage === index
                  ? "ring-2 ring-revisual-primary"
                  : "opacity-55 hover:opacity-100"
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default Portfolio;
