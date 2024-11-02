# Meetflix Web
Welcome to the Movie Trailer Web project! This application serves as the frontend for a cinema management system, allowing users to browse movies, view trailers, and make bookings for currently showing movies. The system has distinct functionalities based on the user's role.

# Project Roles and Purpose

## Admin Role:
Admin users manage the cinema through the Admin Dashboard. Here, they can manage movie listings, screening rooms, showtimes, and more.

## User and Guest Roles:
Regular users and guests can view movie details, watch trailers, and book tickets for currently showing movies.

## Features

Movie Search: Search for movies and view detailed information.

Fetch Movies: See a list of movies: trending, top rated, show list movie available,...

Contact Page: Reach out via email with the contact form.

Order Page: order ticket through website

## Tech Stack

 React: Frontend library for building user interfaces.
 
 Tailwind CSS: Utility-first CSS framework for styling.

## Setup
To get started with this project, follow these steps:

### 1. Clone the Repository
bash
Copy code
git clone https://github.com/Marethy/Movie-Trailer.git
cd Movie-Trailer
### 2. Configure API Key
You'll need a TMDb API key to fetch movie data. Set it in a .env file at the root of the project:

VITE_API_KEY=your_tmdb_api_key_here
### 3. Install Dependencies
Run the following command to install all necessary packages:


npm install
### 4. Run the Development Server
To start the development server, use the following command:

npm run dev
### 5. Build for Production
When you're ready to build for production, use this command:

npm run build
### 6. Preview the Production Build
To preview the production build locally, use:

npm run preview
### Additional Scripts
Lint Code: Run ESLint to check for code quality and formatting issues.

npm run lint
Format Code: Automatically format code using Prettier.
npm run format
These scripts will help you set up and run the project smoothly! Let me know if there are other custom scripts you'd like to include.
