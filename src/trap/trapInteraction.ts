import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { sleep } from "../utils";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { awardXP } from "../character/awardXP";
import { trapResultText } from "./trapRollText";
import { xpGainField } from "../character/xpGainField";
import { hpBarField } from "../character/hpBar/hpBarField";
import { randomTrap } from "./randomTrap";
import { trapAttack, TrapResult } from "./trapAttack";
import { Character } from "../character/Character";

export const trap = async (interaction: CommandInteraction): Promise<void> => {
  const trap = randomTrap();
  const message = await itsATrap(interaction);
  if (!(message instanceof Message)) return;
  const result = trapAttack(trap, interaction.user.id);

  await sleep(2000);
  const character = getUserCharacter(interaction.user);
  switch (result.outcome) {
    case "hit":
      awardXP(interaction.user.id, 1);
      if (character.hp > 0)
        updateUserQuestProgess(interaction.user, "survivor", result.damageRoll);
      await trapHit({ interaction, character, result });
      break;
    case "miss":
      awardXP(interaction.user.id, 2);
      await trapMiss({ interaction, result });
      break;
  }
};

async function itsATrap(interaction: CommandInteraction) {
  return await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: "Trap!",
        color: "RED",
        description: `It's a trap!`,
      }).setImage("https://imgur.com/TDMLxyE.png"),
    ],
  });
}

async function trapMiss({
  interaction,
  result,
}: {
  interaction: CommandInteraction;
  result: TrapResult;
}) {
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
}

async function trapHit({
  interaction,
  character,
  result,
}: {
  interaction: CommandInteraction;
  character: Character;
  result: TrapResult;
}) {
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
}
