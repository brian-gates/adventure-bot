import store from "../../store";
import { itemCreated } from "../../store/slices/items";
import { Item } from "../Item";

export function createItem<I extends Item>(item: I): I {
  store.dispatch(itemCreated(item));
  return item;
}
