import { Trap } from "./trap";

export type TrapResult = {
  outcome: "hit" | "miss";
  attackRoll: number;
  attackBonus: number;
  damageRoll: number;
  defenderId: string;
  trap: Trap;
};
