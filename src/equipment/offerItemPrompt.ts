import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemSelect } from "./itemSelect";
import { isTradeable } from "./equipment";

import { giveItem } from "./giveItem";
import { itemEmbed } from "./itemEmbed";
import { selectItemsById } from "../store/selectors";
import store from "../store";
import { itemRemovedFromCharacter } from "../store/slices/characters";

export const offerItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const tradeableInventory = selectItemsById(
    store.getState(),
    character.inventory
  ).filter(isTradeable);
  if (tradeableInventory.length === 0) {
    interaction.followUp(`No items to offer.`);
    return;
  }
  const message = await interaction.followUp({
    content:
      "Offer an item for grabs. First to click gets it. If time expires, it will become dust in the wind.",
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory: tradeableInventory,
            placeholder: "Which item to be rid of?",
          }),
        ],
      }),
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "cancel",
            label: "Nevermind",
            style: "SECONDARY",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  let timeout = false;
  const response = await message
    .awaitMessageComponent({
      time: 60000,
    })
    .catch(() => {
      timeout = true;
      message.edit({
        content: `${character.name} decided not to offer any items.`,
        components: [],
      });
    });
  message.edit({ components: [] });
  if (!response) return;
  if (response.isButton()) {
    message.edit({
      content: `${character.name} decided not to offer any items.`,
      components: [],
    });
  }
  if (!response.isSelectMenu()) return;
  const item = tradeableInventory[parseInt(response.values[0])];
  if (timeout || !item) return;
  if (!item) return;
  const offer = await interaction.followUp({
    fetchReply: true,
    content: `${character.name} offers their ${item.name}.`,
    embeds: [itemEmbed({ item, interaction })],
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "take",
            label: `Take the ${item.name}.`,
            style: "PRIMARY",
          }),
        ],
      }),
    ],
  });

  if (!(offer instanceof Message)) return;
  const reply = await offer
    .awaitMessageComponent({
      componentType: "BUTTON",
      time: 60000,
    })
    .catch(() => {
      store.dispatch(
        itemRemovedFromCharacter({ characterId: character.id, itemId: item.id })
      );
      offer.edit({
        content: `${item.name} is dust in the wind.`,
        components: [],
      });
    });
  if (reply && reply.isButton()) {
    const recipient = getUserCharacter(reply.user);
    giveItem({
      sender: character,
      item,
      recipient,
    });
    offer.edit({ components: [] });
    interaction.followUp(
      `${recipient.name} took ${character.name}'s ${item.name}`
    );
  }
};
