const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2'); 

const Schema = mongoose.Schema;

const enrlSchema = Schema({

   enNum:{
      type: Number, 
      required: true
   },

   enSclYear:{
      type: String,
      required: true
   },
 
   enGrade:{
      type:Number, 
      required: true
   },

   enSection:{
      type:String, 
      required: true
   },

   enDate:{
      type:Date,
      default: Date.now()
   },

   enStudent:{
      type: Schema.Types.ObjectId, 
      ref:"Student"
   }
});

enrlSchema.plugin(mongoosePagination);

const Enroll = mongoose.model('Enroll', enrlSchema)
module.exports = Enroll;