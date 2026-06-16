import Link from 'next/link';
import { Music } from 'lucide-react';

const footerLinks = {
  Product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'API', href: '/api' },
    { name: 'Changelog', href: '/changelog' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  Social: [
    { name: 'Twitter', href: 'https://twitter.com/melodyai' },
    { name: 'Discord', href: 'https://discord.gg/melodyai' },
    { name: 'GitHub', href: 'https://github.com/melodyai' },
    { name: 'YouTube', href: 'https://youtube.com/@melodyai' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black border-t border-purple-500/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Music className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold text-gradient">Melody AI</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Transform your words into professional songs with cutting-edge AI technology.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Melody AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm">
              Terms
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
