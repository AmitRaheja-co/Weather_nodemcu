const express = require("express");
const INFO = require("./models/info");
const bodyParser = require('body-parser');
const info = require("./models/info");

const apiKey = '3701c28b1ac01a9e76bb88a56ee8201b';
// const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './');

const port = 7000;



app.get("/", async (req, res) => {
    const Info = await INFO.find({});
    if (Info.length) {
        console.log(Info);
        console.log("in get");
        console.log(Info[0].city);
        return res.render('main', { info: Info[0] });
    }
    console.log("No entry in database");
    res.render('main', {
        info: {
            city: "enter city",
            weather: "NULL"
        }
    });
});


app.post("/", async (req, res) => {
    if (!req.body.city) {
        try {
            const Info = await INFO.find({});
            if (Info.length) {
                console.log(Info);
                console.log("in get");
                console.log(Info[0].city);
                return res.render('main', { info: Info[0] });
            }
            console.log("No entry in database");
            res.render('main', {
                info: {
                    city: "enter city",
                    weather: "NULL"
                }
            });
        }
        catch (err) {
            console.log('Error in fetching info: ', err);
            return res.status(500).send('Internal Server Error');
        }
    }
    try {
        await INFO.deleteMany({}); // Delete all documents in the info collection
        console.log('Deleted all info');
        const Weather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${apiKey}&units=metric`)).json();
        console.log(Weather);
        const new_info = await INFO.create({
            city: req.body.city,
            weather: Weather.main.temp
        });
        console.log(new_info);
        console.log("changed city");
        res.render('main', { info: new_info });
    }
    catch (err) {
        console.log('Error in adding info: ', err);
        return;
    }
});

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`server is running on port: ${port}`);
});