/**
 * Test GraphQL queries for debugging
 */

const POKEMON_GRAPHQL_ENDPOINT = "https://graphql-pokemon2.vercel.app/";

// Test if the search query works
async function testSearchQuery() {
  const query = `
    query searchPokemon($query: String!) {
      pokemons(first: 8, query: $query) {
        edges {
          node {
            name
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(POKEMON_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { query: "pika" },
      }),
    });

    const data = await response.json();
    console.log("Search query response:", data);
    return data;
  } catch (error) {
    console.error("Search query error:", error);
  }
}

// Test basic pokemon query
async function testPokemonQuery() {
  const query = `
    query getPokemon($name: String!) {
      pokemon(name: $name) {
        name
        image
      }
    }
  `;

  try {
    const response = await fetch(POKEMON_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { name: "Pikachu" },
      }),
    });

    const data = await response.json();
    console.log("Pokemon query response:", data);
    return data;
  } catch (error) {
    console.error("Pokemon query error:", error);
  }
}

// Run tests if this is loaded in browser console
if (typeof window !== "undefined") {
  (window as any).testSearchQuery = testSearchQuery;
  (window as any).testPokemonQuery = testPokemonQuery;
}
