const transaction = require("../Models/Transaction");

exports.getTransaction = async (req,res) =>{
     try{

        const txns = await transaction.find({userId : req.user.id});
        res.json(txns);

    }
    catch(error){

        res.status(500).json({msg : "Server Error"});
    }

};

exports.addTransaction = async (req, res) => {
  try {
    console.log("Incoming Body:", req.body);
    console.log("User from Token:", req.user);

    const txn = new transaction({ ...req.body, userId: req.user.id });
    await txn.save();
    res.status(201).json(txn);
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
  };

exports.deleteTransaction = async (req, res) => {
    try {
      const txn = await transaction.findOneAndDelete({
        userId: req.user.id
      });

      if (!txn) return res.status(404).json({ msg: 'Transaction not found' });
      res.sendStatus(204);

    } 
    catch (error) {
        
      res.status(500).json({ msg: 'Server error' });
    }
  };


  exports.updateTransaction = async (req, res) => {
    try {
      const txn = await transaction.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id }, // Match by ID + user
        req.body,
        { new: true }
      );
  
      if (!txn) return res.status(404).json({ msg: "Transaction not found" });
  
      res.json(txn);
    } catch (error) {
      console.error("Update error:", error); // log for debugging
      res.status(500).json({ msg: "Server error" });
    }
  };
  



