import express from 'express';
import bodyParser from 'body-parser';
import { readPosts, writePosts } from './data.js';

const app = express();
const port = process.env.PORT || 3000;

let recommendations = readPosts();

app.use (express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

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
    
    const searchResults = recommendations.filter(posts => posts.title.toLowerCase().includes(q.toLowerCase()))

    res.render('index.ejs', {
        recommendations: searchResults
    });
});

app.get('/submit', (req, res) => {
    res.render('submit.ejs');
});

app.post('/submit', (req, res) => {
    const { title, description, genre, link } = req.body;
    if (title === "") {
        res.redirect('/submit');
    } else {
        const newRecommendation = {
            id: Date.now(),
            title,
            description,
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