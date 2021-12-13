import { randomUUID } from "crypto";
import { Amulet } from "../equipment";
import { createItem } from "./createItem";

export const amuletOfProtection = (): Amulet =>
  createItem({
    id: randomUUID(),
    type: "amulet",
    description: "This amulet's onyx stone offers protection from harm.",
    goldValue: 200,
    name: "Amulet of Protection",
    modifiers: {
      ac: 2,
    },
    equippable: true,
    sellable: true,
    tradeable: true,
  });
