export interface RecentBook {
  _id: number;
  title: string;
  image: string;
  name: string;
}

const RECENT_KEY = 'recentBooks';

export function saveRecentBook(book: RecentBook) {
  const stored = JSON.parse(
    localStorage.getItem(RECENT_KEY) || '[]',
  ) as RecentBook[];

  const filter = stored.filter(item => item._id !== book._id);

  filter.unshift(book);

  const limit = filter.slice(0, 10);

  localStorage.setItem(RECENT_KEY, JSON.stringify(limit));
}

export function getRecentBooks(): RecentBook[] {
  return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
}
