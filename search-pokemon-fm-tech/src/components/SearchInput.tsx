"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchPokemon } from "@/hooks/usePokemonSearch";
import { addToSearchHistory, getSearchHistory } from "@/lib/storage";

/**
 * SearchInput Component - Beautiful Redesign
 * Aesthetic: Modern glassmorphism with vibrant gradients and smooth micro-interactions
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
  const [isFocused, setIsFocused] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const isEvolutionClickRef = useRef<boolean>(false);
  const isSuggestionSelectedRef = useRef<boolean>(false);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const { suggestions, loading, error } = useSearchPokemon(value);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  useEffect(() => {
    const history = getSearchHistory();
    setSearchHistory(history.map((item) => item.query));
  }, []);

  useEffect(() => {
    function onEvolution(e: any) {
      const name = e?.detail?.name ?? e?.detail;
      if (typeof name === "string") {
        setValue(name);
        isEvolutionClickRef.current = true;
      }
      setShowSuggestions(false);
      setShowHistory(false);
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

  useEffect(() => {
    if (isEvolutionClickRef.current) {
      isEvolutionClickRef.current = false;
      setShowSuggestions(false);
      setShowHistory(false);
      return;
    }

    if (isSuggestionSelectedRef.current) {
      isSuggestionSelectedRef.current = false;
      setShowSuggestions(false);
      setShowHistory(false);
      return;
    }

    if (value.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else if (!value.trim()) {
      setShowHistory(false);
    }
  }, [suggestions, value]);

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
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const displayItems = showHistory ? searchHistory : suggestions;

      if (displayItems.length === 0) return;
      if (!showSuggestions && !showHistory) return;

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
            addToSearchHistory(selected);
            setShowSuggestions(false);
            setShowHistory(false);
            setSelectedIndex(-1);
            isSuggestionSelectedRef.current = true;
            // Navigate directly to avoid flicker
            const url = `/?q=${encodeURIComponent(selected)}`;
            router.push(url);
          } else if (value.trim()) {
            // ถ้าไม่มี selection แต่มี value ให้บันทึก history และ blur
            addToSearchHistory(value.trim());
            setShowSuggestions(false);
            setShowHistory(false);
            inputRef.current?.blur();
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowSuggestions(false);
          setShowHistory(false);
          setSelectedIndex(-1);
          break;
        default:
          break;
      }
    },
    [showSuggestions, showHistory, selectedIndex, suggestions, searchHistory]
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    addToSearchHistory(suggestion);
    setShowSuggestions(false);
    setShowHistory(false);
    setSelectedIndex(-1);
    isSuggestionSelectedRef.current = true;
    // Navigate directly to avoid double setState
    const url = `/?q=${encodeURIComponent(suggestion)}`;
    router.push(url);
  }, [router]);

  const handleFocus = () => {
    setIsFocused(true);
    setSelectedIndex(-1);
    if (!value.trim()) {
      setShowHistory(searchHistory.length > 0);
      setShowSuggestions(false);
    } else {
      if (suggestions.length > 0) {
        setShowSuggestions(true);
        setShowHistory(false);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      setShowSuggestions(false);
      setShowHistory(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleClear = useCallback(() => {
    setValue("");
    setShowSuggestions(false);
    setShowHistory(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const MAX_INPUT_LENGTH = 50;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Limit input length to prevent crashes
    if (newValue.length <= MAX_INPUT_LENGTH) {
      setValue(newValue);
      setSelectedIndex(-1);
      setShowLimitWarning(false);
    } else {
      // Show warning when limit is reached
      setShowLimitWarning(true);
      // Hide warning after 2 seconds
      setTimeout(() => setShowLimitWarning(false), 2000);
    }
  }, []);

  const displayItems = useMemo(() => {
    if (showHistory) return searchHistory;
    return suggestions;
  }, [showHistory, searchHistory, suggestions]);

  const hasContent = value.trim().length > 0;
  const showDropdown = (showHistory || (showSuggestions && displayItems.length > 0));

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dropdown-slide {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dropdown-enter {
          animation: dropdown-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .suggestion-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .suggestion-item:hover {
          transform: translateX(4px);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />

      <div className="relative">
        {/* Input container with glassmorphism */}
        <div className={`
          relative overflow-hidden rounded-2xl backdrop-blur-xl
          bg-gradient-to-br from-white/90 to-white/70
          dark:from-gray-800/90 dark:to-gray-900/70
          shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/5
          transition-all duration-500
          ${isFocused ? 'scale-[1.02] ring-2 ring-indigo-500/50' : 'border border-white/20 dark:border-gray-700/50'}
        `}>

          <div className="relative flex items-center gap-3 px-6 py-4">
            {/* Search Icon */}
            <div className={`flex-shrink-0 transition-all duration-500 ${isFocused ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-gray-400 dark:text-gray-500'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search for Pokémon..."
              maxLength={MAX_INPUT_LENGTH}
              className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              style={{ caretColor: '#6366f1' }}
            />

            {/* Status indicators */}
            <div className="flex-shrink-0 flex items-center gap-3">
              {/* Loading */}
              {loading && (
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-indigo-200 dark:border-indigo-800" />
                  <div className="absolute inset-0 w-5 h-5 rounded-full border-2 border-transparent border-t-indigo-500 dark:border-t-indigo-400 animate-spin" />
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Clear button */}
              {hasContent && !loading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-all hover:scale-110"
                >
                  <svg className="w-3 h-3 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Limit warning */}
        {showLimitWarning && (
          <div className="absolute top-full left-0 right-0 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Input ถึงขีดจำกัด ({MAX_INPUT_LENGTH} ตัวอักษร)
              </p>
            </div>
          </div>
        )}

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-3 z-50 dropdown-enter">
            <div className="overflow-hidden rounded-2xl backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-indigo-500/10">
              <ul
                ref={suggestionsRef}
                className="max-h-80 overflow-y-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                } as React.CSSProperties}
              >
                {displayItems.map((item, idx) => (
                  <li
                    key={`${item}-${idx}`}
                    onClick={() => handleSuggestionClick(item)}
                    className={`
                      suggestion-item cursor-pointer px-6 py-4
                      flex items-center gap-4
                      border-b border-gray-100 dark:border-gray-700/50 last:border-b-0
                      ${
                        idx === selectedIndex
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                          : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-white dark:hover:from-gray-700/30 dark:hover:to-gray-800/30 text-gray-900 dark:text-gray-100"
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 text-xl ${idx === selectedIndex ? '' : 'opacity-50'}`}>
                      {showHistory ? "⏱" : ""}
                    </div>

                    {/* Text */}
                    <div className="flex-1 font-medium text-base capitalize">
                      {item}
                    </div>

                    {/* Arrow */}
                    {idx === selectedIndex && (
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}