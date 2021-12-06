import { DefenseStat } from "../character/Stats";

type Attack = {
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

type AttackHit = Attack & {
  outcome: "hit";
};
type AttackMiss = Attack & {
  outcome: "miss";
};
export type AttackResult = AttackHit | AttackMiss;
