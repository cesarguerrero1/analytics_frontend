/**
 * Cesar Guerrero
 * 09/01/23
 * 
 * Testing Login Page
 * 
 * What are we testing:
 * 1. If the oauth request fails to validate, no buttons should be shown!
 * 2. If the oauth does validate, buttons should show up
 * 3. Clicking on the button should open a new window
 * 4. If you are logged in you should not be able to
 * 
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, cleanup, waitFor} from '@testing-library/react';
import renderer from 'react-test-renderer';

//Compnonents 
import Login from "../components/login/index"

//Redux
import { Provider } from "react-redux"
import {store} from '../store';


test('Github Test', () => {
  expect(true).toBe(true)
})