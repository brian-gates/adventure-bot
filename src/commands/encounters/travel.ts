import { CommandInteraction, MessageEmbed } from "discord.js";
import { awardXP } from "../../gameState";

export const travel = async (
  interaction: CommandInteraction,
  isFollowUp = false
): Promise<void> => {
  awardXP(interaction.user.id, 1);
  await interaction[isFollowUp ? "followUp" : "reply"]({
    embeds: [
      new MessageEmbed()
        .setTitle("Travel")
        .setColor("GREEN")
        .setDescription(`You travel the lands.`)
        .addField("XP Gained", "1")
        .setImage("https://imgur.com/WCVVyh6.png"),
    ],
  });
};
