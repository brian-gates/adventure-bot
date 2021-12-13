import { CommandInteraction } from "discord.js";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { AttackResult } from "../attack/AttackResult";
import { Emoji } from "../Emoji";
import { selectCharacterById } from "../store/selectors";
import store from "../store";

export const attackRollText = ({
  result,
  interaction,
}: {
  result: AttackResult;
  interaction: CommandInteraction;
}): string => {
  const defender = selectCharacterById(store.getState(), result.defenderId);
  const attacker = selectCharacterById(store.getState(), result.attackerId);
  const ac = defender.ac;
  const defense = getCharacterStatModifier(defender, result.targetDefense);
  const roll = result.attackRoll;
  const attackBonus = getCharacterStatModified(attacker, "attackBonus");
  const totalAttack = roll + attackBonus;

  const acModifierText =
    defense > 0 ? `+${defense}` : defense < 0 ? `-${defense}` : ``;

  const comparison = result.outcome === "hit" ? "≥" : "<";
  const outcomeText =
    result.outcome === "hit"
      ? Emoji(interaction, "hit") + " Hit!"
      : Emoji(interaction, "miss") + " Miss.";

  return `${outcomeText}\n${Emoji(
    interaction,
    "attack"
  )}${totalAttack} ${comparison} ${Emoji(interaction, result.targetDefense)}${
    10 + defense
  } (\`${roll}\`+${attackBonus} vs ${ac}${acModifierText})`;
};
