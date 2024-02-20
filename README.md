# Spotify App Clone - Scope Document

## Project Overview
The Spotify Clone App is designed to replicate the core functionalities of the widely popular music streaming service, Spotify. This application aims to provide users with the ability to discover, listen to and explore an extensive library of songs.

## Project Objectives
### 1.User Authentication and Registration
- Allow users to securely register and log in.
- Implement authentication mechanisms to ensure user data privacy and security.

### 2.Music Catalog
- Integrate with a comprehensive music database to offer a diverse selection of songs.
- Enable users to search for songs.

### 3.Music Playback
- Implement a robust player for seamless song playback.
- Offer basic playback controls such as play, pause, skip, and volume adjustment.

### 4.Security
- Employ secure practices for the storage and transmission of user data.
- Implement measures to protect against common web vulnerabilities to ensure a secure user experience.

## Technologies Used
- ### Front End : EJS, CSS, JavaScript
- ### Backend : Node.js, Express
- ### Database : MongoDB

## Setting up .env file
- ### AWS S3 Configuration
AWS_REGION=your region
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

- ### MongoDB Configuration
MONGO_URL=mongodb+srv://admin:password@cluster0.arlyich.mongodb.net/databasename?retryWrites=true&w=majority

- ### JWT Secret Key
JWT_SECRET=your_secret_key

## Getting Started
To run the Spotify Clone App locally, follow these steps:

1. Clone the repository - git clone <repository-url>

2. Install dependencies - npm install

3. Set up the MongoDB database and configure the connection in the app.

4. Start the application - npm start

5. Access the app in your browser at http://localhost:3001
