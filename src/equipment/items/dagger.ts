import { randomUUID } from "crypto";
import { Weapon } from "../Weapon";
import { createItem } from "./createItem";

export const dagger = (): Weapon =>
  createItem({
    id: randomUUID(),
    type: "weapon",
    targetDefense: "ac",
    name: "dagger",
    description: "A small and nimble blade. Cheap and versatile.",
    damageMax: 4,
    modifiers: {
      attackBonus: 3,
    },
    goldValue: 20,
    accuracyDescriptors: {
      missedDefinitely: ["<@attacker>'s dagger swings wide of <@defender>"],
      missed: ["<@attacker>'d dagger misses <@defender>"],
      missedBarely: ["<@attacker>'d dagger just barely misses <@defender>"],
      hitBarely: ["<@attacker>'s dagger just barely slices <@defender>"],
      hit: ["<@attacker>'s dagger stabs <@defender>"],
      hitDefinitely: ["<@attacker>'s dagger pierces <@defender> true"],
    },
    equippable: true,
    sellable: true,
    tradeable: true,
  });
