import { createSelector } from "@reduxjs/toolkit";
import { values } from "remeda";
import { Character } from "../../character/Character";
import { LootResult } from "../../character/loot/loot";
import { Encounter } from "../../monster/Encounter";
import { isMonster } from "../../monster/Monster";
import { Quest } from "../../quest/Quest";
import { QuestId, quests } from "../../quest/quests";
import { ReduxState } from "../../store";
import { getAsset } from "../../utils/getAsset";
import { isStatusEffectExpired } from "../slices/characters";

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

export const selectCharacterById = createSelector(
  (state: ReduxState, id: string) => state.characters.charactersById[id],
  (character) =>
    character
      ? {
          ...decorateCharacterWithAssetProfile(character),
          statusEffects: character?.statusEffects?.filter(
            (effect) => !isStatusEffectExpired(effect)
          ),
        }
      : undefined
);

export const selectAllCharacters = createSelector(
  (state: ReduxState) => state.characters.charactersById,
  (charactersById) =>
    Object.values(charactersById)
      .filter((character) => character.isMonster !== true)
      .map((c) => decorateCharacterWithAssetProfile<Character>(c))
);

export const selectMonsterById = createSelector(
  (state: ReduxState, id: string) => state.characters.charactersById[id],
  (character) =>
    isMonster(character)
      ? decorateCharacterWithAssetProfile(character)
      : undefined
);

export const selectRoamingMonsters = createSelector(
  (state: ReduxState) =>
    state.characters.roamingMonsters.map(
      (id) => state.characters.charactersById[id]
    ),
  (monsters) => monsters.filter(isMonster).filter((monster) => monster.hp > 0)
);

export const selectAllEncounters = (state: ReduxState): Encounter[] =>
  values(state.encounters.encountersById);

export const selectEncounterById = (state: ReduxState, id: string): Encounter =>
  state.encounters.encountersById[id];

export const selectCooldownByType = (
  state: ReduxState,
  cooldownType: keyof ReduxState["cooldowns"]
): number | undefined => state.cooldowns[cooldownType];

export const selectHasItemNameInInventory = createSelector(
  (state: ReduxState, character: Character, itemName: string) =>
    state.characters.charactersById[character.id]?.inventory.some(
      (item) => item.name === itemName
    ),
  (hasItem) => hasItem
);

export const selectLoot = (state: ReduxState): LootResult[] =>
  values(state.loots.lootsById);

export const selectIsHeavyCrownInPlay = (state: ReduxState): boolean =>
  state.characters.isHeavyCrownInPlay;

export const selectIsCharacterOnQuest = ({
  state,
  characterId,
  questId,
}: {
  state: ReduxState;
  characterId: string;
  questId: QuestId;
}): boolean => {
  const character = state.characters.charactersById[characterId];
  return character?.quests[questId] ? true : false;
};

export function selectAvailableQuests(
  state: ReduxState,
  character: Character
): Quest[] {
  return [quests.blessed, quests.slayer, quests.survivor].filter((quest) => {
    return !selectIsCharacterOnQuest({
      state,
      characterId: character.id,
      questId: quest.id,
    });
  });
}
