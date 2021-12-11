import { randomUUID } from "crypto";
import { Trap } from "../trap";

export function poisonDartTrap(): Trap {
  return {
    id: randomUUID(),
    name: "Poison Dart Trap",
    isTrap: true,
    ac: 10,
    mind: 0,
    body: 0,
    spirit: 0,
    hp: 10,
    attackBonus: 0,
    damageBonus: 0,
    damageMax: 6,
    maxHP: 10,
    monsterDamageMax: 0,
    inventory: [],
    gold: 0,
    profile: "",
    cooldowns: {},
    quests: {},
    xp: 0,
    xpValue: 1,
    equipment: {
      weapon: {
        name: "Poison Dart Trap",
        type: "weapon",
        accuracyDescriptors: {
          hit: ["Poisonous darts strike you!"],
          missed: ["Some darts fly past you as you dodge out of the way."],
          missedBarely: ["You feel darts graze you, but none pierce flesh."],
          hitBarely: ["A dart strikes you!"],
          hitDefinitely: [
            "You are caught off guard and are pelted with darts!",
          ],
          missedDefinitely: [
            "You anticipate the dart trap and easily avoid it!",
          ],
        },
        onHitEffects: [
          {
            name: "Poison",
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
        description: "A dart trap",
        goldValue: 30,
        equippable: true,
      },
    },
    isMonster: true,
  };
}
