import { randomUUID } from "crypto";
import { Weapon } from "../Weapon";
import { createItem } from "./createItem";

export const warAxe = (): Weapon =>
  createItem({
    id: randomUUID(),
    type: "weapon",
    targetDefense: "ac",
    name: "war axe",
    description: "an axe made for war",
    damageMax: 6,
    modifiers: {
      maxHP: 2,
    },
    goldValue: 30,
    accuracyDescriptors: {
      missed: ["<@attacker>'s war axe slashes at <@defender> but misses"],
      missedDefinitely: [
        "<@attacker>'s war axe slashes in the approximate direction of <@defender>",
      ],
      missedBarely: [
        "<@attacker>'d war axe nearly cuts <@defender>, though just barely!",
      ],
      hit: ["<@attacker>'s war axe cuts <@defender>"],
      hitBarely: ["<@attacker>'s war axe chops <@defender>"],
      hitDefinitely: ["<@attacker>'s war axe cleaves <@defender> through!"],
    },
    equippable: true,
    sellable: true,
    tradeable: true,
  });
