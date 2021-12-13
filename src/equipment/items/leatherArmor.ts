import { randomUUID } from "crypto";
import { Armor } from "../equipment";
import { createItem } from "./createItem";

export const leatherArmor = (): Armor =>
  createItem({
    id: randomUUID(),
    type: "armor",
    description: "Tanned hides serve to protect yours.",
    goldValue: 20,
    name: "leather armor",
    modifiers: {
      ac: 2,
    },
    equippable: true,
    sellable: true,
    tradeable: true,
  });
