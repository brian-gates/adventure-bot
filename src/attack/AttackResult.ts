import { DefenseStat } from "../character/Stats";

export type AttackResult = {
  outcome: "hit" | "miss";
  attackerId: string;
  defenderId: string;
  attackRoll: number;
  attackBonus: number;
  defense: number;
  targetDefense: DefenseStat;
  totalDamage: number;
  monsterDamageRoll: number;
  damageRoll: number;
};
