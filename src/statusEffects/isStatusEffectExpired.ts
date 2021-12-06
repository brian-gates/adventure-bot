import { StatusEffect } from "./StatusEffect";

export const isStatusEffectExpired = (effect: StatusEffect): boolean =>
  effect.started
    ? Date.now() > new Date(effect.started).valueOf() + effect.duration
    : false;
