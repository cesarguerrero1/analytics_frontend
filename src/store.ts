/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file Reconfiguring Redux Store for Typescript
 */

import {combineReducers, configureStore, PreloadedState} from "@reduxjs/toolkit"

//Reducers
import usersReducer from "./reducers/users-reducer"
import twitterReducer from "./reducers/twitter-reducer"
import twitchReducer from "./reducers/twitch-reducer"

//Create SINGLE rootReducer so that we can then obtain a state type
const rootReducer = combineReducers({
    users:usersReducer,
    twitter:twitterReducer,
    twitch:twitchReducer
})

//This funtion creates a STORE from which we access our reducers
export function setupStore(preloadedState ?: PreloadedState<RootState>){
    return configureStore({
        reducer: rootReducer,
        preloadedState
    })
}

//Ensuring Typescript is happy
export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']