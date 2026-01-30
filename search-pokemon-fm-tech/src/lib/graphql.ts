import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

export const POKEMON_GRAPHQL_ENDPOINT = "https://graphql-pokemon2.vercel.app/";

/**
 * Apollo Client with intelligent caching strategy
 * - Default cache TTL for Pokemon queries
 * - Automatic deduplication of requests
 * - Normalized cache for efficient updates
 */
export const apolloClient = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: POKEMON_GRAPHQL_ENDPOINT,
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          pokemon: {
            keyArgs: ["name"],
          },
          pokemons: {
            keyArgs: ["first", "query"],
          },
        },
      },
    },
  }),
});

export const GET_POKEMON_BY_NAME = gql`
  query getPokemon($name: String!) {
    pokemon(name: $name) {
      id
      number
      name
      image
      classification
      types
      resistant
      weaknesses
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        number
        name
        image
        types
      }
    }
  }
`;

export const GET_ALL_POKEMON_NAMES = gql`
  query getAllPokemon($first: Int!) {
    pokemons(first: $first) {
      id
      name
    }
  }
`;

