import { getCharacterStatModified } from "../character/getCharacterStatModified";
import store from "../store";
import { getCharacterById } from "../store/selectors";
import { AttackResult } from "./AttackResult";

export function hpText(result: AttackResult): string {
  const defender = getCharacterById(store.getState(), result.defenderId);

  return `${defender.hp}/${getCharacterStatModified(defender, "maxHP")} ${
    defender.hp <= 0 ? "(unconscious)" : ""
  }`;
}
