import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, User } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { playerAttack } from "../attack/playerAttack";
import { sleep } from "../utils";
import { cooldownRemainingText } from "../character/cooldownRemainingText";
import { characterAttack } from "../attack/characterAttack";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import { attackResultEmbed } from "../attack/attackResultEmbed";

export const command = new SlashCommandBuilder()
  .setName("attack")
  .setDescription("Make an attack")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to attack").setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const defendingUser = interaction.options.data[0].user;
  const attackingUser = interaction.user;
  if (!defendingUser) {
    await interaction.editReply(`You must specify a target @player`);
    return;
  }
  const attacker = getUserCharacter(attackingUser);
  const defender = getUserCharacter(defendingUser);
  let lootResult;
  if (attacker.hp === 0) {
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setDescription(`You're too weak to press on.`)
          .setImage("https://imgur.com/uD06Okr.png"),
      ],
    });
    return;
  }
  const result = playerAttack(attacker.id, defender.id);
  if (!result) {
    await interaction.editReply(`No attack result. This should not happen.`);
    return;
  }
  if (result.outcome === "cooldown") {
    await interaction.editReply(
      `You can attack again ${cooldownRemainingText(
        interaction.user.id,
        "attack"
      )}.`
    );
    return;
  }
  if (result.outcome === "targetNotFound") {
    await interaction.editReply(`Target not found.`);
    return;
  }
  const embeds = [];
  const hitsOrMisses = result.outcome === "hit" ? "hits" : "misses";
  embeds.push(
    attackResultEmbed({ result, interaction }).setTitle(
      `${attacker.name} ${hitsOrMisses} ${defender.name}!`
    )
  );
  if (getUserHp(defendingUser) === 0) {
    lootResult = loot({ looterId: attacker.id, targetId: defender.id });
    if (lootResult) embeds.push(lootResultEmbed(lootResult));
  }
  await interaction.editReply({
    embeds,
  });
  await sleep(2000);
  const retaliationEmbeds: MessageEmbed[] = [];
  if (getUserHp(defendingUser) > 0) {
    const result = characterAttack(defender.id, attacker.id);
    if (result.outcome === "targetNotFound") {
      await interaction.editReply(`Target not found.`);
      return;
    }
    const hitsOrMisses = result.outcome === "hit" ? "hits" : "misses";
    retaliationEmbeds.push(
      attackResultEmbed({ result, interaction }).setTitle(
        `${defender.name}'s retaliation against ${attacker.name} ${hitsOrMisses}!`
      )
    );
    if (getUserHp(defendingUser) === 0) {
      lootResult = loot({ looterId: defender.id, targetId: attacker.id });
      if (lootResult) retaliationEmbeds.push(lootResultEmbed(lootResult));
    }
    await interaction.followUp({
      embeds: retaliationEmbeds,
    });
  }
};

function getUserHp(user: User): number {
  return getUserCharacter(user).hp;
}

export default { command, execute };
