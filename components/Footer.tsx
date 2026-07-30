import Link from 'next/link';
import { BrandMark } from './Header';

const COLUMNS = [
  {
    heading: 'Learn',
    links: [
      { label: 'Formula library', href: '/formulas/' },
      { label: 'Function A–Z', href: '/formulas/' },
      { label: 'Guides', href: '/learn/' },
      { label: 'Blog', href: '/blog/' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Free templates', href: '/templates/' },
      { label: 'Practice files', href: '/templates/' },
      { label: 'Dashboards', href: '/templates/' },
      { label: 'YouTube channel', href: '/' },
    ],
  },
  {
    heading: 'Explore Excel',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Privacy', href: '/privacy/' },
      { label: 'Terms', href: '/terms/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="foot">
      <div className="shell foot-in">
        <div>
          <Link className="brand" href="/">
            <BrandMark />
            <span className="brand-txt" style={{ color: '#fff' }}>
              Explore<b style={{ color: 'var(--em-300)' }}>Excel</b>
            </span>
          </Link>
          <p className="foot-tag">Explore. Learn. Automate.</p>
        </div>

        {COLUMNS.map((col) => (
          <div className="foot-col" key={col.heading}>
            <h4>{col.heading}</h4>
            {col.links.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="shell foot-btm">
        © {new Date().getFullYear()} Explore Excel. Not affiliated with Microsoft.
      </div>
    </footer>
  );
}
