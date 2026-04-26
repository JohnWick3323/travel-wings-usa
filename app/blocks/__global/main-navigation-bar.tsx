import { useState } from 'react';
import { NavLink, Link } from 'react-router';
import { Phone, MessageCircle, ChevronDown, X } from 'lucide-react';
import cn from 'classnames';
import styles from './main-navigation-bar.module.css';
import logoHeader from '/logo-header.png';

interface Props {
  className?: string;
}

const flightLinks = [
  { label: 'Flights to Pakistan', href: '/destinations?category=air-ticketing&to=pakistan' },
  { label: 'Flights to Saudi Arabia', href: '/destinations?category=air-ticketing&to=saudi' },
  { label: 'Flights to UAE', href: '/destinations?category=air-ticketing&to=uae' },
  { label: 'Flights to India', href: '/destinations?category=air-ticketing&to=india' },
  { label: 'Flights to Europe', href: '/destinations?category=air-ticketing&to=europe' },
  { label: 'Flights to UK', href: '/destinations?category=air-ticketing&to=uk' },
];

export function MainNavigationBar({ className }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className={cn(styles.nav, className)}>
        <Link to="/" className={styles.logo}>
          <img src={logoHeader} alt="Travel Wings USA" className={styles.logoImg} />
        </Link>

        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <NavLink to="/" end className={({ isActive }) => cn(styles.menuLink, { [styles.active]: isActive })}>Home</NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/destinations?category=umrah" className={({ isActive }) => cn(styles.menuLink, { [styles.active]: isActive })}>Umrah Services</NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/destinations?category=hajj" className={({ isActive }) => cn(styles.menuLink, { [styles.active]: isActive })}>Hajj Packages</NavLink>
          </li>
          <li className={styles.menuItem}>
            <button className={styles.menuLink}>
              Air Ticketing <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div className={styles.dropdown}>
              {flightLinks.map(link => (
                <Link key={link.href} to={link.href} className={styles.dropdownLink}>{link.label}</Link>
              ))}
            </div>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/destinations" className={({ isActive }) => cn(styles.menuLink, { [styles.active]: isActive })}>Destinations</NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/blog" className={({ isActive }) => cn(styles.menuLink, { [styles.active]: isActive })}>Blog</NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/about" className={({ isActive }) => cn(styles.menuLink, { [styles.active]: isActive })}>About</NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/contact" className={({ isActive }) => cn(styles.menuLink, { [styles.active]: isActive })}>Contact</NavLink>
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
            <img src={logoHeader} alt="Travel Wings USA" className={styles.drawerHeaderLogoImg} />
            <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <ul className={styles.drawerMenu}>
            {[['/', 'Home'], ['/destinations?category=umrah', 'Umrah Services'], ['/destinations?category=hajj', 'Hajj Packages'], ['/destinations', 'Destinations'], ['/blog', 'Blog'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
              <li key={href}>
                <Link to={href} className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>{label}</Link>
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
