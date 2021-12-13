import { createSelector } from "@reduxjs/toolkit";
import { values } from "remeda";
import { Character } from "../../character/Character";
import { LootResult } from "../../character/loot/loot";
import { Equipment, isEquippable } from "../../equipment/equipment";
import { Item } from "../../equipment/Item";
import { Encounter } from "../../monster/Encounter";
import { isMonster, Monster } from "../../monster/Monster";
import { ReduxState } from "../../store";

export const selectCharacterById = (state: ReduxState, id: string): Character =>
  state.characters.charactersById[id];

export const getAllCharacters = createSelector(
  (state: ReduxState) => state.characters.charactersById,
  (charactersById) =>
    Object.values(charactersById).filter(
      (character) => character.isMonster !== true
    )
);

export const getMonsterById = createSelector(selectCharacterById, (character) =>
  isMonster(character) ? character : undefined
);

export const getRoamingMonsters = (state: ReduxState): Monster[] =>
  state.characters.roamingMonsters
    .map((id) => state.characters.charactersById[id])
    .filter(isMonster)
    .filter((monster) => monster.hp > 0);

export const getAllEncounters = (state: ReduxState): Encounter[] =>
  values(state.encounters.encountersById);

export const getEncounterById = (state: ReduxState, id: string): Encounter =>
  state.encounters.encountersById[id];

export const selectItemById = (state: ReduxState, id: string): Item =>
  state.items.itemsById[id];

export const selectItemsById = (state: ReduxState, ids: string[]): Item[] =>
  ids.reduce((acc: Item[], id: string) => {
    return [...acc, state.items.itemsById[id]];
  }, []);

export const getCooldownByType = (
  state: ReduxState,
  cooldownType: keyof ReduxState["cooldowns"]
): number | undefined => state.cooldowns[cooldownType];

export const hasItemNameInInventory = (
  state: ReduxState,
  character: Character,
  itemName: string
): boolean =>
  state.characters.charactersById[character.id]?.inventory.some(
    (id) => state.items.itemsById[id].name === itemName
  );

export const getEquipment = (
  state: ReduxState,
  characterId: string
): Equipment =>
  values(state.characters.charactersById[characterId]?.equipment).reduce(
    (acc: Equipment, itemId) => {
      const item = state.items.itemsById[itemId];
      return { ...acc, [item.type]: item };
    },
    {}
  );

export const selectCharacterItems = (
  state: ReduxState,
  characterId: string
): Item[] =>
  state.characters.charactersById[characterId]?.inventory.map(
    (id) => state.items.itemsById[id]
  );

export const hasSellableItems = createSelector(selectCharacterItems, (items) =>
  items.some((item) => item.sellable)
);

export const selectEquippableInventory = createSelector(
  selectCharacterItems,
  (items) => items.filter((item) => item.equippable)
);

export const getLoot = (state: ReduxState): LootResult[] =>
  values(state.loots.lootsById);

export const isHeavyCrownInPlay = (state: ReduxState): boolean =>
  state.characters.isHeavyCrownInPlay;

export const selectIsItemEquipped = (
  state: ReduxState,
  characterId: string,
  itemId: string
): boolean => {
  const character = state.characters.charactersById[characterId];
  if (!character) {
    return false;
  }
  const item = state.items.itemsById[itemId];
  if (!item || !isEquippable(item)) return false;
  return character.equipment[item.type] === itemId;
};
