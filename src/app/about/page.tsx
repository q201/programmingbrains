import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Us | Programming Brains',
  description: 'Learn about Programming Brains - your trusted partner in web development education. Discover our mission, team, and commitment to quality learning.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 bg-grid-pattern">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            💡 Our Story & Mission
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight">
            About Programming Brains
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Empowering developers worldwide with cutting-edge knowledge, practical tutorials, and system architecture insights to accelerate your engineering career.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Core Purpose</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1 mb-4">Our Core Mission</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              To democratize technical education by delivering production-grade content that bridges the gap between basic syntax and real-world software architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Accelerated Growth</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Structured learning paths designed to help you absorb framework concepts rapidly with practical, production-ready examples.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-purple-600/10 border border-purple-600/20 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Excellence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Expert-reviewed tutorials and system architecture deep-dives following industry best practices and security standards.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-pink-600/10 border border-pink-600/20 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Developer Community</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Built by engineers for engineers. Join thousands of active developers exploring code walkthroughs and tech discussions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-100/70 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold uppercase tracking-wider text-xs">Behind The Scenes</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1 mb-4">Meet Our Editorial Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our team of experienced software engineers, system architects, and technical authors are passionate about sharing knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Lead Architect",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                bio: "Full-stack engineer with 8+ years of experience building microservices with React & Next.js."
              },
              {
                name: "Michael Chen",
                role: "Senior Tech Author",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                bio: "Technical writer and developer advocate specializing in AI tooling and web performance."
              },
              {
                name: "Emily Rodriguez",
                role: "Design Lead",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                bio: "UI/UX engineer focused on modern design systems, accessibility, and smooth micro-interactions."
              },
              {
                name: "David Kim",
                role: "DevOps & Cloud Lead",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                bio: "Infrastructure & CI/CD specialist ensuring high-availability database and deployment pipelines."
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-full mx-auto mb-4 object-cover ring-4 ring-blue-500/20"
                />
                <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold text-xs mb-3">{member.role}</p>
                <p className="text-slate-600 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Level Up Your Skills?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Start your learning journey with Programming Brains tutorials and engineering guides today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/tutorial"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
            >
              Browse Tutorials
            </Link>
            <Link
              href="/blog"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
            >
              Explore Blog Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

