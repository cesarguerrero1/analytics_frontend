# Analytics Website Frontend

The purpose of this frontend is to showcase using React to interact with a Flask backend and display the given information.
This particular project is a simple analytics dashboard. After a user 'one-click' signs into our site, the dashboard will display
the appropriate metrics for the site they used to sign in. (Twitter, Pinterest, Etc.)

The main packages we are using are: React, Redux, and Axios

Gampeplan:
1. As a base I want to make sure that the base website appears on Netlify.
2. Once that is verified I will then start building out the base file structure and verify that everything still works on Netlify.
3. Next I will build out the login and callback page as those are the most pertinent pages. The OAuth flow needs a login page and a callback. 
4. When those pages are complete I will connect it all to the backend and test that everything is working as needed.
5. After it is clear that a user is able to verify themselves on our site, I will then start building out the dashboard.
6. As a final step I will connect the dashboard to more of the backend and display all the pertinent data. 

## How to install locally

1. On this repository go to Code > Download ZIP
2. Unzip the file in your local directory and then change into the unzipped file
3. From within this directory you want to install all dependencies: npm install
4. After that all that is left is to start the react server: npm start
