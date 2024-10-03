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

## Getting Started
To get started with this project, follow these steps:

1. **Clone the repository**

2. **Open project in IDE & Install Dependencies**
    Install Node.js from their website
    Within VSCode's terminal, you can run "npm install" to download Node Packet Manager
    Run "node -v" and "npm -v" to check if they are installed

3. **Run the application**
    Navigate to the projects folder from your terminal and run "npm start". This will run the project and open it in your default browser