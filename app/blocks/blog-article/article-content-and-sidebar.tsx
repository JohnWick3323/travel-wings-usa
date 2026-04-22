import { Link } from 'react-router';
import { Phone, MessageCircle } from 'lucide-react';
import cn from 'classnames';
import type { BlogPost } from '~/data/blog';
import { getTourById } from '~/data/tours';
import styles from './article-content-and-sidebar.module.css';

interface Props {
  post: BlogPost;
  className?: string;
}

/** Check if content looks like HTML */
function isHtml(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

/** Render plain-text markdown-lite as JSX */
function renderPlainText(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <ul key={i}><li>{line.slice(2)}</li></ul>;
    if (line.trim()) return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
    return null;
  });
}

export function ArticleContentAndSidebar({ post, className }: Props) {
  const relatedTours = post.relatedTourIds.map(id => getTourById(id)).filter(Boolean);
  const htmlContent = isHtml(post.content);

  return (
    <div className={cn(styles.layout, className)}>
      <main className={styles.main}>
        <div className={styles.article}>
          {htmlContent
            ? <div dangerouslySetInnerHTML={{ __html: post.content }} />
            : renderPlainText(post.content)
          }
        </div>
      </main>

      <aside className={styles.sidebar}>
        {relatedTours.length > 0 && (
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Related Packages</h3>
            {relatedTours.map(tour => tour && (
              <Link key={tour.id} to={`/tour/${tour.id}`} className={styles.relatedTour}>
                <img src={tour.image} alt={tour.title} className={styles.relatedTourImg} loading="lazy" />
                <h4 className={styles.relatedTourTitle}>{tour.title}</h4>
                <span className={styles.quoteBtn}>Get Quote</span>
              </Link>
            ))}
          </div>
        )}

        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>Need Help?</h3>
          <div className={styles.helpBox}>
            <p className={styles.helpDesc}>Our travel experts are ready to help you plan the perfect trip.</p>
            <a href="tel:+14102984500" className={`${styles.helpBtn} ${styles.helpBtnCall}`}><Phone size={14} /> +1 410-298-4500</a>
            <a href="https://wa.me/14102984500?text=Hello%2C%20I%20am%20interested%20in%20a%20travel%20package.%20Please%20assist%20me." target="_blank" rel="noreferrer" className={`${styles.helpBtn} ${styles.helpBtnWa}`}><MessageCircle size={14} /> WhatsApp</a>
          </div>
        </div>
      </aside>
    </div>
  );
}
