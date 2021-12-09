import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, User } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { playerAttack } from "../attack/playerAttack";
import { sleep } from "../utils";
import { cooldownRemainingText } from "../character/cooldownRemainingText";
import { characterAttack } from "../attack/characterAttack";
import { loot, LootResult } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import { attackResultEmbed } from "../attack/attackResultEmbed";
import { Character } from "../character/Character";
import { AttackResult } from "../attack/AttackResult";

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
  if (getHP(attackingUser) === 0) {
    await interaction.editReply({
      embeds: [
        new MessageEmbed({
          description: `You're too weak to press on.`,
        }).setImage("https://imgur.com/uD06Okr.png"),
      ],
    });
    return;
  }
  const attackResult = playerAttack(attacker.id, defender.id);
  if (attackResult.outcome === "cooldown") {
    await interaction.editReply(
      `You can attack again ${cooldownRemainingText(
        interaction.user.id,
        "attack"
      )}.`
    );
    return;
  }

  if (attackResult.outcome === "targetNotFound") {
    await interaction.editReply(`Target not found.`);
    return;
  }

  const lootResult = isKnockedOut(defendingUser)
    ? loot({ looterId: attacker.id, targetId: defender.id })
    : undefined;

  await interaction.editReply({
    embeds: attackEmbeds({
      interaction,
      attacker,
      attackResult,
      defender,
      lootResult,
    }),
  });
  await sleep(2000);
  if (getHP(defendingUser) > 0) {
    const attackResult = characterAttack(defender.id, attacker.id);
    const lootResult = isKnockedOut(attackingUser)
      ? loot({ looterId: defender.id, targetId: attacker.id })
      : undefined;
    if (attackResult.outcome === "targetNotFound") {
      await interaction.editReply(`Target not found.`);
      return;
    }
    await interaction.followUp({
      embeds: retaliationEmbeds({
        attackResult,
        interaction,
        defender,
        attacker,
        lootResult,
      }),
    });
  }
};

function attackEmbeds({
  attackResult,
  interaction,
  attacker,
  defender,
  lootResult,
}: {
  attackResult: AttackResult;
  interaction: CommandInteraction;
  attacker: Character;
  defender: Character;
  lootResult: void | LootResult;
}) {
  const embeds = [
    attackResultEmbed({ result: attackResult, interaction }).setTitle(
      `${attacker.name} attacks ${defender.name}!`
    ),
  ];
  if (lootResult) embeds.push(lootResultEmbed(lootResult));
  return embeds;
}

function retaliationEmbeds({
  attackResult: result,
  interaction,
  defender,
  attacker,
  lootResult,
}: {
  attackResult: AttackResult;
  interaction: CommandInteraction;
  defender: Character;
  attacker: Character;
  lootResult: void | LootResult;
}) {
  const embeds = [
    attackResultEmbed({ result, interaction }).setTitle(
      `${defender.name} retaliates against ${attacker.name}!`
    ),
  ];
  if (lootResult) embeds.push(lootResultEmbed(lootResult));
  return embeds;
}

function isKnockedOut(user: User) {
  return getHP(user) === 0;
}

function getHP(user: User): number {
  return getUserCharacter(user).hp;
}

export default { command, execute };
