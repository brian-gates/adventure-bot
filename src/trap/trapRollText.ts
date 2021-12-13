import { getCharacterStatModified } from "../character/getCharacterStatModified";
import store from "../store";
import { selectCharacterById } from "../store/selectors";
import { TrapResult } from "./trapAttack";

export const trapResultText = (result: TrapResult): string => {
  const defender = selectCharacterById(store.getState(), result.defenderId);
  if (!defender) return "No target";
  if (!result) return "No result";
  return `${result.attackRoll}+${result.attackBonus} (${
    result.attackRoll + result.attackBonus
  }) vs ${getCharacterStatModified(defender, "ac")} ac${
    result.outcome === "hit" ? ` for ${result.damageRoll} damage` : ""
  }.`;
};
