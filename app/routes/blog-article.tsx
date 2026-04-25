import type { Route } from './+types/blog-article';
import { ArticleHeader } from '~/blocks/blog-article/article-header';
import { ArticleContentAndSidebar } from '~/blocks/blog-article/article-content-and-sidebar';
import { RelatedArticles } from '~/blocks/blog-article/related-articles';
import { blogPosts, getBlogPostById, getRelatedPosts } from '~/data/blog';
import { getBlogBySlug, getAllPublishedBlogs } from '~/lib/blog.server';
import styles from './blog-article.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  const { articleId } = params;
  // Try DB first, then static fallback
  const dbPost = getBlogBySlug(articleId || '');
  const post = dbPost || getBlogPostById(articleId || '') || null;

  const dbPosts = getAllPublishedBlogs();
  const staticIds = new Set(blogPosts.map(p => p.id));
  const dbOnly = dbPosts.filter(p => !staticIds.has(p.id));
  const allPosts = [...dbOnly, ...blogPosts];
  const related = allPosts.filter(p => p.id !== (post?.id || '')).slice(0, 3);

  return { post, related };
}

export function meta({ data }: Route.MetaArgs) {
  const post = data?.post;
  if (!post) return [{ title: 'Article Not Found - Travel Wings USA' }];
  const seoTitle = post._seoTitle || post.title;
  return [
    { title: `${seoTitle} - Travel Wings USA` },
    { name: 'description', content: post.excerpt || '' },
  ];
}

export default function BlogArticle({ loaderData }: Route.ComponentProps) {
  const { post, related } = loaderData;

  if (!post) {
    return (
      <main className={styles.page}>
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <h1>Article not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <ArticleHeader post={post} />
      <ArticleContentAndSidebar post={post} />
      <RelatedArticles posts={related} />
    </main>
  );
}
