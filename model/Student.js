const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const stdSchenma = Schema({

   stdID: {
      type: Number,
      required: true
   },

   stdFirstName: {
      type: String,
      required: true
   },

   stdLastName: {
      type: String,
      required: true
   },

   stdGender: {
      type: String,
      required: true
   },

   stdStatus: {
      type: String,
      default: 'AV'
   }

});

stdSchenma.plugin(mongoosePagination);

const Student = mongoose.model('Student', stdSchenma)
module.exports = Student;