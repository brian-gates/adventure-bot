import { Equippable, isEquippable } from "../../equipment/equipment";
import { isEquipped } from "../../equipment/isEquipped";
import { Character } from "../../character/Character";
import { selectItemsById } from ".";
import store from "..";

// TODO: make this a selector
export function equippableInventory(character: Character): Equippable[] {
  return selectItemsById(store.getState(), character.inventory)
    .filter(isEquippable)
    .filter((item) => !isEquipped({ character, item }));
}
