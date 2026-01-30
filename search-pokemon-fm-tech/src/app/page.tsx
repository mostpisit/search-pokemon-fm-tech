import SearchInput from "@/components/SearchInput";
import PokemonResult from "@/components/PokemonResult";

/**
 * Home Page
 *
 * Route: /
 * Query params: ?q=pokemon-name
 *
 * Features:
 * - Apollo Client caching for all queries
 * - Responsive layout optimized for mobile and desktop
 * - Dark mode support
 * - Clean separation of search and result components
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 dark:from-gray-900 dark:to-gray-800">
      <main className="mx-auto w-full max-w-4xl space-y-8 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Search Pokémon
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find detailed information about your favorite Pokémon
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8">
          <SearchInput />
          <PokemonResult />
        </div>


      </main>
    </div>
  );
}
