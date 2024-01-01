/**
 * Cesar Guerrero
 * 09/01/23
 * 
 * Testing Callback Page 
 */

import React from 'react';
import { MemoryRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
import { render, cleanup, screen, waitFor} from '@testing-library/react';
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

const server = setupServer()

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

describe("Testing redirects of Authorization Status", () => {

  test('User has already had their authorization approved', async () => {
    jest.useFakeTimers();
  
    //Notice that we never passed any query params NOR a path parameter into our route BUT we did alter the initial state
    await act(async () => {
      render(
        <Provider store={setupStore({users:{authorizationApproved: authorizationStatus.APPROVED}})}>
          <BrowserRouter>
            <Callback/>
          </BrowserRouter>
        </Provider>
      )
    })
  
    await act(async () => {
      jest.runAllTimers();
    })
  
    expect(mockNavigate).toBeCalledWith('/dashboard');

  
  })
  
  test('User has already had their authorization rejected', async () => {
    jest.useFakeTimers();

    await act(async () => {
      render(
        <Provider store={setupStore({users:{authorizationApproved: authorizationStatus.REJECTED}})}>
          <BrowserRouter>
            <Callback/>
          </BrowserRouter>
        </Provider>
      )
    })
  
    await act(async () => {
      jest.runAllTimers();
    })
  
    expect(mockNavigate).toBeCalledWith('/login');
  
  })
})

describe("Testing Twitter Callback Page", () => {

  test("Test that Twitter-based HTML pops up", async () => {
    render(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/callback/twitter']}>
          <Routes>
            <Route path="/callback/:appname" element={<Callback/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText("Attempting to authorize your Twitter account")).toBeInTheDocument();
    })

  })

  test('User successfully authenticated via Twitter and redirected to dashboard page', async () => {
    //Alter our server response
    server.use(
      rest.get(`${BASE_URL}/callback/twitter`, (request, response, context) => {
        return response(context.json({"oauth_approved":true,"status_code":200,"status_message":"OK"}))
      })
    )

    //Jest allows us to advance time using Fake Timers
    jest.useFakeTimers();
  
    //We are using act() to allow for useEffect to play out and SPECIFICALLY to allow setTimeout() to run
    await act(async () => {
      render(
        <Provider store={setupStore()}>
          <MemoryRouter initialEntries={['/callback/twitter?oauth_token=abc123&oauth_verifier=xyz456']}>
            <Routes>
              <Route path="/callback/:appname" element={<Callback/>}/>
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
    expect(screen.getByText("Attempting to authorize your Twitter account")).toBeInTheDocument();
    expect(screen.getByText("Authorization Status: APPROVED")).toBeInTheDocument();
    expect(screen.getByText("Redirecting you to the dashboard momentarily")).toBeInTheDocument();
    expect(mockNavigate).toBeCalledWith('/dashboard');
  
  })

  test('User unsuccessfully authenticated via Twitter and redirected to the login page', async () => {
    //Alter our server response
    server.use(
      rest.get(`${BASE_URL}/callback/twitter`, (request, response, context) => {
          return response(context.status(401))
      })
    )
    
    jest.useFakeTimers();
  
    await act(async () => {
      render(
        <Provider store={setupStore()}>
          <MemoryRouter initialEntries={['/callback/twitter?oauth_token=abc123&oauth_verifier=xyz456']}>
            <Routes>
              <Route path="/callback/:appname" element={<Callback/>}/>
            </Routes>
          </MemoryRouter>
        </Provider>
      )
    })
  
    await act(async () => {
      jest.runAllTimers();
    })
  
    expect(screen.getByText("Attempting to authorize your Twitter account")).toBeInTheDocument();
    expect(screen.getByText("Authorization Status: REJECTED")).toBeInTheDocument();
    expect(screen.getByText("Redirecting you to the login page momentarily")).toBeInTheDocument();
    expect(mockNavigate).toBeCalledWith('/login');
  
  })

  test('User denied our Twitter authentication', async () => {
    jest.useFakeTimers();
  
    await act(async () => {
      render(
        <Provider store={setupStore()}>
          <MemoryRouter initialEntries={['/callback/twitter?denied=true']}>
            <Routes>
              <Route path="/callback/:appname" element={<Callback/>}/>
            </Routes>
          </MemoryRouter>
        </Provider>
      )
    })
  
    await act(async () => {
      jest.runAllTimers();
    })
  
    expect(screen.queryByText("Attempting to authorize your Twitter account")).toBeNull();
    expect(screen.getByText("You have DENIED our authorization attempt")).toBeInTheDocument();
    expect(screen.getByText("Redirecting you back to the login page momentarily")).toBeInTheDocument();
    expect(mockNavigate).toBeCalledWith('/login');
  })

})

describe("Testing Twitch Callback Page", () => {
  
  test("Test that Twitch-based HTML pops up", async () => {
    render(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/callback/twitch']}>
          <Routes>
            <Route path="/callback/:appname" element={<Callback/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText("Attempting to authorize your Twitch account")).toBeInTheDocument();
    })

  })

  test('User successfully authenticated via Twitch and redirected to dashboard page', async () => {
    //Alter our server response
    server.use(
      rest.get(`${BASE_URL}/callback/twitch`, (request, response, context) => {
        return response(context.json({"oauth_approved":true,"status_code":200,"status_message":"OK"}))
      })
    )


    //Jest allows us to advance time using Fake Timers
    jest.useFakeTimers();
  
    //We are using act() to allow for useEffect to play out and SPECIFICALLY to allow setTimeout() to run
    await act(async () => {
      render(
        <Provider store={setupStore()}>
          <MemoryRouter initialEntries={['/callback/twitch?code=abc123']}>
            <Routes>
              <Route path="/callback/:appname" element={<Callback/>}/>
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
    expect(screen.getByText("Attempting to authorize your Twitch account")).toBeInTheDocument();
    expect(screen.getByText("Authorization Status: APPROVED")).toBeInTheDocument();
    expect(screen.getByText("Redirecting you to the dashboard momentarily")).toBeInTheDocument();
    expect(mockNavigate).toBeCalledWith('/dashboard');
  
  })

  test('User unsuccessfully authenticated via Twitch and redirected to the login page', async () => {
    //Alter our server response
    server.use(
      rest.get(`${BASE_URL}/callback/twitch`, (request, response, context) => {
          return response(context.status(401))
      })
    )
    
    jest.useFakeTimers();
  
    await act(async () => {
      render(
        <Provider store={setupStore()}>
          <MemoryRouter initialEntries={['/callback/twitch?code=abc123']}>
            <Routes>
              <Route path="/callback/:appname" element={<Callback/>}/>
            </Routes>
          </MemoryRouter>
        </Provider>
      )
    })
  
    await act(async () => {
      jest.runAllTimers();
    })
  
    expect(screen.getByText("Attempting to authorize your Twitch account")).toBeInTheDocument();
    expect(screen.getByText("Authorization Status: REJECTED")).toBeInTheDocument();
    expect(screen.getByText("Redirecting you to the login page momentarily")).toBeInTheDocument();
    expect(mockNavigate).toBeCalledWith('/login');
  
  })

  test('User denied our Twitch authentication', async () => {
    jest.useFakeTimers();
  
    await act(async () => {
      render(
        <Provider store={setupStore()}>
          <MemoryRouter initialEntries={['/callback/twitch?error=xyz456']}>
            <Routes>
              <Route path="/callback/:appname" element={<Callback/>}/>
            </Routes>
          </MemoryRouter>
        </Provider>
      )
    })
  
    await act(async () => {
      jest.runAllTimers();
    })
  
    expect(screen.queryByText("Attempting to authorize your Twitch account")).toBeNull();
    expect(screen.getByText("You have DENIED our authorization attempt")).toBeInTheDocument();
    expect(screen.getByText("Redirecting you back to the login page momentarily")).toBeInTheDocument();
    expect(mockNavigate).toBeCalledWith('/login');
  })

})

describe("Test that the lack of a valid callback name yields an empty page", () =>{

  test("Bad callback name produces an empty page", async () => {
    render(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/callback/nonsense']}>
          <Routes>
            <Route path="/callback/:appname" element={<Callback/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.queryByText("Attempting to authorize your Nonsense account")).toBeNull();
      expect(screen.queryByText("Attempting to authorize your Twitter account")).toBeNull();
      expect(screen.queryByText("Attempting to authorize your Twitch account")).toBeNull();
      expect(mockNavigate).toBeCalledWith('/error');
    })

  })

})
