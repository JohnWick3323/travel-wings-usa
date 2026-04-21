import type { Route } from './+types/blog-article';
import { useParams } from 'react-router';
import { ArticleHeader } from '~/blocks/blog-article/article-header';
import { ArticleContentAndSidebar } from '~/blocks/blog-article/article-content-and-sidebar';
import { RelatedArticles } from '~/blocks/blog-article/related-articles';
import { getBlogPostById, getRelatedPosts } from '~/data/blog';
import styles from './blog-article.module.css';

export function meta({ params }: Route.MetaArgs) {
  return [{ title: 'Blog Article - Travel Wings USA' }];
}

export default function BlogArticle() {
  const { articleId } = useParams();
  const post = getBlogPostById(articleId || '');

  if (!post) {
    return (
      <main className={styles.page}>
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <h1>Article not found</h1>
        </div>
      </main>
    );
  }

  const related = getRelatedPosts(post.id, 3);

  return (
    <main className={styles.page}>
      <ArticleHeader post={post} />
      <ArticleContentAndSidebar post={post} />
      <RelatedArticles posts={related} />
    </main>
  );
}
