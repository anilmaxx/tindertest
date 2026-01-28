const mongoose = require('mongoose');

const connectdb = async () =>{
   mongoose.connect('mongodb+srv://AnilMaxy:AnilANIL@cluster0.ojup7dp.mongodb.net/devTnder');
}
module.exports = connectdb;



