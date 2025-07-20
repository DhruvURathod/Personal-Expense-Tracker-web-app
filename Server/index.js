const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const transactionRoutes = require("./Routes/transaction");
const authRoutes = require("./Routes/auth");

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
}

main()
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));



 app.use('/api/transactions', transactionRoutes);
 app.use('/api/auth', authRoutes);

 app.listen(5000, () => console.log("Server running on port 5000"));