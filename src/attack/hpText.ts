import { getCharacterStatModified } from "../character/getCharacterStatModified";
import store from "../store";
import { selectCharacterById } from "../store/selectors";
import { AttackResult } from "./AttackResult";

export function hpText(result: AttackResult): string {
  const defender = selectCharacterById(store.getState(), result.defenderId);

  return `${defender.hp}/${getCharacterStatModified(defender, "maxHP")} ${
    defender.hp <= 0 ? "(unconscious)" : ""
  }`;
}
