import { Phone, MessageCircle } from 'lucide-react';
import cn from 'classnames';
import type { BlogPost } from '~/lib/wordpress';
import { sanitizeHtml } from '~/lib/sanitize';
import styles from './article-content-and-sidebar.module.css';

interface Props {
  post: BlogPost;
  className?: string;
}

function isHtml(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

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
  const htmlContent = isHtml(post.content);

  return (
    <div className={cn(styles.layout, className)}>
      <article className={styles.main}>
        <div className={styles.article}>
          {htmlContent
            ? <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
            : renderPlainText(post.content)
          }
        </div>
      </article>

      <aside className={styles.sidebar}>
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
