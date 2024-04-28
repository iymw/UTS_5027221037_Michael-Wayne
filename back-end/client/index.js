const client = require("./client");
const cors = require('cors')

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    client.getAll(null, (err, data) => {
        if (!err) res.json({ data })
    });
});

app.get('/:id', (req, res) => {
    client.get({ id: req.params.id }, (err, data) => {
        res.json({ data })
    })
});

app.post("/save", (req, res) => {
    let newFlag = {
        answer: req.body.answer,
    };

    client.insert(newFlag, (err, data) => {
        if (err) throw err;

        console.log("Flag created successfully", data);
        res.redirect("/");
    });
});

app.post("/update", (req, res) => {
    const updateFlag = { id: req.body.id, answer: req.body.answer };

    client.update(updateFlag, (err, data) => {
        try {
            if (data == undefined) {
                console.log("Your Id isn't available")
                res.json("Your Id isn't available")
                return;
            }

            console.log("Flag updated successfully", data);
            res.json({ data })
        } catch (err) { throw err }
    });
});

app.post("/remove", (req, res) => {
    const getId = req.body.id
    client.remove({ id: getId }, (err, _) => {
        try {
            console.log("Flag removed successfully");
            res.json('Id ' + getId + ' deleted successfully')
        } catch (err) { throw err }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});