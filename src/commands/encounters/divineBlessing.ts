import { CommandInteraction, MessageEmbed } from "discord.js";
import { grantDivineBlessing } from "../../gameState";

export const divineBlessing = async (
  interaction: CommandInteraction,
  isFollowUp = false
): Promise<void> => {
  grantDivineBlessing(interaction.user.id);
  await interaction[isFollowUp ? "followUp" : "reply"]({
    embeds: [
      new MessageEmbed()
        .setTitle("Divine Blessing")
        .setColor("GOLD")
        .setDescription(`A Divine blesses you with +1 max hp!`)
        .setImage("https://imgur.com/psnFPYG.png"),
    ],
  });
};
