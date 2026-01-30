import { useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_POKEMON_NAMES, GET_POKEMON_BY_NAME } from "@/lib/graphql";
import type { Pokemon } from "@/types/pokemon";

/**
 * Hook to search Pokemon by query string
 * Features:
 * - Apollo caching for previous searches
 * - Automatic deduplication of requests
 * - Error handling
 */
export function useSearchPokemon(query: string) {
  // Fetch all names once and cache in Apollo. Filter client-side to avoid unsupported server args.
  const { data, loading, error } = useQuery(GET_ALL_POKEMON_NAMES, {
    variables: { first: 151 },
    skip: false,
    fetchPolicy: "cache-first",
  });

  // Debug logs
  useEffect(() => {
    if (query && query.trim().length > 0) {
      console.log(`[useSearchPokemon] Searching for: "${query}", Loading: ${loading}`);
    }
  }, [query, loading]);

  useEffect(() => {
    if (error) console.error("[useSearchPokemon] Error fetching names:", error.message || error);
  }, [error]);

  const allNames: string[] = useMemo(() => {
    return data?.pokemons?.map((p: any) => p?.name).filter(Boolean) ?? [];
  }, [data]);

  const suggestions = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return allNames.filter((n) => n.toLowerCase().startsWith(q)).slice(0, 8);
  }, [allNames, query]);

  return { suggestions, loading, error };
}

/**
 * Hook to fetch full Pokemon details
 * Features:
 * - Apollo normalized cache prevents refetch for same Pokemon
 * - Instant results from cache if previously loaded
 * - Proper error and loading states
 */
export function usePokemonDetails(name: string) {
  const { data, loading, error } = useQuery(GET_POKEMON_BY_NAME, {
    variables: { name },
    skip: !name || name.trim().length === 0,
    // Use cached result if available, update in background
    fetchPolicy: "cache-and-network",
  });

  const pokemon = data?.pokemon ?? null;

  return {
    pokemon: pokemon as Pokemon | null,
    loading,
    error,
  };
}
