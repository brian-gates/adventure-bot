import { CommandInteraction, MessageEmbed } from "discord.js";
import { d6 } from "../../utils/dice";
import { updateStatusEffect } from "../../statusEffects/grantStatusEffect";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { statusEffectEmbed } from "../../statusEffects/statusEffectEmbed";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import { clamp } from "remeda";
import { getCharacterStatModified } from "../../character/getCharacterStatModified";
import { questProgressField } from "../../quest/questProgressField";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import quests from "../../commands/quests";
import {
  adjustHP,
  awardXP,
  getUserCharacter,
  hpBarField,
  xpGainField,
} from "../../character";

export async function restfulNight(
  interaction: CommandInteraction
): Promise<void> {
  const preHealCharacter = getUserCharacter(interaction.user);
  const healAmount = d6();
  const actualHeal = clamp(healAmount, {
    max:
      getCharacterStatModified(preHealCharacter, "maxHP") - preHealCharacter.hp,
  });
  awardXP(interaction.user.id, 1);
  adjustHP(interaction.user.id, actualHeal);
  const character = getUserCharacter(interaction.user);
  const buff: StatusEffect = {
    name: "Restful Night",
    buff: true,
    debuff: false,
    duration: 30 * 60000,
    started: new Date().toString(),
    modifiers: {
      maxHP: 2,
    },
  };

  updateStatusEffect(character.id, buff);

  updateUserQuestProgess(interaction.user, "healer", actualHeal);

  await interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: "Restful Night",
        color: "DARK_NAVY",
        description: "You feel well rested. 💤",
        fields: [
          hpBarField(getUserCharacter(interaction.user), actualHeal),
          xpGainField(interaction, 1),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage("https://i.imgur.com/5FAD82X.png"),
      statusEffectEmbed(buff, interaction),
    ],
  });

  if (isUserQuestComplete(interaction.user, "healer"))
    await quests.execute(interaction);
}
