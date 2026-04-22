import { useState, useEffect, useCallback, useRef } from 'react';
import { PlusCircle, Trash2, Copy, Image, Search, Check } from 'lucide-react';
import cn from 'classnames';
import styles from './media-library.module.css';

interface MediaItem {
  id: number;
  name: string;
  url: string;
  folder: string;
  type: string;
  createdAt: string;
}

interface Props {
  token: string;
  className?: string;
}

const DEFAULT_FOLDERS = ['General', 'Blog', 'Tours', 'Destinations', 'Team', 'Banners'];

export function MediaLibrary({ token, className }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folder, setFolder] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', url: '', folder: 'General', newFolder: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [folders, setFolders] = useState<string[]>(DEFAULT_FOLDERS);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const params = folder !== 'All' ? `?folder=${encodeURIComponent(folder)}` : '';
      const res = await fetch(`/api/media${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const items: MediaItem[] = data.media || [];
        setMedia(items);
        // Derive folder list from existing items + defaults
        const fromDB = [...new Set(items.map(m => m.folder))];
        const merged = [...new Set([...DEFAULT_FOLDERS, ...fromDB])];
        setFolders(merged);
      }
    } catch {
      console.error('Failed to fetch media');
    }
  }, [token, folder]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this image from the media library?')) return;
    await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchMedia();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) return;
    setSaving(true);
    setError('');
    const targetFolder = form.newFolder.trim() || form.folder;
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name.trim() || form.url.split('/').pop() || 'image',
          url: form.url.trim(),
          folder: targetFolder,
          type: 'image',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add image');
      } else {
        setForm({ name: '', url: '', folder: 'General', newFolder: '' });
        setShowAddForm(false);
        setFolder('All');
        await fetchMedia();
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = media.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.url.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <h2 className={styles.title}>Media Library</h2>
          <span className={styles.count}>{media.length} images</span>
        </div>
        <button className={styles.addBtn} onClick={() => { setShowAddForm(v => !v); setError(''); }}>
          <PlusCircle size={16} />
          Add Image URL
        </button>
      </div>

      {showAddForm && (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <h3 className={styles.addFormTitle}>Add Image to Library</h3>
          {error && <div className={styles.errorBanner}>{error}</div>}
          <div className={styles.addFormGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Image URL <span className={styles.req}>*</span></label>
              <input
                ref={urlInputRef}
                className={styles.input}
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://images.unsplash.com/photo-... or your CDN URL"
                required
                autoFocus
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Name / Label</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Makkah Hero Banner"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Folder</label>
              <select
                className={styles.select}
                value={form.folder}
                onChange={e => setForm(f => ({ ...f, folder: e.target.value }))}
              >
                {folders.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Or create new folder</label>
              <input
                className={styles.input}
                value={form.newFolder}
                onChange={e => setForm(f => ({ ...f, newFolder: e.target.value }))}
                placeholder="e.g. Umrah Gallery"
              />
            </div>
          </div>
          {form.url && (
            <div className={styles.previewWrap}>
              <img
                src={form.url}
                alt="preview"
                className={styles.previewImg}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
          <div className={styles.addFormActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={saving || !form.url.trim()}>
              {saving ? 'Saving...' : 'Save to Library'}
            </button>
          </div>
        </form>
      )}

      <div className={styles.controls}>
        <div className={styles.folderTabs}>
          {['All', ...folders].map(f => (
            <button
              key={f}
              className={cn(styles.folderTab, folder === f && styles.folderTabActive)}
              onClick={() => setFolder(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search images..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <Image size={40} className={styles.emptyIcon} />
          <p className={styles.emptyText}>
            {media.length === 0
              ? 'No images yet. Add your first image URL above.'
              : 'No images match your search.'}
          </p>
          <p className={styles.emptyHint}>Tip: Use Unsplash, Pexels, or paste any hosted image URL.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(item => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imgWrap}>
                <img
                  src={item.url}
                  alt={item.name}
                  className={styles.img}
                  onError={e => {
                    const t = e.target as HTMLImageElement;
                    t.src = 'https://placehold.co/200x150/e2e8f0/64748b?text=No+Preview';
                  }}
                />
                <div className={styles.imgOverlay}>
                  <button
                    className={cn(styles.overlayBtn, copiedId === item.id && styles.overlayBtnCopied)}
                    onClick={() => copyUrl(item)}
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy URL</>}
                  </button>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.imgName} title={item.name}>{item.name}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.folderBadge}>{item.folder}</span>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
