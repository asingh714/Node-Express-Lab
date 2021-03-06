const express = require("express");

const db = require("../data/db");

const router = express.Router();

// GET POSTS
router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// GET POSTS w/ Specific ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "The post with the specified ID does not exist."
      });
    });
});

// POST
router.post("/", (req, res) => {
  const post = req.body;

  if (!post.title && !post.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert(post)
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

// PUT
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.findById(id).then(post => {
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
    if (!changes.title && !changes.contents) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      });
    }

    db.update(id, changes)
      .then(result => {
        res.status(200).json({ result });
      })
      .catch(error => {
        res.status(500).json({
          error: "The post information could not be modified."
        });
      });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(post => {
      if (post) {
        db.remove(id).then(deleted => {
          res.status(200).json(post);
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "The post could not be removed"
      });
    });
});

module.exports = router;
