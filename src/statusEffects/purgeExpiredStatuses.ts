import store from "../store";
import { purgeExpiredStatuses as doPurgeExpiredStatuses } from "../store/slices/characters";

export const purgeExpiredStatuses = (characterId: string): void => {
  store.dispatch(doPurgeExpiredStatuses(characterId));
};
