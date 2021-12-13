import { randomUUID } from "crypto";
import { Shield } from "../equipment";
import { createItem } from "./createItem";

export const buckler = (): Shield =>
  createItem({
    id: randomUUID(),
    type: "shield",
    description: "A small and nimble shield that doesn't get in the way.",
    goldValue: 20,
    name: "buckler",
    modifiers: {
      ac: 1,
    },
    equippable: true,
    sellable: true,
    tradeable: true,
  });
