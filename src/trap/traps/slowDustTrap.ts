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
