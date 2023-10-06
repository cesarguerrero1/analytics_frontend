/**
 * Cesar Guerrero
 * 09/08/23
 * 
 * Testing Login Page
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup, waitFor, screen, fireEvent } from '@testing-library/react';

//Redux
import { Provider } from "react-redux"
import { setupStore } from '../store';

//Mocked Server
import { rest } from 'msw'
import { setupServer } from 'msw/node'

//Components
import CheckUser from "../components/authentication";
import Login from '../components/login';

//Setup our Base Server
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const handlers = [
  //BASE -- A user is not logged in
  rest.get(`${BASE_URL}/profile`, (request, response, context) => {
    return response(context.json({"app":null,"is_logged_in":false,"status_code":200,"status_message":"OK"}))
  }),

  //BASE -- Twitter Call for oauth flow
  rest.get(`${BASE_URL}/login/twitter`, (request, response, context) => {
    return response(context.json({"oauth_ready":true,"oauth_token":"abc123","status_code":200,"status_message":"OK"}))
  }),
  
  //BASE -- Twitch Call for oauth flow
  rest.get(`${BASE_URL}/login/twitch`, (request, response, context) => {
    return response(context.json({"client_id":"abc","oauth_ready":true,"status_code":200,"status_message":"OK"}))
  })
]

const server = setupServer(...handlers)

//Mocking useNavigate() -- We are not in the browser so the redirect doesnt happen
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockNavigate
}))


//Before we run anything start our server
beforeAll(() => {
  server.listen()
})

//After each test, reset our server and clean up our render()
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

//Turn off our server
afterAll(() => {
  server.close()
})

describe("Checking login functionality for Login Page", () => {

  test('If the user is not logged in we should stay on the page', async () =>{
    render(
      <Provider store={setupStore()}>
        <CheckUser/>
        <BrowserRouter>
          <Login/>
        </BrowserRouter>
      </Provider>
    )
    
    //We should be on the login page and our buttons should be showing up
    await waitFor(() => {
      expect(screen.getByText("ANALYTICS DASHBOARD")).toBeInTheDocument()
      expect(mockNavigate).toBeCalledTimes(0);
    })
    
  })

  test('If the user is logged in to Twitch we should be redirected', async () =>{
    server.use(
      rest.get(`${BASE_URL}/profile`, (request, response, context) => {
        return response(context.json({"app":"Twitch","is_logged_in":true,"status_code":200,"status_message":"OK"}))
      })
    )

    render(
      <Provider store={setupStore()}>
        <CheckUser/>
        <BrowserRouter>
          <Login/>
        </BrowserRouter>
      </Provider>
    )

    //We should not see the title for the Login Page, we should instead see the page for the Dashboard
    await waitFor(() => {
      expect(mockNavigate).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledWith('/dashboard')
    })

  })

  test('If the user is logged in to Twitter we should be redirected', async () =>{
    server.use(
      rest.get(`${BASE_URL}/profile`, (request, response, context) => {
        return response(context.json({"app":"Twitter","is_logged_in":true,"status_code":200,"status_message":"OK"}))
      })
    )

    render(
      <Provider store={setupStore()}>
        <CheckUser/>
        <BrowserRouter>
          <Login/>
        </BrowserRouter>
      </Provider>
    )

    //We should not see the title for the Login Page, we should instead see the page for the Dashboard
    await waitFor(() => {
      expect(mockNavigate).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledWith('/dashboard')
    })

  })


})

describe("Testing appeareance of Twitch and Twitter Buttons", () => {

  test("Both buttons should be visible", async () => {
    render(
      <Provider store={setupStore()}>
        <CheckUser/>
        <BrowserRouter>
          <Login/>
        </BrowserRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByAltText("Twitch").closest('a')).toHaveAttribute("href", "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=abc&redirect_uri=https://localhost/callback/twitch&scope=bits%3Aread%20moderator%3Aread%3Afollowers%20channel%3Aread%3Asubscriptions%20user%3Aread%3Aemail")
      expect(screen.getByAltText("Twitter").closest('a')).toHaveAttribute("href", "https://api.twitter.com/oauth/authorize?oauth_token=abc123")
    })

  })

  test("Neither button should be visible", async () => {
    server.use(
      rest.get(`${BASE_URL}/login/twitter`, (request, response, context) => {
        return response(context.status(400))
      }),
      rest.get(`${BASE_URL}/login/twitch`, (request, response, context) => {
        return response(context.status(400))
      })
    )
  
    render(
      <Provider store={setupStore()}>
        <CheckUser/>
        <BrowserRouter>
          <Login/>
        </BrowserRouter>
      </Provider>
    )
  
    await waitFor(() => {
      expect(screen.queryByAltText("Twitch")).toBeNull()
      expect(screen.queryByAltText("Twitter")).toBeNull()
    })
  
  })

  test("Only the Twitter button should be visible", async () =>{
    server.use(
      rest.get(`${BASE_URL}/login/twitch`, (request, response, context) => {
        return response(context.status(400))
      })
    )
  
    render(
      <Provider store={setupStore()}>
        <CheckUser/>
        <BrowserRouter>
          <Login/>
        </BrowserRouter>
      </Provider>
    )
  
    await waitFor(() => {
      expect(screen.getByAltText("Twitter")).toBeInTheDocument();
      expect(screen.queryByAltText("Twitch")).toBeNull()
    })

  })
  
  test("Only the Twitch button should be visible", async () =>{
    server.use(
      rest.get(`${BASE_URL}/login/twitter`, (request, response, context) => {
        return response(context.status(400))
      })
    )
  
    render(
      <Provider store={setupStore()}>
        <CheckUser/>
        <BrowserRouter>
          <Login/>
        </BrowserRouter>
      </Provider>
    )
  
    await waitFor(() => {
      expect(screen.getByAltText("Twitch")).toBeInTheDocument();
      expect(screen.queryByAltText("Twitter")).toBeNull()
    })

  })

})
