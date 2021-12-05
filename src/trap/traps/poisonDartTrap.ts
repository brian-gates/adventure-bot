import { randomUUID } from "crypto";
import { Trap } from "../trap";

export function poisonDartTrap(): Trap {
  return {
    active: true,
    cooldown: 0,
    weapon: {
      name: "Poison Dart Trap",
      type: "weapon",
      accuracyDescriptors: {
        nearMiss: ["Darts fly by your head"],
        onTheNose: ["A dart strikes you!"],
        veryAccurate: ["You are caught off guard as darts find their mark!"],
        wideMiss: ["You anticipate the dart trap and easily avoid it."],
      },
      onHitEffects: [
        {
          targetDefense: "body",
          statusEffect: {
            name: "Poison",
            debuff: true,
            buff: false,
            modifiers: {
              attackBonus: -2,
            },
            duration: 30 * 60000,
          },
        },
      ],
      damageMax: 6,
      targetDefense: "ac",
      id: randomUUID(),
      description: "A dart trap",
      goldValue: 30,
      equippable: true,
    },
  };
}
