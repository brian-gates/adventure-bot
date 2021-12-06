import { characterAttack } from "./characterAttack";
import { isCharacterOnCooldown, setCharacterCooldown } from "../character";

export const playerAttack = (
  attackerId: string,
  defenderId: string
): ReturnType<typeof characterAttack> | { outcome: "cooldown" } => {
  if (isCharacterOnCooldown(attackerId, "attack")) {
    return { outcome: "cooldown" };
  }
  const result = characterAttack(attackerId, defenderId);
  if (result) setCharacterCooldown(attackerId, "attack");
  return result;
};
