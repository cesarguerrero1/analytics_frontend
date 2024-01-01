/**
 * Cesar Guerrero
 * 09/08/23
 * 
 * Testing 404 Error Page
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup, waitFor, screen, fireEvent } from '@testing-library/react';

//Redux
import { Provider } from "react-redux"
import { setupStore } from '../store';

//Components
import Error from "../components/other/error";

//Mocking useNavigate()
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockNavigate
}))

afterEach(() => {
  cleanup();
})

describe("Error Page Tests", () => {

  test('Test that when you click the "Return Home" button it redirects you to the root page', async () => {
    render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <Error/>
        </BrowserRouter>
      </Provider>
    )
  
    await waitFor(() => {
      //Check that our page loads
      expect(screen.getByText("Oops! Nothing to see here!")).toBeInTheDocument();
  
      fireEvent.click(screen.getByText('Return Home'))
  
      expect(mockNavigate).toBeCalledWith("/")
  
    })

  })

})
