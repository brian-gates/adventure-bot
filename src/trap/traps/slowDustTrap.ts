import { randomUUID } from "crypto";
import { createItem } from "../../equipment/items/createItem";
import { Trap } from "../trap";
import { createTrap } from "./createTrap";

export function slowDustTrap(): Trap {
  return createTrap({
    name: "Slow Dust Trap",
    ac: 10,
    attackBonus: 0,
    body: 0,
    mind: 0,
    cooldowns: {},
    damageBonus: 0,
    damageMax: 6,
    gold: 0,
    hp: 10,
    maxHP: 10,
    isTrap: true,
    inventory: [],
    isMonster: true,
    xpValue: 1,
    monsterDamageMax: 0,
    profile: "",
    quests: {},
    xp: 0,
    statusEffects: [],
    equipment: {
      weapon: slowDustTrapWeapon().id,
    },
  });
}
function slowDustTrapWeapon() {
  return createItem({
    name: "Slow Dust",
    description: "A trap that slows the enemy",
    type: "weapon",
    accuracyDescriptors: {
      missedDefinitely: ["You're well prepared for the dust trap."],
      missed: [
        "You turn and cover your head, holding your breath until the dust clears.",
      ],
      missedBarely: [
        "Dust flies in your face, but you cover your mouth just in time!",
      ],
      hitBarely: ["You try to cover your face, but dust finds its way in!"],
      hit: ["You cough as the dust settles in your lungs."],
      hitDefinitely: ["Dust engulfs your face!"],
    },
    // TODO: make this work
    onHitEffects: [
      {
        name: "Slow Dust",
        debuff: true,
        buff: false,
        modifiers: {
          attackBonus: -2,
        },
        duration: 30 * 60000,
      },
    ],
    damageMax: 6,
    targetDefense: "body",
    id: randomUUID(),
    goldValue: 30,
    equippable: true,
  });
}
