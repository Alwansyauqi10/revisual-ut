import { Link } from "react-router";

const blogs = [
  {
    id: "1",
    coverImage: "/portfolio-1.jpg",
    author: "Revisual Production",
    title: "Capturing Meaningful Moments",
    excerpt:
      "Every moment has a story worth remembering.",
    created: "2026-01-15",
  },
  {
    id: "2",
    coverImage: "/portfolio-2.jpg",
    author: "Revisual Production",
    title: "Behind The Production",
    excerpt:
      "A look behind the process of creating meaningful visual stories.",
    created: "2026-02-10",
  },
  {
    id: "3",
    coverImage: "/portfolio-3.jpg",
    author: "Revisual Production",
    title: "Stories Through Photography",
    excerpt:
      "How photography turns moments into memories.",
    created: "2026-03-05",
  },
];

function Blog() {
  return (
    <main className="min-h-screen bg-revisual-secondary px-6 py-16 text-revisual-primary lg:py-32">
      <div className="mx-auto max-w-7xl pt-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
            Revisual Journal
          </p>

          <h1 className="font-display mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            STORIES.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-revisual-primary/55">
            Stories, projects, and moments from Revisual Production.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.id}`}
              className="block"
            >
              <article className="overflow-hidden rounded-[2rem] bg-white">
                <div className="aspect-[16/10] bg-revisual-secondary/50">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                    {blog.author}
                  </p>

                  <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">
                    {blog.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-revisual-primary/55">
                    {blog.excerpt}
                  </p>

                  <p className="mt-6 text-xs text-revisual-primary/40">
                    {new Date(blog.created).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Blog;