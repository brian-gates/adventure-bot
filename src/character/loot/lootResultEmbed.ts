import { MessageEmbed } from "discord.js";
import store from "../../store";
import { selectItemsById } from "../../store/selectors";
import { getCharacter } from "../getCharacter";
import { LootResult } from "./loot";

export const lootResultEmbed = (lootResult: LootResult): MessageEmbed => {
  const embed = new MessageEmbed({
    timestamp: lootResult.timestamp,
  }).addField("Gold", `💰 ${lootResult.goldTaken}`);
  const looter = getCharacter(lootResult.looterId);
  const lootee = getCharacter(lootResult.targetId);
  if (looter && lootee) {
    embed.setTitle(`${looter.name} looted ${lootee.name} `);
    embed.setImage(lootee.profile);
    embed.setThumbnail(looter.profile);
  }
  selectItemsById(store.getState(), lootResult.itemsTaken).forEach((item) =>
    embed.addField(item.name, item.description)
  );
  return embed;
};
