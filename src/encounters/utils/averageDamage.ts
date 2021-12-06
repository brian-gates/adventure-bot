import { AttackResult } from "../../attack/AttackResult";

export const averageDamage = (attacks: AttackResult[]): number =>
  attacks.reduce(
    (total, attack) =>
      total + (attack.outcome === "hit" ? attack.totalDamage : 0),
    0
  ) / attacks.filter((x) => x.outcome === "hit").length;
