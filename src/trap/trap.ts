import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { sleep } from "../utils";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { awardXP } from "../character/awardXP";
import { trapRollText } from "./trapRollText";
import { xpGainField } from "../character/xpGainField";
import { hpBarField } from "../character/hpBar/hpBarField";
import { Weapon } from "../equipment/equipment";
import { TrapResult } from "./TrapResult";
import { d20 } from "../utils/dice";
import { getCharacterById } from "../store/selectors";
import store from "../store";
import { randomUUID } from "crypto";

export type Trap = {
  weapon: Weapon;
  active: boolean;
  cooldown: number;
};

export const trapAttack = (trap: Trap, targetId: string): TrapResult => {
  const character = getCharacterById(store.getState(), targetId);
  const attackRoll = d20();
  const damageRoll = Math.ceil(Math.random() * trap.weapon.damageMax);
  const targetDefense = trap.weapon.targetDefense;
  const attackBonus = trap.weapon.modifiers?.attackBonus ?? 0;
  const defenseScore = character[targetDefense];
  const outcome = attackRoll + attackBonus >= defenseScore ? "hit" : "miss";

  return {
    trap,
    attackBonus,
    attackRoll,
    defenderId: targetId,
    damageRoll,
    outcome,
  };
};

export function getRandomTrap(): Trap {
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

export const trapInteraction = async (
  interaction: CommandInteraction
): Promise<void> => {
  const trap = getRandomTrap();
  const message = await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: "Trap!",
        color: "RED",
        description: `It's a trap!`,
      }).setImage("https://imgur.com/TDMLxyE.png"),
    ],
  });
  if (!(message instanceof Message)) return;
  const result = trapAttack(trap, interaction.user.id);

  if (!result) {
    await interaction.editReply("No result. This should not happen.");
    return;
  }
  await sleep(2000);
  const character = getUserCharacter(interaction.user);
  switch (result.outcome) {
    case "hit":
      awardXP(interaction.user.id, 1);
      if (character.hp > 0)
        updateUserQuestProgess(interaction.user, "survivor", result.damageRoll);
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            title: `The trap hit ${character.name} for ${result.damageRoll}!`,
            color: "RED",
            fields: [
              xpGainField(interaction, 1),
              hpBarField(character, -result.damageRoll),
            ],
          })
            .addField("Roll", trapRollText(result))
            .setImage("https://imgur.com/28oehQm.png"),
        ],
      });
      break;
    case "miss":
      awardXP(interaction.user.id, 2);
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            description: `You deftly evade!`,
          })
            .addField("Roll", trapRollText(result))
            .addFields([xpGainField(interaction, 2)])
            .setImage("https://imgur.com/gSgcrnN.png"),
        ],
      });
      break;
  }
};
