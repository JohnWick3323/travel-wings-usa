import { useState, useEffect, useCallback } from 'react';
import { Save, Info } from 'lucide-react';
import cn from 'classnames';
import styles from './seo-settings.module.css';

interface Settings {
  site_name: string;
  site_tagline: string;
  meta_description: string;
  og_image: string;
  gtm_id: string;
  ga4_id: string;
  custom_head_code: string;
  custom_body_code: string;
  footer_text: string;
}

const EMPTY: Settings = {
  site_name: '',
  site_tagline: '',
  meta_description: '',
  og_image: '',
  gtm_id: '',
  ga4_id: '',
  custom_head_code: '',
  custom_body_code: '',
  footer_text: '',
};

interface Props {
  token: string;
  className?: string;
}

export function SeoSettings({ token, className }: Props) {
  const [settings, setSettings] = useState<Settings>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch {
      console.error('Failed to load settings');
    }
  }, [token]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const set = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [key]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save settings');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>SEO & Tracking Settings</h2>
        <p className={styles.subtitle}>Global SEO, Google Analytics, Tag Manager, and custom code injection.</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* General SEO */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>🔍 General SEO</h3>
        <div className={styles.grid2}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Site Name</label>
            <input className={styles.input} value={settings.site_name} onChange={set('site_name')} placeholder="Travel Wings USA" />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Site Tagline</label>
            <input className={styles.input} value={settings.site_tagline} onChange={set('site_tagline')} placeholder="Your Trusted Travel Partner" />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Default Meta Description</label>
          <textarea
            className={cn(styles.input, styles.textarea)}
            rows={3}
            value={settings.meta_description}
            onChange={set('meta_description')}
            placeholder="Brief description of your site for search engines (150–160 chars recommended)"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Default OG / Social Share Image URL</label>
          <input
            className={styles.input}
            value={settings.og_image}
            onChange={set('og_image')}
            placeholder="https://yoursite.com/og-image.jpg (1200×630px recommended)"
          />
          {settings.og_image && (
            <img src={settings.og_image} alt="OG preview" className={styles.ogPreview} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
        </div>
      </section>

      {/* Tracking */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📊 Google Analytics & Tag Manager</h3>
        <div className={styles.infoBox}>
          <Info size={14} />
          <span>Enter your IDs below — the tracking code is automatically injected into the site &lt;head&gt;. You do not need to add it manually.</span>
        </div>
        <div className={styles.grid2}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Google Tag Manager ID</label>
            <input
              className={styles.input}
              value={settings.gtm_id}
              onChange={set('gtm_id')}
              placeholder="GTM-XXXXXXX"
            />
            <span className={styles.hint}>Find in GTM → Admin → Container Settings</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Google Analytics 4 Measurement ID</label>
            <input
              className={styles.input}
              value={settings.ga4_id}
              onChange={set('ga4_id')}
              placeholder="G-XXXXXXXXXX"
            />
            <span className={styles.hint}>Find in GA4 → Admin → Data Streams → your site</span>
          </div>
        </div>
        <div className={styles.infoBox}>
          <Info size={14} />
          <span><strong>Best practice:</strong> Use GTM ID <em>or</em> GA4 ID — not both. If using GTM, add GA4 as a tag inside GTM instead.</span>
        </div>
      </section>

      {/* Custom Code */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>🧩 Custom Code Injection</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Custom &lt;head&gt; Code</label>
          <textarea
            className={cn(styles.input, styles.codeArea)}
            rows={6}
            value={settings.custom_head_code}
            onChange={set('custom_head_code')}
            placeholder={`<!-- e.g. Facebook Pixel, Hotjar, custom meta tags -->\n<script>\n  // your code here\n</script>`}
            spellCheck={false}
          />
          <span className={styles.hint}>Injected inside &lt;head&gt; before &lt;/head&gt;. Use for meta tags, pixels, fonts.</span>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Custom &lt;body&gt; Code</label>
          <textarea
            className={cn(styles.input, styles.codeArea)}
            rows={6}
            value={settings.custom_body_code}
            onChange={set('custom_body_code')}
            placeholder={`<!-- e.g. GTM noscript fallback, chat widgets -->\n<noscript>...</noscript>`}
            spellCheck={false}
          />
          <span className={styles.hint}>Injected at the start of &lt;body&gt;. Use for GTM noscript, chat widgets.</span>
        </div>
      </section>

      {/* Other */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>✏️ Site Content</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Footer Copyright Text</label>
          <input
            className={styles.input}
            value={settings.footer_text}
            onChange={set('footer_text')}
            placeholder={`© ${new Date().getFullYear()} Travel Wings USA. All rights reserved.`}
          />
        </div>
      </section>

      <div className={styles.saveBar}>
        {saved && <span className={styles.savedMsg}>✅ Settings saved successfully!</span>}
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
