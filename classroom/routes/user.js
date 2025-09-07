const express = require("express");
const router = express.Router();

// this is all routes for users - related 
router.get("/", (req,res)=>{
    res.send("this is users route");
});

router.get("/:id", (req,res)=>{
    res.send("this is id route");
});

router.patch("/:id", (req,res)=>{
    res.send("patch route for update user");
});

router.delete("/:id/delete", (req,res)=>{
    res.send("delete route for delete user");
});

module.exports = router;