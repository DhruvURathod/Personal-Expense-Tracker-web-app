const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');

const {

    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction
} = require("../Controllers/transactionController");

router.get("/", auth,getTransaction);
router.post("/",auth,addTransaction);
router.delete("/:id",auth,deleteTransaction);
router.put("/:id",auth,updateTransaction);

module.exports = router;