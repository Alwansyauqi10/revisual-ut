import { Link, useParams } from "react-router";

function BlogDetail() {
  const { id } = useParams();

  // Temporary dummy data.
  // Nanti bagian ini diganti dengan data dari API.
  const blog = {
    id,
    title: "Behind the Scenes of Capturing Graduation Moments",
    excerpt:
      "A look behind the scenes of how Revisual Production captures meaningful graduation moments.",
    author: "Revisual Production",
    created: "2026-09-27",
    coverImage: "/portfolio-1.jpg",
    content: `Every graduation carries a different story.

At Revisual Production, we believe photography is not only about taking pictures. It is about preserving the atmosphere, emotions, and memories behind every important moment.

Our team works closely with the event and participants to make sure every important moment is captured naturally and professionally.`,
  };

  return (
    <main className="min-h-screen bg-revisual-secondary text-revisual-primary">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        {/* Header */}
        <header className="mt-12 max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-revisual-primary/40">
            Revisual Journal
          </p>

          <h1 className="font-display mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-revisual-primary/55 sm:text-lg">
            {blog.excerpt}
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-revisual-primary/45">
            <span>{blog.author}</span>

            <span>•</span>

            <span>
              {new Date(blog.created).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="mt-14 overflow-hidden rounded-[2rem]">
          <div className="aspect-[16/9] bg-revisual-secondary/50">
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-sm uppercase tracking-[0.25em] text-revisual-primary/25">
                  Revisual Production
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <article className="mx-auto mt-14 mb-14 max-w-5xl">
          <div className="whitespace-pre-line text-base leading-8 text-revisual-primary/75 sm:text-lg sm:leading-9">
            {blog.content}
          </div>
        </article>

        {/* Back */}
        <Link
          to="/blog"
          className="text-sm mt-14 text-revisual-primary/50 transition hover:text-revisual-primary"
        >
          ← Back to Journal
        </Link>
      </div>
    </main>
  );
}

export default BlogDetail;
