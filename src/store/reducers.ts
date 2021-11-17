
   
import { combineReducers } from '@reduxjs/toolkit'

import characters from './slices/characters'
import monsters from './slices/monsters'
import loots from './slices/loots'
import encounters from './slices/encounters'
import cooldowns from './slices/cooldowns'

const rootReducer = combineReducers({
  characters,
  monsters,
  loots,
  encounters,
  cooldowns,
})

export default rootReducer