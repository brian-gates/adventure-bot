import { getCharacterStatModified } from "../character/getCharacterStatModified";
import store from "../store";
import { getCharacterById } from "../store/selectors";
import { TrapResult } from "./TrapResult";

export const trapResultText = (result: TrapResult): string => {
  const defender = getCharacterById(store.getState(), result.defenderId);
  if (!defender) return "No target";
  if (!result) return "No result";
  return `${result.attackRoll}+${result.attackBonus} (${
    result.attackRoll + result.attackBonus
  }) vs ${getCharacterStatModified(defender, "ac")} ac${
    result.outcome === "hit" ? ` for ${result.damageRoll} damage` : ""
  }.`;
};
