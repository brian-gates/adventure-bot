import { randomUUID } from "crypto";
import { Amulet } from "../equipment";
import { createItem } from "./createItem";

export const amuletOfAttack = (): Amulet =>
  createItem({
    id: randomUUID(),
    type: "amulet",
    description: "This amulet's ruby gem lights up when its wearer attacks.",
    goldValue: 200,
    name: "Amulet of Attack",
    modifiers: {
      attackBonus: 2,
    },
    equippable: true,
    sellable: true,
    tradeable: true,
  });
