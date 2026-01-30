import type { Pokemon } from "@/types/pokemon";

/**
 * Mock Pokémon data for testing
 */

export const mockBulbasaur: Pokemon = {
  id: "UG9rZW1vbjowMDE=",
  number: "001",
  name: "Bulbasaur",
  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  classification: "Seed Pokémon",
  types: ["Grass", "Poison"],
  resistant: ["Water", "Electric", "Grass"],
  weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
  weight: {
    minimum: "6.04kg",
    maximum: "7.76kg",
  },
  height: {
    minimum: "0.71m",
    maximum: "0.91m",
  },
  attacks: {
    fast: [
      { name: "Razor Leaf", type: "Grass", damage: 13 },
      { name: "Vine Whip", type: "Grass", damage: 7 },
    ],
    special: [
      { name: "Power Whip", type: "Grass", damage: 80 },
      { name: "Sludge Bomb", type: "Poison", damage: 80 },
    ],
  },
  evolutions: [
    {
      id: "UG9rZW1vbjowMDI=",
      number: "002",
      name: "Ivysaur",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
      types: ["Grass", "Poison"],
    },
  ],
};

export const mockCharmander: Pokemon = {
  id: "UG9rZW1vbjowMDQ=",
  number: "004",
  name: "Charmander",
  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
  classification: "Lizard Pokémon",
  types: ["Fire"],
  resistant: ["Bug", "Steel", "Fairy", "Grass", "Ice", "Flying", "Psychic"],
  weaknesses: ["Water", "Ground", "Rock"],
  weight: {
    minimum: "7.34kg",
    maximum: "9.46kg",
  },
  height: {
    minimum: "0.51m",
    maximum: "0.65m",
  },
  attacks: {
    fast: [
      { name: "Scratch", type: "Normal", damage: 6 },
      { name: "Ember", type: "Fire", damage: 10 },
    ],
    special: [
      { name: "Flame Charge", type: "Fire", damage: 50 },
      { name: "Flame Burst", type: "Fire", damage: 70 },
    ],
  },
  evolutions: [
    {
      id: "UG9rZW1vbjowMDU=",
      number: "005",
      name: "Charmeleon",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png",
      types: ["Fire"],
    },
  ],
};

export const mockSquirtle: Pokemon = {
  id: "UG9rZW1vbjowMDc=",
  number: "007",
  name: "Squirtle",
  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
  classification: "Tiny Turtle Pokémon",
  types: ["Water"],
  resistant: ["Steel", "Fire", "Water", "Ice"],
  weaknesses: ["Electric", "Grass"],
  weight: {
    minimum: "7.34kg",
    maximum: "9.46kg",
  },
  height: {
    minimum: "0.43m",
    maximum: "0.55m",
  },
  attacks: {
    fast: [
      { name: "Tackle", type: "Normal", damage: 5 },
      { name: "Water Gun", type: "Water", damage: 6 },
    ],
    special: [
      { name: "Aqua Jet", type: "Water", damage: 45 },
      { name: "Hydro Pump", type: "Water", damage: 130 },
    ],
  },
  evolutions: [
    {
      id: "UG9rZW1vbjowMDg=",
      number: "008",
      name: "Wartortle",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png",
      types: ["Water"],
    },
  ],
};
