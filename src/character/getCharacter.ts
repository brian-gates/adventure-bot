import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Character } from "../character/Character";
import store from "../store";
import { selectCharacterById, getMonsterById } from "../store/selectors";

export const getCharacter = (characterId: string): Character | void => {
  purgeExpiredStatuses(characterId);
  const state = store.getState();
  const character = selectCharacterById(state, characterId);
  return character ?? getMonsterById(state, characterId);
};
