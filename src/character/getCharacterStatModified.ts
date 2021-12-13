import { Character } from "../character/Character";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { Stat } from "../character/Stats";
import store from "../store";
import { getEquipment } from "../store/selectors";

export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => {
  if (stat === "damageMax") {
    const { weapon } = getEquipment(store.getState(), character.id);
    return weapon?.damageMax ?? character.damageMax;
  }
  return character[stat] + getCharacterStatModifier(character, stat);
};
