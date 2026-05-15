'use client';
import { useState } from 'react';
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

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href.split('?')[0]);
  };

  return (
    <>
      <nav className={styles.nav}>
        <a href="/" className={styles.logo}>
          <img src="/travelwing-header.png" alt="Travel Wings USA" className={styles.logoImg} />
        </a>

        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <a href="/" className={cn(styles.menuLink, { [styles.active]: isActive('/') })}>Home</a>
          </li>
          <li className={styles.menuItem}>
            <a href="/destinations?category=umrah" className={cn(styles.menuLink, { [styles.active]: currentPath.includes('umrah') })}>Umrah Services</a>
          </li>
          <li className={styles.menuItem}>
            <a href="/destinations?category=hajj" className={cn(styles.menuLink, { [styles.active]: currentPath.includes('hajj') })}>Hajj Packages</a>
          </li>
          <li className={styles.menuItem}>
            <button className={styles.menuLink}>
              Air Ticketing <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div className={styles.dropdown}>
              {flightLinks.map(link => (
                <a key={link.href} href={link.href} className={styles.dropdownLink}>{link.label}</a>
              ))}
            </div>
          </li>
          <li className={styles.menuItem}>
            <a href="/destinations" className={cn(styles.menuLink, { [styles.active]: currentPath === '/destinations' })}>Destinations</a>
          </li>
          <li className={styles.menuItem}>
            <a href="/blog" className={cn(styles.menuLink, { [styles.active]: isActive('/blog') })}>Blog</a>
          </li>
          <li className={styles.menuItem}>
            <a href="/about" className={cn(styles.menuLink, { [styles.active]: isActive('/about') })}>About</a>
          </li>
          <li className={styles.menuItem}>
            <a href="/contact" className={cn(styles.menuLink, { [styles.active]: isActive('/contact') })}>Contact</a>
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

        <button className={styles.hamburger} onClick={() => setDrawerOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={cn(styles.drawer, { [styles.open]: drawerOpen })}>
        <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />
        <div className={styles.drawerPanel}>
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
