'use client';
import { useState, useRef } from 'react';
import { Phone, MessageCircle, ChevronDown, X } from 'lucide-react';
import cn from 'classnames';
import styles from './main-navigation-bar.module.css';

interface Props {
  currentPath?: string;
}

const flightLinks = [
  { label: 'Flights to Pakistan', href: '/destinations?category=air-ticketing&to=pakistan' },
  { label: 'Flights to Saudi Arabia', href: '/destinations?category=air-ticketing&to=saudi' },
  { label: 'Flights to UAE', href: '/destinations?category=air-ticketing&to=uae' },
  { label: 'Flights to India', href: '/destinations?category=air-ticketing&to=india' },
  { label: 'Flights to Europe', href: '/destinations?category=air-ticketing&to=europe' },
  { label: 'Flights to UK', href: '/destinations?category=air-ticketing&to=uk' },
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/destinations?category=umrah', label: 'Umrah Services' },
  { href: '/destinations?category=hajj', label: 'Hajj Packages' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function MainNavigationBar({ currentPath = '' }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href.split('?')[0]);
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDropdownOpen(false);
      (dropdownRef.current?.querySelector('button') as HTMLElement)?.focus();
    }
  };

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className={styles.skipLink}>Skip to main content</a>

      <nav className={styles.nav} aria-label="Main navigation">
        <a href="/" className={styles.logo}>
          <img src="/travelwing-header.png" alt="Travel Wings USA" className={styles.logoImg} />
        </a>

        <ul className={styles.menu} role="menubar">
          <li className={styles.menuItem} role="none">
            <a href="/" className={cn(styles.menuLink, { [styles.active]: isActive('/') })} role="menuitem">Home</a>
          </li>
          <li className={styles.menuItem} role="none">
            <a href="/destinations?category=umrah" className={cn(styles.menuLink, { [styles.active]: currentPath.includes('umrah') })} role="menuitem">Umrah Services</a>
          </li>
          <li className={styles.menuItem} role="none">
            <a href="/destinations?category=hajj" className={cn(styles.menuLink, { [styles.active]: currentPath.includes('hajj') })} role="menuitem">Hajj Packages</a>
          </li>
          <li
            className={cn(styles.menuItem, styles.hasDropdown)}
            ref={dropdownRef}
            role="none"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            onKeyDown={handleDropdownKeyDown}
          >
            <button
              className={styles.menuLink}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen(prev => !prev)}
              role="menuitem"
            >
              Air Ticketing <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div className={cn(styles.dropdown, { [styles.dropdownVisible]: dropdownOpen })} role="menu">
              {flightLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={styles.dropdownLink}
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </li>
          <li className={styles.menuItem} role="none">
            <a href="/destinations" className={cn(styles.menuLink, { [styles.active]: currentPath === '/destinations' })} role="menuitem">Destinations</a>
          </li>
          <li className={styles.menuItem} role="none">
            <a href="/blog" className={cn(styles.menuLink, { [styles.active]: isActive('/blog') })} role="menuitem">Blog</a>
          </li>
          <li className={styles.menuItem} role="none">
            <a href="/about" className={cn(styles.menuLink, { [styles.active]: isActive('/about') })} role="menuitem">About</a>
          </li>
          <li className={styles.menuItem} role="none">
            <a href="/contact" className={cn(styles.menuLink, { [styles.active]: isActive('/contact') })} role="menuitem">Contact</a>
          </li>
        </ul>

        <div className={styles.actions}>
          <a href="https://wa.me/14102984500?text=Hello%2C%20I%20am%20interested%20in%20a%20travel%20package.%20Please%20assist%20me." target="_blank" rel="noreferrer" className={styles.btnWhatsApp}>
            <MessageCircle size={15} aria-hidden="true" /> WhatsApp
          </a>
          <a href="tel:+14102984500" className={styles.btnCall}>
            <Phone size={15} aria-hidden="true" /> Call: +1 410-298-4500
          </a>
        </div>

        <button className={styles.hamburger} onClick={() => setDrawerOpen(true)} aria-label="Open menu" aria-expanded={drawerOpen}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={cn(styles.drawer, { [styles.open]: drawerOpen })} aria-hidden={!drawerOpen}>
        <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />
        <div className={styles.drawerPanel} role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className={styles.drawerHeader}>
            <img src="/travelwing-header.png" alt="Travel Wings USA" className={styles.drawerHeaderLogoImg} />
            <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <ul className={styles.drawerMenu}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>{label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.drawerActions}>
            <a href="https://wa.me/14102984500?text=Hello%2C%20I%20am%20interested%20in%20a%20travel%20package.%20Please%20assist%20me." target="_blank" rel="noreferrer" className={styles.btnWhatsApp}>
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
            <a href="tel:+14102984500" className={styles.btnCall}>
              <Phone size={16} aria-hidden="true" /> Call: +1 410-298-4500
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
