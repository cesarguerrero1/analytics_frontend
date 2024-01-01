# Analytics Website Frontend

<img width="1722" alt="Twitter_Dashboard" src="https://github.com/cesarguerrero1/analytics_frontend/assets/62967999/37bf113d-b327-4d92-9070-dc55333d1146">
<img width="1717" alt="Twitch_Dashboard" src="https://github.com/cesarguerrero1/analytics_frontend/assets/62967999/a25a7e0b-135e-4ec9-9549-323e13b18336">



## Overview
This repository contains all of the files needed to run teh frontend for the Analytics website that I created.

The purpose of the Analytics website is to shwocase an Oauth1 and Oauth2 workflow for Twitter and Twitch, respectively. The user will be able to perform a "single-click" authentication process with their login information from either of those websites. Upon successful login, a dashboard containing metrics pertaining to either Twitter or Twitch for the user will be displayed using appropriate charts and graphs.

We are using React and React-Chartjs to handle the overall UI and dashboard diagrams.


## Architecture & Design Ideas
The architecture and design ideas are as follows:
1. For this project I decided to use a MVC (Model-View-Controller) Architecture as it allows both the frontend and backend to be modular. If I decide to change the frontend framework, I can leave the backend alone and the website will still work.
2. I chose to use React as I wanted more experience developing in React and I appreciate its component-based approach to UI development
3. The frontend is currently being hosted on Netlify for ease of deployment, but it can easily be hosted on Google Cloud/AWS/DigitalOcean/Etc.
4. Netlify requires the use of Github for continuous deployment, so just like on the backend, I went a step further to establish a CI/CD pipeline using Github Actions. I used Jest to unit test the code both manually and programatically.
    - Anytime a Pull Request is made on the "main" or "develop" branch, a Github Actions workflow is automatically started and a suite of unit tests are run against the codebase before a merge can occur. Once the PR is approved on the main branch, Netlify automatically deploys the changes on the production server.
5. To ensure that the website is persistent and that data collected from the API is cached, I used Redux to enable a State Store. Furthermore, I enabled serialization and saving of the state store to prevent loss of cached data on refresh.
6. Rather than make the charts and graphs from scratch using a statistical library and CSS, I opted to use the React-ChartJS library to handle diagram creation
7. In order to develop locally and still allow the Oauth flow to work, I used the ngrok service to connect our localhost to the internet via an https tunnel. Twitter specifically requires that the callback uri be an https site, so without ngrok it would be impossible to test from a localhost.


## Testing
All of the tests can be found in the "./src/__tests__" folder and can be run using the "npm test" command. The results of the tests are outputted to the console.

Testing is handled using Jest, and as mentioned before, tests are automatically run by Github Actions when a PR is made to the "develop" or "main" branch. For each unit test I tried to isolate each component as much as I could and mocked all external APIs using Mock Server Worker (MSW) to capture axios calls and return predefined responses. Tests were also performed manually using Postman API as needed.


## How to run this program locally
1. Clone the repository
2. Install all dependencies from our package.json file: npm install
3. Download ngrok and create an https tunnel: "ngrok http --domain=ProvidedStaticURL localReactPort"
4. Verify that you have set the correct value for the following environmental variables:
    - REACT_APP_BACKEND_BASE_URL
5. Start the server: npm start
