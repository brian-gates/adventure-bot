import { EmbedFieldData } from "discord.js";
import store from "../store";
import { selectItemsById } from "../store/selectors";
import { Character } from "./Character";

export const inventoryFields = (character: Character): EmbedFieldData[] =>
  selectItemsById(store.getState(), character.inventory).map((item) => ({
    name: item.type,
    value: item.name,
  }));
