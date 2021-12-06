import { Character } from "../character/Character";
import store from "../store";
import { adjustHP as doAdjustHP } from "../store/slices/characters";

export const adjustHP = (
  characterId: string,
  amount: number
): Character | void => {
  store.dispatch(doAdjustHP({ characterId, amount }));
};
