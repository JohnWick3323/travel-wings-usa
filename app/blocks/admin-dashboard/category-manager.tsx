import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit2, Trash2, Check, X } from 'lucide-react';
import cn from 'classnames';
import styles from './category-manager.module.css';

interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

interface Props {
  token: string;
  className?: string;
  /** Called whenever categories change so BlogManager can refresh its list */
  onCategoriesChange?: (cats: Category[]) => void;
}

export function CategoryManager({ token, className, onCategoriesChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        onCategoriesChange?.(data.categories || []);
      }
    } catch {
      console.error('Failed to fetch categories');
    }
  }, [onCategoriesChange]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add category');
      } else {
        setNewName('');
        await fetchCategories();
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update');
      } else {
        setEditId(null);
        await fetchCategories();
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"? This won't delete blog posts in this category.`)) return;
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCategories();
    } catch {
      console.error('Delete failed');
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setError('');
  };

  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Blog Categories</h2>
        <p className={styles.subtitle}>Manage categories available when creating blog posts.</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form className={styles.addForm} onSubmit={handleAdd}>
        <input
          className={styles.addInput}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New category name (e.g. Visa Tips)"
          maxLength={60}
        />
        <button type="submit" className={styles.addBtn} disabled={saving || !newName.trim()}>
          <PlusCircle size={16} />
          Add Category
        </button>
      </form>

      <div className={styles.list}>
        {categories.length === 0 && (
          <p className={styles.empty}>No categories yet.</p>
        )}
        {categories.map(cat => (
          <div key={cat.id} className={styles.catRow}>
            {editId === cat.id ? (
              <div className={styles.editRow}>
                <input
                  className={styles.editInput}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                  maxLength={60}
                />
                <button
                  className={cn(styles.iconBtn, styles.btnSave)}
                  onClick={() => handleUpdate(cat.id)}
                  disabled={saving}
                  title="Save"
                >
                  <Check size={14} />
                </button>
                <button
                  className={cn(styles.iconBtn, styles.btnCancel)}
                  onClick={() => setEditId(null)}
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className={styles.viewRow}>
                <div className={styles.catInfo}>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catSlug}>/blog/category/{cat.slug}</span>
                </div>
                <div className={styles.catActions}>
                  <button
                    className={cn(styles.iconBtn, styles.btnEdit)}
                    onClick={() => startEdit(cat)}
                    title="Edit"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    className={cn(styles.iconBtn, styles.btnDelete)}
                    onClick={() => handleDelete(cat.id, cat.name)}
                    title="Delete"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
