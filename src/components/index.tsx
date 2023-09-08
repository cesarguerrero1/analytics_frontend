/**
 * Cesar Guerrero
 * 08/25/23
 * 
 * @file This is the main entry point into our front-end. We will be using React with the help
 * of bootstrap and redux to create the front-end user experience
 */

//Basic React Libraries
import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

//Redux
import { Provider } from "react-redux"

//Components
import CheckUser from "./authentication/index";
import Dashboard from "./dashboard/index"
import Login from "./login/index"
import Callback from "./other/callback"
import Error from "./other/error"

//CSS
import "./index.css"

//Store
import {setupStore} from "../store"

/**
 * Our entire website layout is defined here -- Notice the use of Bootstrap
 * @returns A JSX Element of the configured routes for our application wrapped inside a redux store
 */
function Analytics(): JSX.Element{
    return(
        <Provider store={setupStore()}>
            <CheckUser />
            <BrowserRouter>
                        <Routes>
                            <Route index element={<Dashboard/>}/>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/callback/" element={<Callback/>}/>
                            <Route path="/*" element={<Error/>}/>
                        </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default Analytics;