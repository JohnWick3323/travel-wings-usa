import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import cn from 'classnames';
import styles from './footer-main-content.module.css';
import logoFooter from '/logo-footer.webp';

interface Props {
  className?: string;
}

export function FooterMainContent({ className }: Props) {
  return (
    <footer className={cn(styles.footer, className)}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <div className={styles.logoImgWrap}>
            <img src={logoFooter} alt="Travel Wings USA" className={styles.logoImg} />
          </div>
          <p className={styles.description}>
            Your trusted travel partner for Umrah packages, Hajj packages, international air ticketing, and curated vacation tours. Serving the community from Gwynn Oak, Maryland.
          </p>
          <div className={styles.social}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook"><span style={{ fontSize: 13, fontWeight: 700 }}>f</span></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram"><span style={{ fontSize: 11, fontWeight: 700 }}>in</span></a>
            <a href="https://google.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Google"><span style={{ fontSize: 13, fontWeight: 700 }}>G</span></a>
          </div>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Quick Links</h3>
          <ul className={styles.links}>
            {[['/', 'Home'], ['/about', 'About Us'], ['/destinations', 'Destinations'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([href, label]) => (
              <li key={href}><Link to={href} className={styles.footerLink}><ChevronRight size={12} /> {label}</Link></li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Services</h3>
          <ul className={styles.links}>
            {[
              ['/destinations?category=umrah', 'Umrah Services'],
              ['/destinations?category=hajj', 'Hajj Packages'],
              ['/destinations?category=air-ticketing', 'Air Ticketing'],
              ['/destinations?category=vacation', 'Vacation Tours'],
              ['/destinations?category=air-ticketing&to=pakistan', 'Flight to Pakistan'],
              ['/destinations?category=air-ticketing&to=uk', 'Flight to UK'],
            ].map(([href, label]) => (
              <li key={href}><Link to={href} className={styles.footerLink}><ChevronRight size={12} /> {label}</Link></li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Contact Us</h3>
          <div className={styles.contactItem}>
            <MapPin size={16} className={styles.contactIcon} />
            <span>1724 Woodlawn Dr Suite 12,<br />Gwynn Oak, MD 21207</span>
          </div>
          <div className={styles.contactItem}>
            <Phone size={16} className={styles.contactIcon} />
            <div>
              <a href="tel:+14102984500" className={styles.contactLink}>+1 410-298-4500</a><br />
              <span>Fax: 410-298-5500</span>
            </div>
          </div>
          <div className={styles.contactItem}>
            <Mail size={16} className={styles.contactIcon} />
            <a href="mailto:info@travelwingsusa.com" className={styles.contactLink}>info@travelwingsusa.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
