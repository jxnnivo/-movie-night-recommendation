import express from 'express';
import bodyParser from 'body-parser';
import { readPosts, writePosts, updateVotes, deletePost } from './data.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;


app.use (express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const genreMap = {
    28: 'action',
    35: 'comedy',
    18: 'drama',
    27: 'horror',
    10749: 'romance',
    878: 'sci-fi',
    16: 'animation',
    12: 'adventure',
    10751: 'family',
    14: 'fantasy',
    53: 'thriller',
    80: 'crime',
    99: 'documentary',
    10752: 'war',
    37: 'western'
};

async function fetchMovieDetails(title) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${process.env.TMDB_API_KEY}`);
    const data = await response.json();
    const movie = data.results[0];
    if (!movie) {
    return { overview: '', poster: '', genre: '' };
        }
    return {
        overview: movie?.overview || '',
        poster: movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
        genre: (movie?.genre_ids || []).map(id => genreMap[id]).filter(Boolean).join(', ')
    };
}

app.get('/', async (req, res) => {
    const category = req.query.category;
    const sort = req.query.sort;

    let recommendations = await readPosts();

    if (category) {
        recommendations = recommendations.filter(post => post.genre === category);
    }
    
    if (sort === "votes") {
        recommendations.sort((a, b) => b.votes - a.votes);
    } else if (sort === "date") {
        recommendations.sort((a, b) => b.id - a.id);
    }

    res.render('index.ejs', { recommendations });
});

app.get('/search', async (req, res) => {
    const q = req.query.q;
    const allPosts = await readPosts();
    const recommendations = allPosts.filter(posts => posts.title.toLowerCase().includes(q.toLowerCase()))

    res.render('index.ejs', { recommendations });
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
            genre: movieDetails.genre,
            votes: 0,
            link: link || ''
        };
        await writePosts(newRecommendation);
        res.redirect('/');
    }
});

app.post ("/vote/:id", async (req, res) => {
    await updateVotes(Number(req.params.id));
    res.redirect('/');
});

app.post ("/delete/:id", async(req, res) => {
    await deletePost(Number(req.params.id));
    res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});