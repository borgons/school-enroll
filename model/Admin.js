const mongoose = require('mongoose');
const AdminSchema = mongoose.Schema({

   adminFirst:{
      type:String, 
      required: true,
   },

   adminLast:{
      type:String,
      required:true,
   },

   adminID:{
      type:Number,
      required:true,
      trim:true
   },

   adminPassword:{
      type: String,
      required: true
   }
})

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;