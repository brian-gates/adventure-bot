import { AttackResult } from "./AttackResult";

export function damageDescriptor(result: AttackResult): string {
  const damage = result.damageRoll;
  switch (true) {
    case damage > 5:
      return "with a devastating blow!";
    case damage > 2:
      return "with a solid strike.";
    default:
      return "with a weak hit.";
  }
}
