import { getCharacterStatModified } from "../character/getCharacterStatModified";
import store from "../store";
import { getCharacterById } from "../store/selectors";
import { trapAttack } from "./trapAttack";

export const trapRollText = (result: ReturnType<typeof trapAttack>): string => {
  const defender = getCharacterById(store.getState(), result.defenderId);
  if (!defender) return "No target";
  return result
    ? `${result.attackRoll}+${result.attackBonus} (${
        result.attackRoll + result.attackBonus
      }) vs ${getCharacterStatModified(defender, "ac")} ac${
        result.outcome === "hit" ? ` for ${result.damageRoll} damage` : ""
      }.`
    : "No result";
};
