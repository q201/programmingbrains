import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
                PB
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">Programming Brains</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering engineers and developers worldwide with deep architecture guides, Next.js tutorials, and production insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/tutorial" className="hover:text-blue-400 transition-colors">Tutorials</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog & Articles</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Top Categories</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link href="/category/web-development" className="hover:text-blue-400 transition-colors">Web Development</Link></li>
              <li><Link href="/category/architecture" className="hover:text-blue-400 transition-colors">Architecture</Link></li>
              <li><Link href="/category/artificial-intelligence" className="hover:text-blue-400 transition-colors">Artificial Intelligence</Link></li>
              <li><Link href="/admin/login" className="hover:text-purple-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Engineering Hub</h4>
            <p className="text-sm text-slate-400 mb-4">
              Join thousands of developers building scalable applications.
            </p>
            <div className="flex gap-3">
              <Link href="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md">
                Get Started
              </Link>
              <Link href="/login" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Programming Brains. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

