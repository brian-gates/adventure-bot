import { randomUUID } from "crypto";
import { Trap } from "../trap";

export function slowDustTrap(): Trap {
  return {
    active: true,
    cooldown: 0,
    weapon: {
      name: "Slow Dust Trap",
      type: "weapon",
      accuracyDescriptors: {
        nearMiss: [
          "Dust flies in your face, but you cover your mouth in time!",
        ],
        onTheNose: ["You try to cover your face, but dust finds its way in!"],
        veryAccurate: ["Dust enshrouds your face!"],
        wideMiss: ["You're well prepared for the dust trap."],
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
