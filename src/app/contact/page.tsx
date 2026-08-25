import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us | Programming Brains',
  description: 'Get in touch with Programming Brains. Send us your questions, feedback, or collaboration ideas.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 bg-grid-pattern">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            💬 Get In Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight">
            Contact Engineering Team
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Have a question, feedback, or partnership proposal? We&apos;d love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:shadow-lg transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Direct Email</h3>
              <p className="text-slate-600 text-sm mb-3">Send us an email and our team responds within 24 hours</p>
              <a href="mailto:hello@programmingbrains.com" className="text-blue-600 font-semibold hover:underline text-sm">
                hello@programmingbrains.com
              </a>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:shadow-lg transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-purple-600/10 border border-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Operating Hours</h3>
              <p className="text-slate-600 text-sm mb-3">Engineering & Support availability</p>
              <div className="text-slate-800 text-xs font-semibold space-y-1">
                <p>Mon - Fri: 9:00 AM - 6:00 PM EST</p>
                <p>Sat: 10:00 AM - 4:00 PM EST</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:shadow-lg transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-pink-600/10 border border-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Global Community</h3>
              <p className="text-slate-600 text-sm mb-3">Join developer channels & discussions</p>
              <div className="flex justify-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md">Discord</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-md">GitHub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-slate-100/70 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Send us a Message</h2>
            <p className="text-slate-600 text-base">
              Fill out the form below and an engineer will get back to you promptly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-md">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-base">
              Quick answers to common questions about our tutorials and articles.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How do I get started with Programming Brains tutorials?",
                answer: "Browse our Tutorials section and pick a learning track. Each guide includes production-ready code examples and step-by-step walkthroughs."
              },
              {
                question: "Are the tutorials and articles free to read?",
                answer: "Yes! All published guides, blog articles, and core framework tracks are 100% free to access."
              },
              {
                question: "Can I contribute an article or guest post?",
                answer: "We welcome developer contributions! Contact our editorial team or login to submit draft posts for review."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Looking for Instant Answers?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Explore our structured framework tutorials or technical blog publications.</p>
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
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

