import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Graph } from "../graph";
import { CommandHandler } from "../utils";
import { vigorShrine } from "./encounters/shrine/vigor";
import { travel } from "./encounters/travel";

export const command = new SlashCommandBuilder()
  .setName("dungeon")
  .setDescription("Enter the dungeon.");

function comparator(a: CommandHandler, b: CommandHandler) {
  if (a < b) return -1;

  if (a > b) return 1;

  return 0;
}

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const graph = new Graph(comparator);
  graph.addNode(travel);
  graph.addNode(vigorShrine);
  graph.addNode(travel);
  let encounter = graph.nodes.values().next().value.data(interaction);
  let followUp = false;
  while (typeof encounter === "function") {
    await encounter(interaction, followUp);
    encounter = graph.nodes.values().next().value.data(interaction);
    followUp = true;
  }
};

export default { command, execute };
