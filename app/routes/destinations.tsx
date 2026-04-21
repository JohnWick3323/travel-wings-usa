import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { Route } from './+types/destinations';
import { PageHeroBanner } from '~/blocks/destinations/page-hero-banner';
import { FilterAndSearchBar } from '~/blocks/destinations/filter-and-search-bar';
import { ToursGrid } from '~/blocks/destinations/tours-grid';
import { tours } from '~/data/tours';
import styles from './destinations.module.css';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'All Destinations & Packages - Travel Wings USA' },
    { name: 'description', content: 'Browse all travel packages including Umrah, Hajj, vacation tours, and air ticketing from Travel Wings USA.' },
  ];
}

export default function Destinations() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filtered = useMemo(() => {
    let result = [...tours];
    if (search) result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter(t => t.category === category);
    if (destination) result = result.filter(t => t.region.toLowerCase().includes(destination.toLowerCase()));
    if (duration === '3-5') result = result.filter(t => t.durationDays >= 3 && t.durationDays <= 5);
    if (duration === '6-8') result = result.filter(t => t.durationDays >= 6 && t.durationDays <= 8);
    if (duration === '9+') result = result.filter(t => t.durationDays >= 9);
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'duration-asc') result = [...result].sort((a, b) => a.durationDays - b.durationDays);
    if (sortBy === 'duration-desc') result = [...result].sort((a, b) => b.durationDays - a.durationDays);
    return result;
  }, [search, category, destination, duration, sortBy]);

  return (
    <main className={styles.page}>
      <PageHeroBanner />
      <FilterAndSearchBar
        search={search}
        category={category}
        destination={destination}
        duration={duration}
        sortBy={sortBy}
        count={filtered.length}
        onSearch={setSearch}
        onCategory={setCategory}
        onDestination={setDestination}
        onDuration={setDuration}
        onSort={setSortBy}
      />
      <div className={styles.content}>
        <ToursGrid tours={filtered} />
      </div>
    </main>
  );
}
