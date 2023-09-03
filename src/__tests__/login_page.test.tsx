/**
 * Cesar Guerrero
 * 09/01/23
 * 
 * Testing Login Page
 */

import React from 'react';
import { render, screen, cleanup} from '@testing-library/react';
import renderer from 'react-test-renderer';
import Login from "../components/login/index"

/**
 * After each test cleanup any lingering items
 */
afterEach( () => {
  cleanup();
})


test('Github Test', () => {
  expect(true).toBe(true)
})


