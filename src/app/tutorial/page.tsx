import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Footer from "@/components/Footer";
import type { TutorialTrack } from "@/types/tutorial";

export const metadata: Metadata = {
  title: "Professional Programming Tutorials | Programming Brains",
  description:
    "Explore structured programming and framework tutorials for React, Next.js, TypeScript, backend APIs, and modern engineering workflows.",
};

async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") || "http";

  if (host) return `${protocol}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000";
}

async function fetchTutorialTracks(): Promise<TutorialTrack[]> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/tutorials`, { cache: "no-store" });

  if (!response.ok) return [];
  const data = (await response.json()) as { tracks: TutorialTrack[] };
  return data.tracks || [];
}

const tracks = [
  {
    title: "Frontend Engineering",
    level: "Beginner to Advanced",
    duration: "6-8 weeks",
    description:
      "Build modern interfaces with HTML, CSS, JavaScript, TypeScript, React, and Next.js using production patterns.",
    modules: [
      "Modern HTML and semantic accessibility",
      "CSS architecture with responsive systems",
      "React fundamentals and component patterns",
      "Next.js App Router and performance tuning",
    ],
  },
  {
    title: "Backend and APIs",
    level: "Intermediate",
    duration: "5-7 weeks",
    description:
      "Design scalable backend services with Node.js, databases, authentication, and secure API design.",
    modules: [
      "REST API design and versioning",
      "Authentication, authorization, and security basics",
      "Database modeling with SQL and Prisma",
      "Testing, logging, and error handling",
    ],
  },
  {
    title: "Framework Mastery",
    level: "Intermediate to Expert",
    duration: "4-6 weeks",
    description:
      "Move beyond syntax and learn architecture decisions, deployment strategy, and maintainable code standards.",
    modules: [
      "Next.js full-stack workflows",
      "State management patterns",
      "Reusable design systems",
      "CI/CD and cloud deployment workflow",
    ],
  },
];

const stackHighlights = [
  "JavaScript and TypeScript",
  "React and Next.js",
  "Node.js and Express",
  "Prisma and PostgreSQL",
  "Git, CI/CD, and deployment",
  "Testing with Jest and Playwright",
];

export default async function TutorialPage() {
  const tutorialTracks = await fetchTutorialTracks();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full bg-white/15 border border-white/20 px-4 py-1 text-sm font-medium mb-6">
              Professional Tech Tutorials
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Learn Programming and Frameworks Like a Real Engineering Team
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Structured tutorials designed for developers who want practical skills, clean architecture, and
              production-ready projects.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/blog"
                className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition"
              >
                Browse Blog Tutorials
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border border-white/40 hover:border-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Request Custom Learning Path
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Framework Tutorial Series</h2>
            <p className="text-slate-600 max-w-3xl">
              Pick a framework path. Each tutorial opens a dedicated single page with center content and sidebar topic
              navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorialTracks.length === 0 && (
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">
                No tutorial tracks found from backend yet. Add published blog posts with categories to auto-generate
                tutorial series.
              </div>
            )}
            {tutorialTracks.map((series) => (
              <article
                key={series.slug}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-slate-900">{series.title.replace(" Tutorial", "")}</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {series.topics.length} Topics
                  </span>
                </div>
                <p className="text-slate-600 leading-7 mb-4">{series.description}</p>
                <ul className="space-y-2 text-sm text-slate-700 mb-6">
                  {series.topics.slice(0, 3).map((point) => (
                    <li key={point.id} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{point.title}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/tutorial/${series.slug}`}
                  className="inline-flex items-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 font-semibold transition"
                >
                  Open Tutorial
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Learning Tracks</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Each track combines core concepts, guided coding, and practical exercises focused on real-world output.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <article
                key={track.title}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{track.title}</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {track.level}
                  </span>
                </div>
                <p className="text-slate-600 leading-7 mb-4">{track.description}</p>
                <p className="text-sm font-medium text-slate-500 mb-4">Estimated duration: {track.duration}</p>
                <ul className="space-y-2 text-slate-700 text-sm flex-1">
                  {track.modules.map((module) => (
                    <li key={module} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{module}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What You Will Build</h2>
              <p className="text-slate-600 leading-7 mb-6">
                Instead of only theory, tutorials are project-driven. You build complete apps, API features, and
                deployment-ready workflows with clean coding standards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stackHighlights.map((item) => (
                  <div key={item} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-7 text-slate-100 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Professional Learning Flow</h3>
              <ol className="space-y-4 text-sm leading-7">
                <li>
                  <span className="text-blue-300 font-semibold">1. Foundation:</span> Learn the core concept with clear
                  explanation and practical context.
                </li>
                <li>
                  <span className="text-blue-300 font-semibold">2. Guided Build:</span> Implement with step-by-step
                  code and engineering best practices.
                </li>
                <li>
                  <span className="text-blue-300 font-semibold">3. Challenge Task:</span> Extend the feature to prove
                  understanding independently.
                </li>
                <li>
                  <span className="text-blue-300 font-semibold">4. Review and Refactor:</span> Improve readability,
                  testing, and performance.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Start Your Tutorial Journey</h2>
          <p className="text-slate-600 text-lg mb-8">
            Explore curated programming tutorials and framework deep-dives designed for serious growth.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/latest"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              View Latest Tutorials
            </Link>
            <Link
              href="/register"
              className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 px-8 py-3 rounded-lg font-semibold transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
