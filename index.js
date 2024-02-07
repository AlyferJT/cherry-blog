import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const date = new Date();
let postCount = fs.readFileSync('postqtd.json', 'utf-8', (err) => {});
const actualDate = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    postCount = fs.readFileSync('postqtd.json', 'utf-8', (err) => {});
    res.render('index.ejs', {postCount: postCount -1})
});

app.get('/create', (req, res) => {
    
    res.render('create.ejs')
});

app.post('/createpost', (req, res) => {
    let formData = req.body;
    let author = formData['authorName'];
    let title = formData['postTitle'];
    let text = formData['postText'];

    let message = (`
    <body>
        <main class=postbox>
            <h2 class=post-title> <a href=/p${postCount}>${title}</a> </h1>
            <p class=post-text>${text}</p>
            <p class=post-author>${author} - <span class=postDate>${actualDate}</span></p>
        </main>
    </body>
    `)

    fs.writeFile(`./views/posts/post${postCount}.ejs`, message, (err) => {})
    fs.writeFileSync('postqtd.json', `${parseInt(postCount) + 1}`, (err) => {})

    res.redirect('/')
});


for (let i = 0; i <= postCount; i++) {
    
    app.get(`/p${i}`, (req, res) => {
        res.render(`./posts/post${i}.ejs`)
    });
};


app.listen(port, () => {
    console.log(`The server is running on port ${port}`)
});

teste