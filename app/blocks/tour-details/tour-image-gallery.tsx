import { useState } from 'react';
import { X } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/data/tours';
import styles from './tour-image-gallery.module.css';

interface Props {
  tour: Tour;
  className?: string;
}

export function TourImageGallery({ tour, className }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className={cn(styles.gallery, className)}>
        <img
          src={tour.images[activeIdx]}
          alt={tour.title}
          className={styles.mainImg}
          onClick={() => setLightbox(true)}
          loading="lazy"
        />
        <div className={styles.thumbnails}>
          {tour.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${tour.title} ${i + 1}`}
              className={cn(styles.thumb, { [styles.active]: i === activeIdx })}
              onClick={() => setActiveIdx(i)}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(false)}>
          <img src={tour.images[activeIdx]} alt={tour.title} className={styles.lightboxImg} />
          <button className={styles.lightboxClose} onClick={() => setLightbox(false)}><X size={20} /></button>
        </div>
      )}
    </>
  );
}
