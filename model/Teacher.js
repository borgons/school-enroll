const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const tchSchema = Schema({

   tchID: {
      type: Number, 
      required: true
   },

   tchFirstName: {
      type: String,
      required: true
   },

   tchLastName: {
      type: String,
      required: true
   },

   tchStatus: {
      type: String,
      default: 'AV'
   },

   tchStudents: [{
      type: Schema.Types.ObjectId, 
      ref: "Student"
   }]

});

tchSchema.plugin(mongoosePagination);

const Teachers = mongoose.model('Teacher', tchSchema)
module.exports = Teachers;