import { accuracyDescriptor } from "./accuracyDescriptor";
import { AttackResult } from "./AttackResult";
import { damageDescriptor } from "./damageDescriptor";

export function attackFlavorText(result: AttackResult): string {
  return result
    ? `${accuracyDescriptor(result)} ${damageDescriptor(result)}`
    : "No result";
}
