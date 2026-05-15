import { Search } from 'lucide-react';
import cn from 'classnames';
import styles from './filter-and-search-bar.module.css';

interface Props {
  className?: string;
  search: string;
  category: string;
  destination: string;
  duration: string;
  sortBy: string;
  count: number;
  onSearch: (v: string) => void;
  onCategory: (v: string) => void;
  onDestination: (v: string) => void;
  onDuration: (v: string) => void;
  onSort: (v: string) => void;
}

export function FilterAndSearchBar({ className, search, category, destination, duration, sortBy, count, onSearch, onCategory, onDestination, onDuration, onSort }: Props) {
  return (
    <div className={cn(styles.bar, className)}>
      <div className={styles.filterRow}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search packages..." value={search} onChange={e => onSearch(e.target.value)} />
        </div>
        <select className={styles.select} value={category} onChange={e => onCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="umrah">Umrah</option>
          <option value="hajj">Hajj</option>
          <option value="vacation">Vacation Tours</option>
          <option value="air-ticketing">Air Ticketing</option>
          <option value="cruise">Cruise</option>
        </select>
        <select className={styles.select} value={destination} onChange={e => onDestination(e.target.value)}>
          <option value="">All Destinations</option>
          <option value="Iraq">Iraq</option>
          <option value="Malaysia">Malaysia</option>
          <option value="France">Paris / France</option>
          <option value="UK">United Kingdom</option>
          <option value="UAE">UAE / Dubai</option>
          <option value="Saudi Arabia">Saudi Arabia</option>
          <option value="Singapore">Singapore</option>
          <option value="Turkey">Turkey</option>
          <option value="Switzerland">Switzerland</option>
        </select>
        <select className={styles.select} value={duration} onChange={e => onDuration(e.target.value)}>
          <option value="">All Durations</option>
          <option value="3-5">3-5 Days</option>
          <option value="6-8">6-8 Days</option>
          <option value="9+">9+ Days</option>
        </select>
        <select className={styles.select} value={sortBy} onChange={e => onSort(e.target.value)}>
          <option value="default">Sort By</option>
          <option value="rating">Top Rated</option>
          <option value="duration-asc">Shortest First</option>
          <option value="duration-desc">Longest First</option>
        </select>
      </div>
      <p className={styles.resultsCount}>{count} package{count !== 1 ? 's' : ''} found</p>
    </div>
  );
}
