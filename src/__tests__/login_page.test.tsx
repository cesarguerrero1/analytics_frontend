/**
 * Cesar Guerrero
 * 09/08/23
 * 
 * Testing Login Page
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup, waitFor, screen } from '@testing-library/react';

//Redux
import { Provider } from "react-redux"
import { setupStore } from '../store';

//Mocked Server
import { rest } from 'msw'
import { setupServer } from 'msw/node'

//Components
import CheckUser from "../components/authentication/index";
import Login from '../components/login';

//Setup our Base Server
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const handlers = [
  //BASE -- A user is not logged in
  rest.get(`${BASE_URL}/profile`, (request, response, context) => {
    return response(context.json({"is_logged_in":false, "current_user":null}))
  }),

  //BASE -- We successfully get the oauth token from the server
  rest.get(`${BASE_URL}/login`, (request, response, context) => {
    return response(context.json({"oauth_ready":true, "oauth_token":"abc123"}))
  })
]

const server = setupServer(...handlers)

//Mocking useNavigate()
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

  test('If the user is logged in we should be redirected', async () =>{
    server.use(
      rest.get(`${BASE_URL}/profile`, (request, response, context) => {
        return response(context.json({"is_logged_in":true, "current_user":"Me"}))
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

  test('The Login page should show our buttons if the Oauth Token arrives', async() =>{
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
      expect(screen.getByAltText('Twitter').closest('a')).toHaveAttribute('href', 'https://api.twitter.com/oauth/authorize?oauth_token=abc123');
    })
  })

  test('The Login page should NOT show our buttons if redux fails to update appropriately', async() =>{
    server.use(
      rest.get(`${BASE_URL}/login`, (request, response, context) => {
        return response(
          context.status(200),
          context.json({"oauth_ready":false, "oauth_token":"abc123"})
          )
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

    //We should be on the login page and our buttons should be showing up
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })
  })

  test('The Login page should NOT show our buttons if the Oauth Token request is unauthorized', async() =>{
    server.use(
      rest.get(`${BASE_URL}/login`, (request, response, context) => {
        return response(context.status(401))
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

    //We should be on the login page and our buttons should be showing up
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })
  })

  test('The Login page should NOT show our buttons if the Oauth Token request fails', async() =>{
    server.use(
      rest.get(`${BASE_URL}/login`, (request, response, context) => {
        return response(context.status(503))
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

    //We should be on the login page and our buttons should be showing up
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })
  })

})

