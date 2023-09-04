/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file In order to comply with Typescript we need to reconfigure some of our hooks
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type {RootState, AppDispatch} from "./store"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector