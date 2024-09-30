const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const PORT = 8000;

// Middleware
app.use(
  cors({
    origin: "https://useraddressform-frontend.onrender.com",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submission
app.post("/register", (req, res) => {
  const { name, address } = req.body;

  // First, check if the user already exists
  db.get("SELECT * FROM User WHERE name = ?", [name], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (user) {
      // If user exists, check if the address exists for that user
      db.get(
        "SELECT * FROM Address WHERE user_id = ? AND address = ?",
        [user.id, address],
        (err, addr) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (addr) {
            return res
              .status(400)
              .json({ message: "This address already exists for this user." });
          }

          // Address does not exist for this user, insert the address
          db.run(
            "INSERT INTO Address (user_id, address) VALUES (?, ?)",
            [user.id, address],
            function (err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              return res.status(201).json({
                user: {
                  id: user.id,
                  name: user.name,
                  address: address,
                },
                message: "Address added successfully!",
              });
            }
          );
        }
      );
    } else {
      // User does not exist, insert the user first
      db.run("INSERT INTO User (name) VALUES (?)", [name], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const userId = this.lastID; // Get the last inserted user ID

        // Insert the address
        db.run(
          "INSERT INTO Address (user_id, address) VALUES (?, ?)",
          [userId, address],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            return res.status(201).json({
              user: {
                id: userId,
                name: name,
                address: address,
              },
              message: "User and address registered successfully!",
            });
          }
        );
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
