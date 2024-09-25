const express = require('express');
const cors = require('cors');

module.exports = () => {
    const app = express();
    app.use(express.json(), cors());

    app.post('/register', (req, res) => {
        let data = req.body;
        console.log(data);
        global.registeredMembers += req.body.uuid;
        res.status(200).send("Success!");
    })

    app.get('/current', (req, res) => {
        // change to None when there is nobody/when i have started the timer
        res.status(200).send(global.currentUser);
    })

    app.listen(8080, () => {
        console.log("BallBot Backend Operational On Port 8080!")
    })
}