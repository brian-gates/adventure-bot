import { Character } from "../character/Character";
import { Tradeable } from "./equipment";
import store from "../store";
import {
  addItemToInventory,
  itemRemovedFromCharacter,
} from "../store/slices/characters";

export function giveItem({
  sender,
  recipient,
  item,
}: {
  sender: Character;
  recipient: Character;
  item: Tradeable;
}): boolean {
  if (!item.id) {
    const error = `Tried to give an item without an ID`;
    console.error(error, item);
    return false;
  }
  if (sender.id === recipient.id) return true;
  store.dispatch(
    itemRemovedFromCharacter({ characterId: sender.id, itemId: item.id })
  );
  store.dispatch(addItemToInventory({ character: recipient, item }));
  return true;
}
