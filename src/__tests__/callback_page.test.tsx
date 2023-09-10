/**
 * Cesar Guerrero
 * 09/01/23
 * 
 * Testing Callback Page 
 */

import React from 'react';
import {MemoryRouter, Routes, Route, BrowserRouter} from 'react-router-dom';
import { render, cleanup, screen } from '@testing-library/react';
import { act } from 'react-test-renderer';

//Redux
import { Provider } from "react-redux"
import { setupStore } from '../store';

//Mocked Server
import { rest } from 'msw'
import { setupServer } from 'msw/node'

//Components
import Callback from "../components/other/callback"
import { authorizationStatus } from '../reducers/users-reducer';

//Setup our Base Server
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const handlers = [
  //BASE -- A user is authorized
  rest.get(`${BASE_URL}/callback`,
    (request, response, context) => {
      return response(context.json({"oauth_approved":true, "current_user":"Cesar"}))
    }
  )
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
  jest.useRealTimers();
  cleanup()
})

//Turn off our server
afterAll(() => {
  server.close()
})

test('User successfully authenticated and redirected to dashboard page', async () => {
  //Jest allows us to advance time using Fake Timers
  jest.useFakeTimers();

  //We are using act() to allow for useEffect to play out and SPECIFICALLY to allow setTimeout() to run
  await act(async () => {
    render(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/callback?oauth_token=abc123&oauth_verifier=xyz456']}>
          <Routes>
            <Route path="/callback" element={<Callback/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  })

  //Fast-forward time to allow setTimeout() to take effect
  await act(async () => {
    jest.runAllTimers();
  })

  //Since we used act() we don't need to use waitFor()
  expect(screen.getByText("Attempting to authorize your account")).toBeInTheDocument();
  expect(screen.getByText("Authorization Status: APPROVED")).toBeInTheDocument();
  expect(screen.getByText("Redirecting you to the dashboard momentarily")).toBeInTheDocument();
  expect(mockNavigate).toBeCalledWith('/dashboard');

})

test('User unsuccessfully authenticated and redirected to the login page', async () => {
  //Alter our server response
  server.use(
    rest.get(`${BASE_URL}/callback`,
      (request, response, context) => {
        return response(context.json({"oauth_approved":false, "current_user":null}))
      }
    )
  )
  
  jest.useFakeTimers();

  await act(async () => {
    render(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/callback?oauth_token=abc123&oauth_verifier=xyz456']}>
          <Routes>
            <Route path="/callback" element={<Callback/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  })

  await act(async () => {
    jest.runAllTimers();
  })

  expect(screen.getByText("Attempting to authorize your account")).toBeInTheDocument();
  expect(screen.getByText("Authorization Status: REJECTED")).toBeInTheDocument();
  expect(screen.getByText("Redirecting you to the login page momentarily")).toBeInTheDocument();
  expect(mockNavigate).toBeCalledWith('/login');

})

test('Bad Server Response', async () => {
  //Alter our server response
  server.use(
    rest.get(`${BASE_URL}/callback`,
      (request, response, context) => {
        return response(context.status(503))
      }
    )
  )
  
  jest.useFakeTimers();

  await act(async () => {
    render(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/callback?oauth_token=abc123&oauth_verifier=xyz456']}>
          <Routes>
            <Route path="/callback" element={<Callback/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  })

  await act(async () => {
    jest.runAllTimers();
  })

  expect(screen.getByText("Attempting to authorize your account")).toBeInTheDocument();
  expect(screen.getByText("Authorization Status: REJECTED")).toBeInTheDocument();
  expect(screen.getByText("Redirecting you to the login page momentarily")).toBeInTheDocument();
  expect(mockNavigate).toBeCalledWith('/login');

})

test('User DENIED our request to act on their behalf', async () => {
  jest.useFakeTimers();

  await act(async () => {
    render(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/callback?denied=true']}>
          <Routes>
            <Route path="/callback" element={<Callback/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  })

  await act(async () => {
    jest.runAllTimers();
  })

  expect(screen.queryByText("Attempting to authorize your account")).not.toBeInTheDocument();
  expect(screen.queryByText("Authorization Status: APPROVED")).not.toBeInTheDocument();
  expect(screen.queryByText("Redirecting you to the dashboard momentarily")).not.toBeInTheDocument();
  expect(screen.getByText("AUTHORIZATION DENIED")).toBeInTheDocument();
  expect(screen.getByText("Redirecting you back to the login page momentarily")).toBeInTheDocument();
  expect(mockNavigate).toBeCalledWith('/login');

})

test('User has already had their authorization approved', async () => {
  jest.useFakeTimers();

  //Notice that we never passed query params into our route BUT we did alter the initial state
  await act(async () => {
    render(
      <Provider store={setupStore({users:{authorizationApproved: authorizationStatus.APPROVED, authorizationStatusMessage: "APPROVED"}})}>
        <BrowserRouter>
          <Callback/>
        </BrowserRouter>
      </Provider>
    )
  })

  await act(async () => {
    jest.runAllTimers();
  })

  expect(screen.getByText("Attempting to authorize your account")).toBeInTheDocument();
  expect(screen.getByText("Authorization Status: APPROVED")).toBeInTheDocument();
  expect(screen.getByText("Redirecting you to the dashboard momentarily")).toBeInTheDocument();
  expect(mockNavigate).toBeCalledWith('/dashboard');

})

test('User has already had their authorization rejected', async () => {
  jest.useFakeTimers();

  //Notice that we never passed query params into our route BUT we did alter the initial state
  await act(async () => {
    render(
      <Provider store={setupStore({users:{authorizationApproved: authorizationStatus.REJECTED, authorizationStatusMessage: "REJECTED"}})}>
        <BrowserRouter>
          <Callback/>
        </BrowserRouter>
      </Provider>
    )
  })

  await act(async () => {
    jest.runAllTimers();
  })

  expect(screen.getByText("Attempting to authorize your account")).toBeInTheDocument();
  expect(screen.getByText("Authorization Status: REJECTED")).toBeInTheDocument();
  expect(screen.getByText("Redirecting you to the login page momentarily")).toBeInTheDocument();
  expect(mockNavigate).toBeCalledWith('/login');

})


