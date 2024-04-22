const { default: axios } = require("axios");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();
const port = 5000;

const app = express();
app.use(express.json());
app.use(cors());

//let conn = null
// const initMySQL = async () => {
//   //conn = mysql.createConnection({
//   const connection = mysql.createConnection({
//     host: process.env.DB_HOST || 'http://localhost:3000', // หรือใส่เป็น localhost ก็ได้
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD, //password: 'root',
//     database: process.env.DB_DATABASE, //database: 'tutorial'
//   });

//   connection.connect((err) => {
//     if (err) {
//       console.log("Error connecting to MySQL database = ", err);
//       return;
//     }
//     console.log("MySQL successfully connected!");
//   });
// };

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', // หรือใส่เป็น localhost ก็ได้
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, //password: 'root',
    database: process.env.DB_DATABASE, //database: 'tutorial'
});


//create routes
app.post("/create", async (req, res) => {
  const { name, date, time } = req.body;

  try {
    connection.query(
      "INSERT INTO stc_base(fullname, date, time) VALUES(?, ?, ?)",
      [name, date, time],
      (err, results, fields) => {
        if (err) {
          console.log("Err while inserting a user into the database", err);
          return res.status(400).send();
        }
        return res
          .status(201)
          .json({ message: "New user successfully created!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//read
app.get("/users", async (req, res) => {
  try {
    connection.query("SELECT * FROM stc_base", async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      const request =
        "ID :" +
        results[0].id +
        "                User :" +
        results[0].fullname +
        "                   Date :" +
        results[0].date +
        "                    Time :" +
        results[0].time;
      await line(request);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
  // res.send('test');
});

// app.get('/users', (req, res) => {
//   // Query to select all users from the database
//   const sql = 'SELECT * FROM stc_base';

//   // Execute the query
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).json({ error: 'Error retrieving data from database' });
//     }

//     // Send the results as a JSON response
//     res.json(results);
//   });
// });

//read single users from db
app.get("/user/single/:id", async (req, res) => {
  const id = req.params.id;
  const newFullname = req.body.newFullname;
  console.log("string");
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM stc_base WHERE id = ?",
        [id],
        (err, results, fields) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    console.log("รวยมาก", results[0]);
    const request =
      "คุณ :" + results[0].fullname + "     วันที่ :" + results[0].date;
    await line(request);
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//update db
app.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const newFullname = req.body.newFullname;

  try {
    connection.query(
      "UPDATE stc_base SET password = ? WHERE id =?",
      [newFullname, id],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json({ massage: "User Name updated successfully!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//Delete
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    connection.query(
      "DELETE FROM stc_base WHERE id = ?",
      [id],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ massage: "No user with that ID!" });
        }
        return res.status(200).json({ massage: "User deleted successfully!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

async function line(payload) {
  try {
    console.log("UWU", payload);
    const apiUrl = "https://notify-api.line.me/api/notify";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer Pp6CqvSF7GWZi8ehWg7yjhqofl8i8ubWM0nLqpWOBFQ",
    };
    const data = {
      message: payload,
    };
    const response = await axios.post(apiUrl, data, { headers });

    console.log(response);
  } catch (err) {
    console.error(err);
    // Handle error appropriately
  }
}

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
});
