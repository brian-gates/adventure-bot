import { d20 } from "../utils/dice";
import { getCharacterById } from "../store/selectors";
import store from "../store";
import { Trap } from "./trap";

export type TrapResult = {
  outcome: "hit" | "miss";
  attackRoll: number;
  attackBonus: number;
  damageRoll: number;
  defenderId: string;
  trap: Trap;
};

export const trapAttack = (trap: Trap, targetId: string): TrapResult => {
  const character = getCharacterById(store.getState(), targetId);
  const attackRoll = d20();
  const damageRoll = Math.ceil(
    Math.random() * (trap.equipment.weapon?.damageMax ?? 6)
  );
  const targetDefense = trap.equipment.weapon?.targetDefense ?? "ac";
  const attackBonus = trap.equipment.weapon?.modifiers?.attackBonus ?? 0;
  const defenseScore = character[targetDefense];
  const outcome = attackRoll + attackBonus >= defenseScore ? "hit" : "miss";

  return {
    trap,
    attackBonus,
    attackRoll,
    defenderId: targetId,
    damageRoll,
    outcome,
  };
};
