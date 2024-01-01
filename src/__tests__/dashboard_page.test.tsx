/**
 * Cesar Guerrero
 * 10/05/23
 * 
 * Testing the Twitter Dashboard
 * 
 */

import React from 'react';
import {MemoryRouter, Routes, Route, BrowserRouter} from 'react-router-dom';
import { render, cleanup, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from 'react-test-renderer'

//Redux
import {Provider} from "react-redux"
import {setupStore} from "../store"

//Mocked Server
import {rest} from 'msw'
import {setupServer} from "msw/node"

//Components
import Dashboard from '../components/dashboard';
import { selectedApp } from '../reducers/users-reducer';

//Setup our Base Server
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const handlers = [
  rest.get(`${BASE_URL}/logout`, (request, response, context) => {
    return response(context.status(200))
  }),
  //Twitter
  rest.get(`${BASE_URL}/dashboard/twitter/users`, (request,response,context) => {
    return response(context.json(
      {"created_at":"2013-12-14",
      "followers_count":5,
      "following_count":10,
      "profile_image_url":"url-goes-here",
      "status_code":200,
      "status_message":"OK",
      "tweet_count":30,
      "username":"TestUser"
      }
    ))
  }),
  //Twitch
  rest.get(`${BASE_URL}/dashboard/twitch/users`, (request, response, context) => {
    return response(context.json(
      {"created_at":"2016-12-14",
      "profile_image_url":"twitch-url-goes-here",
      "status_code":200,
      "status_message":"OK",
      "twitch_id":"123123",
      "username":"my-username"
      }
    ))
  }),
  rest.get(`${BASE_URL}/dashboard/twitch/bits`, (request, response, context) => {
    return response(context.json(
      {"bits_array":[["TundraCowboy",12543],["Topramens",6900]],
      "status_code":200,
      "status_message":"OK"
      }
    ))
  }),
  rest.get(`${BASE_URL}/dashboard/twitch/followers`,  (request, response, context) => {
    return response(context.json(
      {"followers":8,
      "status_code":200,
      "status_message":"OK"
      }
    ))
  }),
  rest.get(`${BASE_URL}/dashboard/twitch/subscribers`, (request, response, context) => {
    return response(context.json(
      {"status_code":200,
      "status_message":"OK",
      "subscriber_points":12390,
      "subscriber_tiers_array":[0,1,1],
      "subscribers":2340
      }
    ))
  }),
  rest.get(`${BASE_URL}/dashboard/twitch/videos`, (request, response, context) => {
    return response(context.json(
      {"status_code":200,
      "status_message":"OK",
      "video_array":[[1863062,"3m21s"],[2343062,"5m05s"]]
      }
    ))
  })
];

const server = setupServer(...handlers)

//Mocking useNavigate()
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockNavigate,
}))

//Mocking all of our ChartJS Elements
jest.mock("../components/dashboard/twitter/impressions_line_graph", () => () => {
  return <></>
})
jest.mock("../components/dashboard/twitter/impressions_likes_scatter", () => () => {
  return <></>
})
jest.mock("../components/dashboard/twitter/likes_replies_retweets_line_graph", () => () => {
  return <></>
})
jest.mock("../components/dashboard/twitter/pctr_bar_graph", () => () => {
  return <></>
})
jest.mock("../components/dashboard/twitch/bits_bar_graph", () => () => {
  return <></>
})
jest.mock("../components/dashboard/twitch/subscribers_pie_chart", () => () => {
  return <></>
})
jest.mock("../components/dashboard/twitch/video_line_graph", () => () => {
  return <></>
})

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

describe("Testing Redirects", () => {
  
  test("Redirect user if they are not logged in", async () => {
    render(
      <Provider store={setupStore({users:{loggedIn:false}})}>
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

  test("Do not redirect user if they are logged in", async () => {
    render(
      <Provider store={setupStore({users:{loggedIn:true}})}>
        <BrowserRouter>
          <Dashboard/>
        </BrowserRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(mockNavigate).toBeCalledTimes(0);
    })

  })

  test("Click logout button on Twitter Dashboard", async () => {
    render(
      <Provider store={setupStore({users:{loggedIn:true, app:selectedApp.TWITTER}})}>
        <BrowserRouter>
          <Dashboard/>
        </BrowserRouter>
      </Provider>
    )

    fireEvent.click(screen.getByText("Logout"))

    await waitFor(() => {
      expect(mockNavigate).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledWith('/login');
    })

  })


  test("Click logout button on Twitch Dashboard", async () => {
    render(
      <Provider store={setupStore({users:{loggedIn:true, app:selectedApp.TWITCH}})}>
        <BrowserRouter>
          <Dashboard/>
        </BrowserRouter>
      </Provider>
    )

    fireEvent.click(screen.getByText("Logout"))

    await waitFor(() => {
      expect(mockNavigate).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledWith('/login');
    })

  })

})

describe("Testing Twitter Dashboard Page", () => {

  test("Testing that our Twitter API calls work", async () => {
    render(
      <Provider store={setupStore({users:{loggedIn:true, app:selectedApp.TWITTER}})}>
        <BrowserRouter>
          <Dashboard/>
        </BrowserRouter>
      </Provider>
    )
  
    await waitFor(() => {
      expect(screen.getByText("TestUser's Twitter Dashboard")).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute("src", "url-goes-here"); //Image Src
      expect(screen.getByText("2013-12-14")).toBeInTheDocument(); //Creation Date
      expect(screen.getByText("30")).toBeInTheDocument(); //30 Tweets
      expect(screen.getByText("10")).toBeInTheDocument(); //10 Followers
      expect(screen.getByText("5")).toBeInTheDocument(); //5 Following
    })

  })


  test("Testing that nothing shows if Twitter API Calls fail ", async () => {
    server.use(
      rest.get(`${BASE_URL}/dashboard/twitter/users`, (request,response,context) => {
        return response(context.status(400))
      })
    )
    
    render(
      <Provider store={setupStore({users:{loggedIn:true, app:selectedApp.TWITTER}})}>
        <BrowserRouter>
          <Dashboard/>
        </BrowserRouter>
      </Provider>
    )
  
    await waitFor(() => {
      expect(screen.getByText("Twitter Dashboard")).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute("src", "/images/twitterx_logo.jpeg"); //Image Src
      expect(screen.queryByText("2013-12-14")).toBeNull; //Creation Date
      expect(screen.getAllByText("0")).toHaveLength(3)
    })
    
  })

})

describe("Testing Twitch Dashboard Page", () => {

  test("Testing that our Twitch API calls work", async () => {
    render(
      <Provider store={setupStore({users:{loggedIn:true, app:selectedApp.TWITCH}})}>
        <BrowserRouter>
          <Dashboard/>
        </BrowserRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText("my-username's Twitch Dashboard")).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute("src", "twitch-url-goes-here"); //Image Src
      expect(screen.getByText("2016-12-14")).toBeInTheDocument(); //Creation Date
      expect(screen.getByText("2340")).toBeInTheDocument(); //2340 Subs
      expect(screen.getByText("12390")).toBeInTheDocument(); //12390 Sub Points
      expect(screen.getByText("8")).toBeInTheDocument(); //8 FOllowers
    })

  })

  test("Testing that nothing shows if Twitch API Calls fail", async () => {

    server.use(
      rest.get(`${BASE_URL}/dashboard/twitch/users`, (request,response,context) => {
        return response(
          context.status(200),
          context.json({"status_code":400})
          )
      }),
      rest.get(`${BASE_URL}/dashboard/twitch/bits`, (request, response, context) => {
        return response(context.status(400))
      }),
      rest.get(`${BASE_URL}/dashboard/twitch/followers`, (request, response, context) => {
        return response(context.status(400))
      }),
      rest.get(`${BASE_URL}/dashboard/twitch/subscribers`, (request, response, context) => {
        return response(context.status(400))
      }),
      rest.get(`${BASE_URL}/dashboard/twitch/videos`, (request, response, context) => {
        return response(context.status(400))
      })
    )

    render(
      <Provider store={setupStore({users:{loggedIn:true, app:selectedApp.TWITCH}})}>
        <BrowserRouter>
          <Dashboard/>
        </BrowserRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText("Twitch Dashboard")).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute("src", "/images/twitch_logo.jpeg"); //Image Src
      expect(screen.getAllByText("0")).toHaveLength(3)
      expect(screen.getAllByText("Loading Data...")).toHaveLength(3)
    })

  })

})
