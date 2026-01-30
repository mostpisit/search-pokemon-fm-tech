"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchPokemon } from "@/hooks/usePokemonSearch";
import { addToSearchHistory, getSearchHistory } from "@/lib/storage";

/**
 * SearchInput Component
 *
 * Features:
 * - Reads/writes search value to URL query param (?q=)
 * - Debounced Apollo Client search with caching
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Search history from localStorage
 * - Graceful error handling
 */
export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams?.get("q") ?? "";

  const [value, setValue] = useState(initial);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Fetch suggestions via Apollo (with caching)
  const { suggestions, loading, error } = useSearchPokemon(value);

  // Sync URL with input value on initial load
  useEffect(() => {
    setValue(initial);
  }, [initial]);

  // Load search history on mount
  useEffect(() => {
    const history = getSearchHistory();
    setSearchHistory(history.map((item) => item.query));
  }, []);

  // Listen for evolution clicks (dispatched by PokemonResult) to update input and hide suggestions
  useEffect(() => {
    function onEvolution(e: any) {
      const name = e?.detail?.name ?? e?.detail;
      if (typeof name === "string") {
        setValue(name);
      }
      setShowSuggestions(false);
      setShowHistory(false);
      // blur the input so dropdown won't reopen immediately
      inputRef.current?.blur();
    }

    if (typeof window !== "undefined") {
      window.addEventListener("search:evolution", onEvolution as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("search:evolution", onEvolution as EventListener);
      }
    };
  }, []);

  // Show/hide suggestions when they update
  useEffect(() => {
    if (value.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else if (!value.trim()) {
      setShowHistory(false);
    }
  }, [suggestions, value]);

  // Debounced URL update (350ms)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const trimmed = value.trim();
      const url = trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/";

      if ((searchParams?.get("q") ?? "") !== trimmed) {
        router.push(url);
      }

      // Add to history when search is triggered
      if (trimmed) {
        addToSearchHistory(trimmed);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const displayItems = showHistory ? searchHistory : suggestions;

      if (!showSuggestions) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < displayItems.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayItems.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            const selected = displayItems[selectedIndex];
            setValue(selected);
            setShowSuggestions(false);
            setShowHistory(false);
            inputRef.current?.blur();
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowSuggestions(false);
          setShowHistory(false);
          break;
        default:
          break;
      }
    },
    [showSuggestions, selectedIndex, suggestions, searchHistory, showHistory]
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
    setShowHistory(false);
  }, []);

  const handleFocus = () => {
    if (!value.trim()) {
      setShowHistory(searchHistory.length > 0);
      setShowSuggestions(false);
    } else {
      // Show suggestions immediately if we have any
      if (suggestions.length > 0) {
        setShowSuggestions(true);
        setShowHistory(false);
      }
    }
  };

  const displayItems = useMemo(() => {
    if (showHistory) return searchHistory;
    return suggestions;
  }, [showHistory, searchHistory, suggestions]);

  return (
    <div className="relative w-full">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Search Pokémon
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={() => {
            // Hide suggestions after a short delay to allow click handlers to fire
            setTimeout(() => {
              setShowSuggestions(false);
              setShowHistory(false);
            }, 150);
          }}
          placeholder="e.g. Pikachu"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        {loading && (
          <div className="absolute right-3 top-2 text-xs text-gray-400">
            <span className="animate-pulse">Searching...</span>
          </div>
        )}
        {error && !loading && (
          <div className="absolute right-3 top-2 text-xs text-red-500">Error</div>
        )}
      </div>

      {/* Dropdown: Suggestions or History */}
      {(showHistory || (showSuggestions && displayItems.length > 0)) && (
        <ul className="absolute top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg z-10 dark:border-gray-600 dark:bg-gray-800">
          {displayItems.map((item, idx) => (
            <li
              key={`${item}-${idx}`}
              className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                idx === selectedIndex
                  ? "bg-blue-500 text-white"
                  : "text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleSuggestionClick(item)}
            >
              {showHistory ? `🕐 ${item}` : item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
