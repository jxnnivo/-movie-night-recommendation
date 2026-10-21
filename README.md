# Movie Night Recommendation

Movie Night Recommendation is a full-stack web app where users can submit, browse, and vote on movie recommendations. I built it so my partner, a huge movie fanatic, could easily recommend films 
for our next watch night, and so our friends could join in too and encourage me to watch more movies, all while practicing full-stack development with Node.js and Express along the way.
<img width="1902" height="908" alt="Screenshot 2026-08-26 151055" src="https://github.com/user-attachments/assets/18a3b35b-9a7b-493b-b59b-5c2d20b16dfa" />

## Tech Stack
- Node.js
- Express
- EJS
- JSON file for data storage
- CSS (Grid, media queries, animations)
- TMDB API (movie posters, descriptions, and genres)
- Deployed on Render

## Live Demo
https://movie-night-recommendation.onrender.com

## Getting Started Locally
1. Clone the repo: `git clone https://github.com/jxnnivo/-movie-night-recommendation.git`
2. Install dependencies: `npm install`
3. Run the server: `node app.js`
4. Visit `http://localhost:3000` in your local browser

## What's Next
- Migrate from a flat JSON file to a real database (MongoDB or SQLite) for more reliable, scalable data storage
- Add user accounts and sessions so people can manage their own submissions
- Implement persistent double-vote prevention using localStorage or server-side sessions
- Add multi-genre filtering (currently filters by one genre at a time)
