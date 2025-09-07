const express = require("express");
const router = express.Router();

// now this all routes for posts - related

router.get("/", (req,res)=>{
    res.send("this is post route");
});

router.get("/:id", (req,res)=>{
    res.send("this is id route");
});

router.patch("/:id", (req,res)=>{
    res.send("patch route for update post");
});

router.delete("/:id/delete", (req,res)=>{
    res.send("delete route for delete post");
});

module.exports = router;