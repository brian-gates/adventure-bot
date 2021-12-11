import { randomUUID } from "crypto";
import { Trap } from "../trap";

export function slowDustTrap(): Trap {
  return {
    id: randomUUID(),
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
    spirit: 0,
    xpValue: 1,
    monsterDamageMax: 0,
    profile: "",
    quests: {},
    xp: 0,
    statusEffects: [],
    equipment: {
      weapon: {
        name: "Slow Dust Trap",
        description: "A trap that slows the enemy",
        type: "weapon",
        accuracyDescriptors: {
          missed: [
            "You turn and cover your head, holding your breath until the dust clears.",
          ],
          hitDefinitely: ["Dust engulfs your face!"],
          hit: ["You cough as the dust settles in your lungs."],
          hitBarely: ["You try to cover your face, but dust finds its way in!"],
          missedBarely: [
            "Dust flies in your face, but you cover your mouth just in time!",
          ],
          missedDefinitely: ["You're well prepared for the dust trap."],
        },
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
        targetDefense: "ac",
        id: randomUUID(),
        goldValue: 30,
        equippable: true,
      },
    },
  };
}
