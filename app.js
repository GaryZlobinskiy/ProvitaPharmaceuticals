//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const request = require("request");

const app = express();



app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const emailRecipientsProvita = {
    firstName: String,
    lastName: String,
    email: String
};

const User = new mongoose.model("ProvitaEmailRecipients", emailRecipientsProvita);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/home.html");
});

app.post("/", function(req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var firstNameC = req.body.fNameC;
    var lastNameC = req.body.lNameC;
    var emailC = req.body.emailC;


    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    var options = {
        url: "https://us4.api.mailchimp.com/3.0/lists/19b0801b4d",
        method: "POST",
        headers: {
            "Authorization": "ProvitaPharm 51d1f551a09b03f1d27739268bb845d1-us4"
        },
        body: jsonData
    };

    request(options, function(error, response, body) {
        if (error) {
            res.sendFile(__dirName + "/failure.html");
        } else {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        }
    })
});
app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.post("/success", function(req, res) {
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});

//username: ProvitaPharm
//API Key: 51d1f551a09b03f1d27739268bb845d1-us4
//audience id: 19b0801b4d
