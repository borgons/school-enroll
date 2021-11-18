const express = require('express');
const Student = require('../model/Student');

const auth = require('../middleware/auth');

const router = express.Router()


router.get('/allStudents', async (req,res) => {

   const limit = parseInt(req.query.limit, 4) || 4;
   const page = parseInt(req.query.page, 10) || 1;
   
   const PAGE_SIZE = 10;
   const skip = (page - 1) * PAGE_SIZE;

   try {
       //studentQuery =  req.query.stdID ? {stdID: req.query.stdID} : {}
      const stdID = await Student.paginate(req.query.stdID ? {stdID: req.query.stdID} : {}, {limit, page, skip}) 

      return res.status(200).json({
         success: true,
         data: stdID
      })

   } catch (err) {
      console.log(err);
   }

});

router.get('/:stdID', async (req,res) => {
   
   try {
      const stdID = await Student.find({ stdID: req.params.stdID });
      
      return res.status(200).json({
         success:true,
         data: stdID 
      })
   } catch (err) {
      console.log(err)
   }

})

router.post('/addStudents',  async(req, res) => {

   const { stdID, 
      stdFirstName, 
      stdLastName, 
      stdGender, 
      } = req.body;

   // NOT YET INPUT
   const notInput = !stdID || !stdFirstName || !stdLastName || !stdGender;
   
   // NAN
   const notNumber = isNaN(stdID);

   if(notInput){
      return res.status(422).send({
         success: false,
         error: 'Please enter all fields' 
      });
   }
   if(notNumber){
      return res.status(422).send({ 
         success: false,
         error: 'This field must be number only' 
      });
   }
   
   let newStudent = await new Student();

   newStudent.stdID = stdID;
   newStudent.stdFirstName = stdFirstName;
   newStudent.stdLastName = stdLastName;
   newStudent.stdGender = stdGender;

 
   const stdIDExist = await Student.exists({stdID: req.body.stdID})

   if(stdIDExist){
      return res.status(422).send({ 
         success: false,
         error: 'Student ID No. already exist' 
      });
   }

   newStudent.save((err) => {
      if(err){
         console.log(err);
         return;
      } else {
         return res.status(200).send({ 
            success: true,
            msg: 'Student has been registered' 
         });
      }
   })
});

router.put('/:id',   async (req, res) => {

   //OK
   const updateStudent = new Student({
      _id: req.params.id,
      stdID: req.body.stdID,
      stdFirstName: req.body.stdFirstName,
      stdLastName: req.body.stdLastName,
      stdGender: req.body.stdGender,
   });

   console.log(updateStudent)

   Student.updateOne({_id: req.params.id}, updateStudent).then(
      () => {
         res.status(200).send({ 
            success: true,
            msg: 'Data has been edited' 
         });
      }
   ).catch(
      (error) => {
         res.status(400).json({
         error: error
         });
      }
   );

})

router.delete('/:stdID',  async (req,res) => {

   try {
      const searchStd = await Student.exists({ stdID: req.params.stdID})
      
      if(searchStd){
         await Student.deleteOne({ stdID: req.params.stdID })
         return res.status(200).send({ 
            success: true,
            msg: 'Data has been deleted'
         });
      } else {
         return res.status(404).send({ 
            success: false,
            error: 'Student ID not found' 
         });
      }
         
   } catch (err) {
      console.log(err);
   }

})





















module.exports = router;