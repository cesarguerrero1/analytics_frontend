/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file Reconfiguring Redux Store for Typescript
 */


import { configureStore } from "@reduxjs/toolkit"

//Reducers
import usersReducer from "./reducers/users-reducer"

//Creating Store -- We need this to be in a function for testing
export const createStore = () => configureStore({
    reducer:{
        users:usersReducer
    }
})

//Create our store
export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {users: usersReducer, Etc.}
export type AppDispatch = typeof store.dispatch
