import { randomUUID } from "crypto";
import { Armor } from "../equipment";
import { createItem } from "./createItem";

export const chainArmor = (): Armor =>
  createItem({
    id: randomUUID(),
    type: "armor",
    description: "Linked metal chains worn to protect.",
    goldValue: 40,
    name: "chain armor",
    modifiers: {
      ac: 3,
    },
    equippable: true,
    sellable: true,
    tradeable: true,
  });
