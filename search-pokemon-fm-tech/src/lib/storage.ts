/**
 * localStorage utilities for search history and offline support
 */

const SEARCH_HISTORY_KEY = "pokemon_search_history";
const SEARCH_CACHE_KEY = "pokemon_search_cache";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

/**
 * Get search history from localStorage
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Add query to search history (max 10 items)
 */
export function addToSearchHistory(query: string) {
  if (typeof window === "undefined") return;
  try {
    const history = getSearchHistory();
    const filtered = history.filter((item) => item.query.toLowerCase() !== query.toLowerCase());
    const updated = [
      { query, timestamp: Date.now() },
      ...filtered.slice(0, 9),
    ];
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Cache search results with expiry
 */
export function cacheSearchResults(query: string, results: string[]) {
  if (typeof window === "undefined") return;
  try {
    const cache = getSearchCache();
    cache[query] = {
      results,
      timestamp: Date.now(),
    };
    localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Get cached search results if not expired
 */
export function getCachedSearchResults(query: string): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const cache = getSearchCache();
    const cached = cache[query];
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_EXPIRY_MS) {
      delete cache[query];
      localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(cache));
      return null;
    }

    return cached.results;
  } catch {
    return null;
  }
}

/**
 * Clear all caches
 */
export function clearSearchCache() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    localStorage.removeItem(SEARCH_CACHE_KEY);
  } catch {
    // Silently fail
  }
}

// Helper
function getSearchCache(): Record<string, { results: string[]; timestamp: number }> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(SEARCH_CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}
