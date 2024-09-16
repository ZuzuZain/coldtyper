

# coldtyper: A touch-typing practice webapp

## Overview
coldtyper is a web application that helps users practice touch-typing by tracking words per minute (wpm) during timed rounds of 30 or 60 seconds. WPM is displayed after the round is over.


*This document is a work in progress.

## Core Features
1. User Interface
   - header with 3 buttons: "restart", "30 seconds", and "60 seconds"
   - transparent sentence or paragraph displayed in the center of the view
   - timer display showing remaining time in the round

2. Typing
   - round begins with the first valid keystroke (excluding ESC)
   - users type the displayed text until the round is complete
   - input handling to determine correct/incorrect keystrokes

3. Round Completion
   - wpm report displayed after each round
   - option to restart or choose a new round length

## SCOPE CHECK
1. User Accounts
   - allow users to log in and view their highest wpm for both 30 and 60-second modes
   - display career wpm average on the user's profile page
   - show user's average wpm for the last n rounds (number to be determined)

## Requirements
1. Word Generation
   - algorithm to generate sentences or paragraphs

2. Performance Tracking
   - real-time input validation
   - wpm calculation: (total words typed) ÷ (time in minutes)
   - timer functionality for 30 and 60-second rounds

3. State Management
   - track and update timer, text display, and user progress
   - handle transitions between pre-round, active round, and post-round states

4. Backend
   - server (node.js?)
   - database for user accounts and performance data (if implementing user accounts)
   - api endpoints for user data and high scores (if implementing user accounts)

## User Interface
1. Need
   - HTML/CSS and JavaScript
   - consider using React for state management and learning

2. Layout
   - header with round length options and restart button
   - main typing area with displayed text and input field (on the displayed text)
   - timer display
   - wpm report screen (post-round)

## Future Hope
1. Visual Feedback Mechanism
   - The user starts "cold", indicated by frozen keys on a digital keyboard display
   - Overall blue color scheme for the initial "cold" state
   - As the user types and surpasses a certain WPM threshold, the ice fades
   - Visual indication of "fire" or "heat" appears as typing speed increases
   - Bonus heat effect for correctly typing consecutive words
   - Progressive visual transition from "cold" to "hot" based on typing performance

   - A mode where words begin to freeze from left to right, rushing the user to complete words quickly to avoid being frozen to death. 

2. Executable
   - Possibly create a lightweight executable software that is mainly an overlay, allowing user to type at any time quickly
