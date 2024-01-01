/**
 * Cesar Guerrero
 * 09/29/23
 * 
 * @file We are implementing a persistent state so that if a refresh happens, we still have our state
 */

export const loadState = () => {
    try{
        const serializedState = localStorage.getItem('state');
        if(serializedState === null){
            return undefined;
        }
        return JSON.parse(serializedState)
    }catch(error){
        return undefined
    }
}

export const saveState = (state:any) => {
    try{
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    }catch{
        //Do nothing
    }
}