const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const config = require("./config/db.config");



const tasks = require("./app/routes/task.route");
app.use("/api/v1", tasks);

const users = require("./app/routes/user.route")
app.use("/api/v1", users)




// Connecting to the database
mongoose.connect(config.url, {
    useNewUrlParser: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

