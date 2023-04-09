const express = require('express');
const app = express();
const juwet = require('jsonwebtoken');
const fs = require("fs");

app.use(express.json());

app.get('/getAllData', auth, function (req, res) {
   fs.readFile(__dirname + "/data/" + "teachers.json", "utf-8", function (err, data) {
      const user = JSON.parse(data);
      juwet.verify(req.token, "secret", (err, dataAuth) => {
         if (err) {
            res.sendStatus(403);
         }
         else {
            res.json(JSON.parse(data));
         }
      })
   })
});

function auth(req, res, next) {
   let getheader = req.headers['auth'];
   if (typeof getheader != undefined) {
      console.log("token granted");
      req.token = getheader;
      next();
   }
   else {
      console.log("undefined token");
      res.sendStatus(403);
   }
}

app.post("/login", async (req, res) => {
   fs.readFile(__dirname + "/data/" + "user.json", "utf-8", function (err, data) {
      const user = JSON.parse(data);
      if ((req.body.id == user[0].id || req.body.username == user[0].username)) {
         if (req.body.password == user[0].password) {
            juwet.sign(
               {
                  data: user
               },
               "secret",
               (err, token) => {
                  console.log(token);
                  res.send("Your token: " + token + "\n" + req.username);
               }
            );
         }
         else {
            res.send("Wrong Password");
         }
      }
      else {
         res.sendStatus(404);
      }
   })
})

var server = app.listen(4000, function () {
   console.log("Listening to http://localhost:" + server.address().port);
})