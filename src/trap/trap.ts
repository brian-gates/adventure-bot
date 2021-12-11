import { Monster } from "../monster/Monster";

export type Trap = Monster & { isTrap: true };

export const isTrap = (trap: Trap): trap is Trap => trap.isTrap;
