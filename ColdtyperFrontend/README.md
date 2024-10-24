# Coldtyper

## Overview
This project is a web application designed to test your typing abilites. Create an accout to track your WPM, accuracy, and more across tests. 

## File Structure
Below is an outline of the most important files in this project:

### `App.js`
- **Description**: This is the main entry point of the application, the Log In Screen. It sets up the routing and renders the main components.
- **Key Functions**: Initializes the app, sets up routes, and renders the main layout.

### `App.css`
- **Description**: Contains the global styles for the application.
- **Key Styles**: Defines the overall look and feel of the app, including layout, typography, and color schemes.
_______________________________________________________________________________________________________________________________________

### `MainScreen.js`
- **Description**: This component represents the main screen of the application after login where users can take the typing tests, view their account, view the leaderboard, and more
- **Key Functions**: Fetches and displays the main content, handles user interactions on the main screen.

### `MainScreen.css`
- **Description**: Contains styles specific to the `MainScreen` component.
- **Key Styles**: Styles for the layout and elements specific to the main screen.
_______________________________________________________________________________________________________________________________________

### `SignUp.js`
- **Description**: This component handles user registration.
- **Key Functions**: Provides a form for new users to sign up, validates input, and submits registration data.

### `SignUp.css`
- **Description**: Contains styles specific to the `SignUp` component.
- **Key Styles**: Styles for the sign-up form, including input fields, buttons, and error messages.
_______________________________________________________________________________________________________________________________________

### `Header.js`
- **Description**: This component renders the header of the application, including navigation links and branding.
- **Key Functions**: Displays the header of the website, and is an object to be used in other pages

### `Header.css`
- **Description**: Contains styles specific to the `Header` component.
- **Key Styles**: Styles for the header layout, navigation links, and branding elements.
_______________________________________________________________________________________________________________________________________

### `Statistics.js`
- **Description**: This component displays the users fastest WPM, highest accuracy, and total tests taken
- **Key Functions**: ^

### `Header.css`
- **Description**: Contains styles specific to the `Statistics` component.
- **Key Styles**: Styles for the Statistics layout, navigation links, and branding elements.
_______________________________________________________________________________________________________________________________________

### `Server.js`
- **Description**: This component sets up all API endpoints for the Node.js backend
- **Key Functions**: ^
_______________________________________________________________________________________________________________________________________

## Getting Started
To get started with this project, follow these steps:

1. **Clone the repository**

2. **Open project in IDE & Install Dependencies**
    2.1. Install Node.js from their website

    2.2. Within VSCode's terminal, you can run "npm install" to download Node Packet Manager

    2.3. Run "node -v" and "npm -v" to check if they are installed

3. **Set up the database**
    3.1. Download PostgreSQL from the internet and its code editor, pgAdmin (This may auto download when you install PostgreSQL)

    3.2. When you are setting up pgAdmin, you should be prompted to create a password. Remember this for later

    3.3. When you open pgAdmin, click on arrow next to Servers on the left side toolbar. This should prompt you to enter the password you set up from earlier. Entering the password will start your local instance of the database

    3.4. Right click on PostgreSQL under Servers and create a database; call it coldtyper_db

    3.5. Right click on the created database and select Query Tool. In this tool, copy and paste the CREATE TABLE querys from the createDB sql file in the ColdtyperDatabase folder. Run the querys with the run button, and this should make the tables in your local instance of the DB

    3.6. In the file Server.js within ColdtyperBackend, change the password on line 35 to the one you created earlier

4. **Run the Backend**
    4.1. Open a terminal in VSCode and naviagte to the ColdtyperBackend folder

    4.2. Run node server.js

    4.3. This will run the backend server

5. **Run the Frontend**
    5.1. Open a terminal and navigate to teh ColdtyperFrontend folder

    5.2. Run npx create-react-app yourappname if you havent already within the ColdtyperFrontend folder
    
    5.3. Run "npm start". This will run the project and open it in your default browser

6. **Create an account, sign in, and take a typing test**