import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { sleep } from "../utils";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { awardXP } from "../character/awardXP";
import { trapResultText } from "./trapRollText";
import { xpGainField } from "../character/xpGainField";
import { hpBarField } from "../character/hpBar/hpBarField";
import { randomTrap } from "./randomTrap";
import { trapAttack } from "./trapAttack";

export const trapInteraction = async (
  interaction: CommandInteraction
): Promise<void> => {
  const trap = randomTrap();
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
            .addField("Roll", trapResultText(result))
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
            .addField("Roll", trapResultText(result))
            .addFields([xpGainField(interaction, 2)])
            .setImage("https://imgur.com/gSgcrnN.png"),
        ],
      });
      break;
  }
};
