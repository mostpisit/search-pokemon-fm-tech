"use client";

import React, { useCallback, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePokemonDetails } from "@/hooks/usePokemonSearch";

/**
 * PokemonResult Component
 *
 * Features:
 * - Apollo Client caching for instant results on re-render
 * - Memoized for performance (only re-renders on actual data change)
 * - Error and loading states
 * - Clickable evolutions that update search query
 * - Dark mode support
 */
const PokemonResult = memo(function PokemonResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams?.get("q") ?? "";

  const { pokemon, loading, error } = usePokemonDetails(q);

  const handleEvolutionClick = useCallback(
    (evolutionName: string) => {
      // Notify SearchInput to update/hide suggestions and blur
      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("search:evolution", { detail: { name: evolutionName } })
          );
        }
      } catch (e) {
        console.error("Failed to dispatch evolution event:", e);
      }

      router.push(`/?q=${encodeURIComponent(evolutionName)}`);
    },
    [router]
  );

  // Empty state: no search query
  if (!q) {
    return (
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        Enter a Pokémon name to search.
      </div>
    );
  }

  // Loading state
  if (loading && !pokemon) {
    return (
      <div className="mt-6 animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-md dark:bg-gray-700" />
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4" />
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <strong>Error:</strong> Failed to load Pokémon details. Please try again.
      </div>
    );
  }

  // Not found state
  if (!pokemon) {
    return (
      <div className="mt-6 rounded-md bg-amber-50 p-4 text-sm font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        No Pokémon found for "{q}". Try a different name.
      </div>
    );
  }

  return (
    <div className="mt-6 w-full rounded-md border border-gray-200 p-6 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header with image and basic info */}
      <div className="flex gap-6 mb-6">
        {pokemon.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="h-32 w-32 rounded-lg object-cover shadow-md"
            loading="lazy"
          />
        )}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {pokemon.name}
            {pokemon.number && (
              <span className="ml-2 text-xl font-normal text-gray-500 dark:text-gray-400">
                #{pokemon.number}
              </span>
            )}
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{pokemon.classification}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {pokemon.types?.map((type) => (
              <span
                key={type}
                className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
              >
                {type}
              </span>
            ))}
          </div>

          {pokemon.weight || pokemon.height ? (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {pokemon.height && (
                <p>
                  <strong>Height:</strong> {pokemon.height.minimum} - {pokemon.height.maximum}
                </p>
              )}
              {pokemon.weight && (
                <p>
                  <strong>Weight:</strong> {pokemon.weight.minimum} - {pokemon.weight.maximum}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Attributes */}
      {(pokemon.resistant || pokemon.weaknesses) && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {pokemon.resistant && pokemon.resistant.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-400">Resistant to</h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {pokemon.resistant.join(", ")}
              </p>
            </div>
          )}
          {pokemon.weaknesses && pokemon.weaknesses.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400">Weak to</h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {pokemon.weaknesses.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Attacks and Evolutions Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attacks Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Attacks</h3>
          <div className="space-y-4">
            {pokemon.attacks?.fast && pokemon.attacks.fast.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Fast Attacks</h4>
                <ul className="mt-2 space-y-1">
                  {pokemon.attacks.fast.map((a) => (
                    <li key={a.name} className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{a.name}</span>
                      {a.type && <span className="ml-2 text-xs text-gray-500">({a.type})</span>}
                      {a.damage && <span className="ml-2 font-semibold text-orange-600 dark:text-orange-400">{a.damage} DMG</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pokemon.attacks?.special && pokemon.attacks.special.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Attacks</h4>
                <ul className="mt-2 space-y-1">
                  {pokemon.attacks.special.map((a) => (
                    <li key={a.name} className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{a.name}</span>
                      {a.type && <span className="ml-2 text-xs text-gray-500">({a.type})</span>}
                      {a.damage && <span className="ml-2 font-semibold text-orange-600 dark:text-orange-400">{a.damage} DMG</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!pokemon.attacks?.fast && !pokemon.attacks?.special && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No attacks available</p>
            )}
          </div>
        </div>

        {/* Evolutions Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Evolutions</h3>
          {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
            <div className="space-y-3">
              {pokemon.evolutions.map((evo) => (
                <button
                  key={evo.id ?? evo.name}
                  onClick={() => handleEvolutionClick(evo.name ?? "")}
                  className="block w-full text-left rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20"
                >
                  <span className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    {evo.name}
                  </span>
                  {evo.types && (
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {evo.types.join(", ")}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No evolutions</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default PokemonResult;
