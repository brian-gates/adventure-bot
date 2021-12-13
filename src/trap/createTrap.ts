import { randomUUID } from "crypto";
import store from "../store";
import { trapCreated } from "../store/slices/characters";
import { Trap } from "./trap";

export function createTrap(config: Omit<Trap, "id">): Trap {
  const trap: Trap = {
    ...config,
    id: randomUUID(),
    isTrap: true,
    isMonster: true,
  };
  store.dispatch(trapCreated(trap));
  return trap;
}
