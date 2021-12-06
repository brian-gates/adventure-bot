import { randomUUID } from "crypto";
import { Weapon } from "../Weapon";

export const mace = (): Weapon => ({
  id: randomUUID(),
  type: "weapon",
  targetDefense: "ac",
  name: "mace",
  description: "A sturdy and reliable means of crushing your foes.",
  modifiers: {
    damageBonus: 1,
  },
  damageMax: 4,
  goldValue: 40,
  accuracyDescriptors: {
    missed: ["<@attacker>'s mace misses <@defender>."],
    missedDefinitely: ["<@attacker>'s mace swings clumbsily at <@defender>"],
    missedBarely: [
      "<@attacker>'s mace nearly crushes <@defender>, but misses.",
    ],
    hitBarely: ["<@attacker>'s mace crushes <@defender>, though just barely!"],
    hit: ["<@attacker>'s mace crushes <@defender>"],
    hitDefinitely: ["<@attacker>'s mace crushes <@defender> true!"],
  },
  equippable: true,
  sellable: true,
  tradeable: true,
});
