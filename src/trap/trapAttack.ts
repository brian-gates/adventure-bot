import { d20 } from "../utils/dice";
import { selectCharacterById, getEquipment } from "../store/selectors";
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

// todo: consolidate into attack
export const trapAttack = (trap: Trap, targetId: string): TrapResult => {
  const character = selectCharacterById(store.getState(), targetId);
  const { weapon } = getEquipment(store.getState(), character.id);
  const attackRoll = d20();
  const damageRoll = Math.ceil(Math.random() * (weapon?.damageMax ?? 6));
  const targetDefense = weapon?.targetDefense ?? "ac";
  const attackBonus = weapon?.modifiers?.attackBonus ?? 0;
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
