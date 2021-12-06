import { CommandInteraction, MessageEmbed } from "discord.js";
import { AttackResult } from "../attack/AttackResult";
import { attackRollText } from "./attackRollText";
import { attackFlavorText } from "./attackFlavorText";
import { getCharacterById } from "../store/selectors";
import store from "../store";
import { damgeTakenField, hpBarField } from "../character";

export function attackResultEmbed({
  result,
  interaction,
}: {
  result: AttackResult;
  interaction: CommandInteraction;
}): MessageEmbed {
  const embed = new MessageEmbed().setDescription(attackFlavorText(result));
  const defender = getCharacterById(store.getState(), result.defenderId);

  switch (result.outcome) {
    case "hit":
      embed.setImage("https://i.imgur.com/rM6yWps.png");
      break;
    case "miss":
    default:
      embed.setImage(
        "https://i.pinimg.com/564x/10/5e/9e/105e9ea5f0d2e86bde9e7a365289a9cc.jpg"
      );
      break;
  }

  embed.addFields([
    hpBarField(defender, -result.damageRoll),
    {
      name: `Attack`,
      value: attackRollText({ result, interaction }),
    },
  ]);

  if (result.outcome === "hit")
    embed.addFields(damgeTakenField(interaction, result.totalDamage)); // TODO: damageRollText

  return embed;
}
