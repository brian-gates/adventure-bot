import { randomUUID } from "crypto";
import { Weapon } from "../Weapon";
import { createItem } from "./createItem";

export const longsword = (): Weapon =>
  createItem({
    id: randomUUID(),
    type: "weapon",
    targetDefense: "ac",
    name: "longsword",
    description: "A classic for a reason. Purpose built and effective.",
    damageMax: 8,
    goldValue: 40,
    accuracyDescriptors: {
      missedDefinitely: ["<@attacker>'s longsword swings wide at <@defender>"],
      missedBarely: [
        "<@attacker>'s longsword nearly slashes <@defender>, but misses",
      ],
      missed: ["<@attacker>'s longsword misses <@defender>"],
      hitBarely: ["<@attacker>'s longsword barely catches <@defender>"],
      hit: ["<@attacker>'s longsword hits <@defender>"],
      hitDefinitely: ["<@attacker>'s longsword cuts <@defender> true!"],
    },
    equippable: true,
    sellable: true,
    tradeable: true,
  });
