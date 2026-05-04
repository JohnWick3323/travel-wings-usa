import type { Route } from './+types/blog-article';
import { ArticleHeader } from '~/blocks/blog-article/article-header';
import { ArticleContentAndSidebar } from '~/blocks/blog-article/article-content-and-sidebar';
import { RelatedArticles } from '~/blocks/blog-article/related-articles';
import { blogPosts, getBlogPostById } from '~/data/blog';
import { getBlogBySlug, getAllPublishedBlogs } from '~/lib/blog.server';
import { generateSeoMeta, SITE_URL } from '~/lib/seo';
import { blogPostingSchema, breadcrumbSchema } from '~/lib/structured-data';
import styles from './blog-article.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  const { articleId } = params;
  // Try DB first, then static fallback
  const [dbPost, dbPosts] = await Promise.all([
    getBlogBySlug(articleId || ''),
    getAllPublishedBlogs(),
  ]);
  const post = dbPost || getBlogPostById(articleId || '') || null;

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
  return generateSeoMeta({
    title: `${seoTitle} - Travel Wings USA`,
    description: post.excerpt || `Read ${post.title} on Travel Wings USA blog.`,
    url: `${SITE_URL}/blog/${post.id}`,
    image: post.image ? `${SITE_URL}${post.image}` : undefined,
    type: 'article',
    publishedTime: post.date,
    author: post.author,
  });
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

  const articleSchema = blogPostingSchema(post);
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Blog', url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.id}` },
  ]);

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ArticleHeader post={post} />
      <ArticleContentAndSidebar post={post} />
      <RelatedArticles posts={related} />
    </main>
  );
}
