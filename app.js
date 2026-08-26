import express from 'express';
import bodyParser from 'body-parser';
import { readPosts, writePosts } from './data.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

let recommendations = readPosts();

app.use (express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

async function fetchMovieDetails(title) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${process.env.TMDB_API_KEY}`);
    const data = await response.json();
    const movie = data.results[0];
    return {
        overview: movie?.overview || '',
        poster: movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''
    };
}

app.get('/', (req, res) => {
    const category = req.query.category;
    const sort = req.query.sort;

    let filteredRecommendations;
    if (category) {
        filteredRecommendations = recommendations.filter(post => post.genre === category);
    } else {
        filteredRecommendations = recommendations;
    }
    
    if (sort === "votes") {
        filteredRecommendations.sort((a, b) => b.votes - a.votes);
    } else if (sort === "date") {
        filteredRecommendations.sort((a, b) => b.id - a.id);
    }

    res.render('index.ejs', {
        recommendations: filteredRecommendations
    });
});

app.get('/search', (req, res) => {
    const q = req.query.q;
    const searchResults = recommendations.filter(posts => posts.title.toLowerCase().includes(q.toLowerCase()))

    res.render('index.ejs', {
        recommendations: searchResults
    });
});

app.get('/submit', (req, res) => {
    res.render('submit.ejs');
});

app.post('/submit', async (req, res) => {
    const { title, description, genre, link } = req.body;
    if (title === "") {
        res.redirect('/submit');
    } else {
        const movieDetails = await fetchMovieDetails(title);
        const newRecommendation = {
            id: Date.now(),
            title,
            description: movieDetails.overview,
            poster: movieDetails.poster,
            votes: 0,
            genre,
            link
        };
        recommendations.push(newRecommendation);
        writePosts(recommendations);
        res.redirect('/');
    }
});

app.post ("/vote/:id", (req, res) => {
    const post = recommendations.find(post => post.id === Number(req.params.id));
    if (post) {
        post.votes += 1;
        writePosts(recommendations);
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

app.post ("/delete/:id", (req, res) => {
    recommendations = recommendations.filter(post => post.id !== Number(req.params.id));
    writePosts(recommendations);
    res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});