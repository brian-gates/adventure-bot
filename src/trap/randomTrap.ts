import { weightedTable } from "../utils";
import { slowDustTrap, poisonDartTrap } from ".";
import { Trap } from "./trap";

export function randomTrap(): Trap {
  return weightedTable([
    [1, poisonDartTrap],
    [1, slowDustTrap],
  ])();
}
