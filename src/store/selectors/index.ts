import { createSelector } from "@reduxjs/toolkit";
import { keys, values } from "remeda";
import { Character } from "../../character/Character";
import { LootResult } from "../../character/loot/loot";
import { Encounter } from "../../monster/Encounter";
import { isMonster, Monster } from "../../monster/Monster";
import { isStatusEffectExpired } from "../../statusEffects/isStatusEffectExpired";
import { ReduxState } from "../../store";
import { getAsset } from "../../utils/getAsset";

const decorateCharacterWithAssetProfile = <T extends Character>(
  character: T
) => {
  if (character && character.asset) {
    return {
      ...character,
      profile: getAsset(
        // @ts-ignore
        character.asset[0],
        character.asset[1],
        character.asset[2],
        character.id
      ).s3Url(),
    };
  } else return character;
};

export const selectCharacterById = (
  state: ReduxState,
  id: string
): Character => {
  const characterState = state.characters.charactersById[id];
  const character = {
    ...characterState,
    inventory: characterState.inventory.map(
      (id) => state.characters.itemsById[id]
    ),
  };
  return {
    ...decorateCharacterWithAssetProfile(character),
    statusEffects: character?.statusEffects?.filter(
      (effect) => !isStatusEffectExpired(effect)
    ),
  };
};
export const selectCharactersById = (
  state: ReduxState,
  ids: string[]
): Character[] => ids.map((id) => selectCharacterById(state, id));

export const selectAllCharacters = (state: ReduxState): Character[] =>
  selectCharactersById(state, keys(state.characters.charactersById));

export const selectMonsterById = createSelector(
  selectCharacterById,
  (character) => (isMonster(character) ? character : undefined)
);

export const selectRoamingMonsters = (state: ReduxState): Monster[] =>
  selectCharactersById(state, state.characters.roamingMonsters)
    .filter(isMonster)
    .filter((monster) => monster.hp > 0);

export const selectAllEncounters = (state: ReduxState): Encounter[] =>
  values(state.encounters.encountersById);

export const selectEncounterById = (state: ReduxState, id: string): Encounter =>
  state.encounters.encountersById[id];

export const selectCooldownByType = (
  state: ReduxState,
  cooldownType: keyof ReduxState["cooldowns"]
): number | undefined => state.cooldowns[cooldownType];

export const selectHasItemNameInInventory = (
  state: ReduxState,
  character: Character,
  itemName: string
): boolean =>
  state.characters.charactersById[character.id]?.inventory.some(
    (id) => state.characters.itemsById[id].name === itemName
  );

export const selectLoot = (state: ReduxState): LootResult[] =>
  values(state.loots.lootsById);

export const selectIsHeavyCrownInPlay = (state: ReduxState): boolean =>
  state.characters.isHeavyCrownInPlay;
