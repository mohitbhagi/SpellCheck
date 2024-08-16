const express = require('express');
const bodyParser = require('body-parser');
const makeSpellCheckRequest = require('./spellcheck');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/spellcheck', (req, res) => {
    const text = req.body.text;

    makeSpellCheckRequest(text, (error, data) => {
        if (error) {
            return res.status(500).json({ error: 'Spell check failed' });
        }

        const correctedText = replaceWithBestCandidate(data);
        res.json({ correctedText });
    });
});

function replaceWithBestCandidate(data) {
    let updatedText = data.original_text;

    data.corrections.forEach(correction => {
        const { text, best_candidate } = correction;
        updatedText = updatedText.replace(text, best_candidate);
    });

    return updatedText;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
