/**
 * Cesar Guerrero
 * 09/09/23
 * 
 * Testing the Dashboard Page
 * 
 * Overall plan:
 * 1. Test that if you go to this page you are redirected to the login page IFF you are not logged in
 * 2. Test that when you click logout, it actually logs you out and redirects you to the login page
 * 3. Test that if we get a server error, nothing except their username shows as we already have that information
 * 4. One service call for the user related information
 * 5. One service call for the tweet related information
 * 
 */

import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import { render, cleanup, screen, waitFor} from '@testing-library/react';

//Redux
import { Provider } from "react-redux"
import { setupStore } from '../store';

//Mocked Server
import { rest } from 'msw'
import { setupServer } from 'msw/node'

//Components
import Dashboard from '../components/dashboard';
import CheckUser from '../components/authentication'

//Setup our Base Server
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const handlers = [
//BASE -- A user is not logged in
  rest.get(`${BASE_URL}/profile`, (request, response, context) => {
    return response(context.json({"is_logged_in":false, "current_user":null}))
  }),
]

const server = setupServer(...handlers)

//Mocking useNavigate()
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockNavigate,
}))

//Before we run anything start our server
beforeAll(() => {
  server.listen()
})

//After each test, reset our server and clean up our render()
afterEach(() => {
  server.resetHandlers();
  cleanup()
})

//Turn off our server
afterAll(() => {
  server.close()
})

test('If the user is not logged in, they should be redirected', async () => {
    render(
        <Provider store={setupStore()}>
          <CheckUser/>
          <BrowserRouter>
            <Dashboard/>
          </BrowserRouter>
        </Provider>
      )
  
      await waitFor(() => {
        expect(mockNavigate).toBeCalledTimes(1);
        expect(mockNavigate).toBeCalledWith('/login')
      })
})

test('If the user is logged in they should NOT be redirected', async () => {
    server.use(
        rest.get(`${BASE_URL}/profile`, (request, response, context) => {
          return response(context.json({"is_logged_in":true, "current_user":'TwitterUserName'}))
        })
      )
  
      render(
        <Provider store={setupStore()}>
          <CheckUser/>
          <BrowserRouter>
            <Dashboard/>
          </BrowserRouter>
        </Provider>
      )
  
      await waitFor(() => {
        expect(mockNavigate).toBeCalledTimes(0);
      })
})

test('Check that we are showing the information we already collected BEFORE any API calls', async () => {
    render(
        <Provider store={setupStore()}>
          <CheckUser/>
          <BrowserRouter>
            <Dashboard/>
          </BrowserRouter>
        </Provider>
      )
  
      await waitFor(() => {
        /**
         * Expect that:
         *  - No picture is showing
         *  - The username is present
         *  - The logout button is present
         *  - Check two other "API call information" items to prove they don't exist
         */
      })
})

describe('User Object information testing', () => {
    /**
     * We are testing that we show the following information after an API call
     * - Created at
     * - Image
     * - Follower Count
     * - Following Count
     * - Tweet Count
     */
})

describe('Twitter information testing', () => {
    /**
     * We are testing that we show the following informatiojn after an API call
     * - Over 10 tweets
     *  - Impression Count
     *  - Like Count
     *  - Reply Count
     *  - Retweet Count
     *  - URL Link Clicks
     *  - User Profile Clicks
     */
})

