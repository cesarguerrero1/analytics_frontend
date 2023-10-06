# Analytics Website Frontend

The purpose of this frontend is to showcase using React to interact with a Flask backend and display the given information. This particular project is a simple analytics dashboard. After a user 'one-click' signs into our site, the dashboard will display the appropriate metrics for the site they used to sign in. Currently we have Twitter and Twitch but I plan to add TikTok in the future.

Architecture Patterns: MVCS (Model-View-Service-Controller)

## Plan:
1. As a base I want to make sure that the base website appears on Netlify as is. 
2. Once that is verified I will then start building out the base file structure and verify that everything still works on Netlify.
3. Next I will start building out the Login in callback pages as those are the most pertinent pages. The OAuth flow needs a login page and a callback.
4. I will then start making our website persistent by using Redux to enable a State Store.
5. With Redux enabled I will then start plumbing the site to the backend and use Redux Thunks to update the store as needed. 
6. As I work on the above I will be using JEST and Mock Service Worker (MSW) to unit test the applicaiton
    a. In conunction with the unit tests, I will be using Github Actions to establish a CI/CD pipeline between my application and the Netlify Server where the application is being deployed. 
7. Once it is clear that the front and backend are talking to each other and we have completed the OAuth flows for both Twitter and Twitch, I will then start building out the dashboard. 
    a. I will be utilizing React-ChartJS to handle displaying the data payloads appropriately 
8. The above is the core of the website but in the future I will be adding a "Contact Us" page to allow users to request new features  or report bugs.

## How to install locally

1. On this repository go to Code > Download ZIP
2. Unzip the file in your local directory and then change into the unzipped file
3. From within this directory you want to install all dependencies: npm install
4. After that all that is left is to start the react server: npm start
5. Be sure to update your environment variables to match the requirements within the code
NOTE: In order to test locally, you will also have to use the Ngrok servie to tunnel an https address to your localhost address. This is a necessary step as some APIs (Twitter) will only interact with https addresses. 
