import { mockBulbasaur, mockCharmander, mockSquirtle } from "@/__tests__/mocks/pokemon.mock";

/**
 * Test Suite: Pokémon Type Verification
 *
 * Verifies that each Pokémon has the correct type(s) as specified
 */
describe("Pokémon Type Verification", () => {
  describe("Bulbasaur", () => {
    it("should have Grass as primary type", () => {
      expect(mockBulbasaur.types).toBeDefined();
      expect(mockBulbasaur.types).toContain("Grass");
    });

    it("should have exactly two types: Grass and Poison", () => {
      expect(mockBulbasaur.types).toEqual(expect.arrayContaining(["Grass", "Poison"]));
      expect(mockBulbasaur.types?.length).toBe(2);
    });

    it("should have correct name and classification", () => {
      expect(mockBulbasaur.name).toBe("Bulbasaur");
      expect(mockBulbasaur.classification).toBe("Seed Pokémon");
    });

    it("should have valid attacks", () => {
      expect(mockBulbasaur.attacks?.fast).toBeDefined();
      expect(mockBulbasaur.attacks?.special).toBeDefined();
      expect(mockBulbasaur.attacks?.fast?.length).toBeGreaterThan(0);
      expect(mockBulbasaur.attacks?.special?.length).toBeGreaterThan(0);
    });

    it("should have evolution to Ivysaur", () => {
      expect(mockBulbasaur.evolutions).toBeDefined();
      expect(mockBulbasaur.evolutions?.length).toBeGreaterThan(0);
      expect(mockBulbasaur.evolutions?.[0]?.name).toBe("Ivysaur");
    });
  });

  describe("Charmander", () => {
    it("should have Fire as type", () => {
      expect(mockCharmander.types).toBeDefined();
      expect(mockCharmander.types).toContain("Fire");
    });

    it("should have exactly one type: Fire", () => {
      expect(mockCharmander.types).toEqual(["Fire"]);
    });

    it("should have correct name and classification", () => {
      expect(mockCharmander.name).toBe("Charmander");
      expect(mockCharmander.classification).toBe("Lizard Pokémon");
    });

    it("should have valid attacks with Fire type", () => {
      expect(mockCharmander.attacks?.fast).toBeDefined();
      expect(mockCharmander.attacks?.special).toBeDefined();
      const hasFireAttack = mockCharmander.attacks?.special?.some((a) => a.type === "Fire");
      expect(hasFireAttack).toBe(true);
    });

    it("should have evolution to Charmeleon", () => {
      expect(mockCharmander.evolutions).toBeDefined();
      expect(mockCharmander.evolutions?.length).toBeGreaterThan(0);
      expect(mockCharmander.evolutions?.[0]?.name).toBe("Charmeleon");
    });

    it("should have weaknesses to Water, Ground, Rock", () => {
      expect(mockCharmander.weaknesses).toEqual(expect.arrayContaining(["Water", "Ground", "Rock"]));
    });
  });

  describe("Squirtle", () => {
    it("should have Water as type", () => {
      expect(mockSquirtle.types).toBeDefined();
      expect(mockSquirtle.types).toContain("Water");
    });

    it("should have exactly one type: Water", () => {
      expect(mockSquirtle.types).toEqual(["Water"]);
    });

    it("should have correct name and classification", () => {
      expect(mockSquirtle.name).toBe("Squirtle");
      expect(mockSquirtle.classification).toBe("Tiny Turtle Pokémon");
    });

    it("should have valid attacks with Water type", () => {
      expect(mockSquirtle.attacks?.fast).toBeDefined();
      expect(mockSquirtle.attacks?.special).toBeDefined();
      const hasWaterAttack = mockSquirtle.attacks?.special?.some((a) => a.type === "Water");
      expect(hasWaterAttack).toBe(true);
    });

    it("should have evolution to Wartortle", () => {
      expect(mockSquirtle.evolutions).toBeDefined();
      expect(mockSquirtle.evolutions?.length).toBeGreaterThan(0);
      expect(mockSquirtle.evolutions?.[0]?.name).toBe("Wartortle");
    });

    it("should have weaknesses to Electric and Grass", () => {
      expect(mockSquirtle.weaknesses).toEqual(expect.arrayContaining(["Electric", "Grass"]));
    });
  });

  describe("Cross-Pokémon Type Assertions", () => {
    it("should verify each starter has a unique primary type", () => {
      const types = [
        mockBulbasaur.types?.[0],
        mockCharmander.types?.[0],
        mockSquirtle.types?.[0],
      ];
      const uniqueTypes = new Set(types);
      expect(uniqueTypes.size).toBe(3); // All three should be different
    });

    it("should verify types are exactly Grass, Fire, and Water", () => {
      const primaryTypes = [
        mockBulbasaur.types?.[0],
        mockCharmander.types?.[0],
        mockSquirtle.types?.[0],
      ];
      expect(primaryTypes).toEqual(expect.arrayContaining(["Grass", "Fire", "Water"]));
    });
  });
});
