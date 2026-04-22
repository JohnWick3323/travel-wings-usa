import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import cn from 'classnames';
import styles from './blog-manager.module.css';

export interface BlogRow {
  id: number;
  title: string;
  slug: string;
  seoTitle: string | null;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  category: string;
  author: string;
  tags: string; // JSON string
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  seoTitle: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: 'General',
  author: 'Travel Wings Team',
  tags: '',
  status: 'draft' as 'draft' | 'published',
  publishedAt: '',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Props {
  token: string;
  className?: string;
}

export function BlogManager({ token, className }: Props) {
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<BlogRow | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugManual, setSlugManual] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch('/api/blogs?all=1', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch {
      console.error('Failed to fetch blogs');
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      console.error('Failed to fetch categories');
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [fetchBlogs, fetchCategories]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setSlugManual(false);
    setError('');
    setView('form');
  };

  const openEdit = (blog: BlogRow) => {
    setEditing(blog);
    const parsedTags = (() => {
      try { return JSON.parse(blog.tags).join(', '); } catch { return ''; }
    })();
    setForm({
      title: blog.title,
      slug: blog.slug,
      seoTitle: blog.seoTitle || '',
      excerpt: blog.excerpt || '',
      content: blog.content,
      featuredImage: blog.featuredImage || '',
      category: blog.category,
      author: blog.author,
      tags: parsedTags,
      status: blog.status,
      publishedAt: blog.publishedAt || '',
    });
    setSlugManual(true);
    setError('');
    setView('form');
  };

  const handleTitleChange = (val: string) => {
    setForm(f => ({
      ...f,
      title: val,
      slug: slugManual ? f.slug : slugify(val),
    }));
  };

  const handleSlugChange = (val: string) => {
    setSlugManual(true);
    setForm(f => ({ ...f, slug: slugify(val) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const tagsArr = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      tags: tagsArr,
      seoTitle: form.seoTitle || null,
      excerpt: form.excerpt || null,
      featuredImage: form.featuredImage || null,
      publishedAt: form.publishedAt || null,
    };

    try {
      let res: Response;
      if (editing) {
        res = await fetch(`/api/blogs/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        await fetchBlogs();
        setView('list');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async (id: number) => {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBlogs();
  };

  const toggleStatus = async (blog: BlogRow) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    await fetch(`/api/blogs/${blog.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchBlogs();
  };

  const filtered = blogs.filter(b => {
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && b.status !== statusFilter) return false;
    return true;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (view === 'form') {
    return (
      <div className={cn(styles.wrap, className)}>
        <div className={styles.formHeader}>
          <button className={styles.backBtn} onClick={() => setView('list')}>
            ← Back to Blog List
          </button>
          <h2 className={styles.formTitle}>{editing ? 'Edit Blog Post' : 'New Blog Post'}</h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.formGrid}>
            {/* LEFT COLUMN */}
            <div className={styles.formMain}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="e.g. Top 10 Things to Do in Makkah"
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Permalink (Slug) <span className={styles.req}>*</span></label>
                <div className={styles.slugWrap}>
                  <span className={styles.slugPrefix}>/blog/</span>
                  <input
                    className={cn(styles.input, styles.slugInput)}
                    value={form.slug}
                    onChange={e => handleSlugChange(e.target.value)}
                    placeholder="auto-generated-from-title"
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>SEO Title</label>
                <input
                  className={styles.input}
                  value={form.seoTitle}
                  onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))}
                  placeholder="Optimized title for search engines (defaults to Title if empty)"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Excerpt / Meta Description</label>
                <textarea
                  className={cn(styles.input, styles.textarea)}
                  rows={3}
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Short summary shown in blog list and search results (150-160 chars recommended)"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Content <span className={styles.req}>*</span></label>
                <textarea
                  className={cn(styles.input, styles.contentArea)}
                  rows={20}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write your blog content here. HTML tags are supported (e.g. <h2>, <p>, <strong>, <ul>, <li>)"
                  required
                />
                <p className={styles.hint}>HTML is supported. Use &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;, etc.</p>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className={styles.formSidebar}>
              <div className={styles.sideCard}>
                <h3 className={styles.sideCardTitle}>Publish</h3>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Status</label>
                  <select
                    className={styles.select}
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Published Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={form.publishedAt ? form.publishedAt.slice(0, 10) : ''}
                    onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Leave blank to use today&apos;s date.</span>
                </div>
                <button type="submit" className={styles.publishBtn} disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Post' : 'Publish Post'}
                </button>
              </div>

              <div className={styles.sideCard}>
                <h3 className={styles.sideCardTitle}>Featured Image</h3>
                <div className={styles.fieldGroup}>
                  <input
                    className={styles.input}
                    value={form.featuredImage}
                    onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {form.featuredImage && (
                    <img
                      src={form.featuredImage}
                      alt="preview"
                      className={styles.imgPreview}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <p className={styles.hint}>Paste image URL (Unsplash, Pexels, or your own CDN)</p>
                </div>
              </div>

              <div className={styles.sideCard}>
                <h3 className={styles.sideCardTitle}>Categorisation</h3>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {(categories.length > 0 ? categories : [{ id: 0, name: 'General', slug: 'general' }]).map(c => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tags</label>
                  <input
                    className={styles.input}
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="umrah, travel, saudi (comma separated)"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Author</label>
                  <input
                    className={styles.input}
                    value={form.author}
                    onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.listHeader}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search posts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button className={styles.newBtn} onClick={openNew}>
          <PlusCircle size={16} />
          New Post
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  {blogs.length === 0
                    ? 'No blog posts yet. Click "New Post" to create your first one.'
                    : 'No posts match your search.'}
                </td>
              </tr>
            )}
            {filtered.map(blog => (
              <tr key={blog.id} className={styles.row}>
                <td>
                  <div className={styles.titleCell}>
                    {blog.featuredImage && (
                      <img src={blog.featuredImage} alt="" className={styles.thumb} />
                    )}
                    <div>
                      <p className={styles.postTitle}>{blog.title}</p>
                      <p className={styles.postSlug}>/blog/{blog.slug}</p>
                    </div>
                  </div>
                </td>
                <td><span className={styles.catBadge}>{blog.category}</span></td>
                <td className={styles.authorCell}>{blog.author}</td>
                <td>
                  <span className={cn(styles.statusBadge, blog.status === 'published' ? styles.badgePublished : styles.badgeDraft)}>
                    {blog.status}
                  </span>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDate(blog.createdAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={cn(styles.actionBtn, styles.btnEdit)}
                      onClick={() => openEdit(blog)}
                      title="Edit"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      className={cn(styles.actionBtn, blog.status === 'published' ? styles.btnDraft : styles.btnPublish)}
                      onClick={() => toggleStatus(blog)}
                      title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {blog.status === 'published' ? <><EyeOff size={13} /> Unpublish</> : <><Eye size={13} /> Publish</>}
                    </button>
                    <button
                      className={cn(styles.actionBtn, styles.btnDelete)}
                      onClick={() => deleteBlog(blog.id)}
                      title="Delete"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
