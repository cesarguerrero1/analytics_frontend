/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file Reconfiguring Redux Store for Typescript
 */


import { combineReducers, configureStore, PreloadedState} from "@reduxjs/toolkit"
//Reducers
import usersReducer from "./reducers/users-reducer"

//Create rootReducer to obtain state type
const rootReducer = combineReducers({
    users:usersReducer,
})

//Store creation function
export function setupStore(preloadedState?: PreloadedState<RootState>){
    return configureStore({
        reducer: rootReducer,
        preloadedState
    })
}

//Ensuring Typescript is happy
export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
