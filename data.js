import fs from 'fs';

export function readPosts() {
    const data = fs.readFileSync('./data/posts.json', 'utf8');
    return JSON.parse(data);
};

export function writePosts(posts) {
    fs.writeFileSync('data/posts.json', JSON.stringify(posts));
};