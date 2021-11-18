const express = require('express')

const Teacher = require('../model/Teacher')
const Student = require('../model/Student')

const auth = require('../middleware/auth')

const router = express.Router()

router.get('/allTeachers', async (req,res) => {

   const limit = parseInt(req.query.limit, 4) || 4;
   const page = parseInt(req.query.page, 10) || 1;

   const PAGE_SIZE = 10;
   const skip = (page - 1) * PAGE_SIZE;
   
   const options = {
      populate: 'tchStudents',
   };

   try {

      const tchID = await Teacher.paginate(req.query.tchID ? {tchID: req.query.tchID} : {}, {limit, page, skip, options})

      return res.status(200).json({
         success: true,
         data: tchID
      })

   } catch(err){
      console.log(err);
   }

})

router.get('/:tchID', async (req,res) => {
   
   try {
      const tchID = await Teacher.find({ tchID: req.params.tchID });
      
      return res.status(200).json({
         success:true,
         data: tchID
      })
   } catch (err) {
      console.log(err)
   }
})


router.get('/showStd/:id', auth, async (req,res) => {
   const stdObj = await Student.findOne({ _id: req.params.id })
   .select("-__v  -stdGender -stdSection")

   return res.status(200).json({
      success:true,
      data: stdObj
   })
});
 
router.post('/addTeachers',  async(req,res) => {

   const { 
      tchID, 
      tchFirstName, 
      tchLastName, 
   } = req.body;

   //NOT YET INPUT
   const notInput = !tchID || !tchFirstName || !tchLastName;

   // NAN
   const notNumber = isNaN(tchID);

   if(notInput){
      return res.status(422).send({
         success: false, 
         error: 'Please enter all fields'
      });
   }

   if(notNumber){
      return res.status(422).send({
         success:true,
         error: 'This field must be number only'
      });
   }

   let newTeacher = await new Teacher();

   newTeacher.tchID = tchID;
   newTeacher.tchFirstName = tchFirstName;
   newTeacher.tchLastName = tchLastName;

   const tchIDExist = await Teacher.exists({tchID: req.body.tchID})

   if(tchIDExist){
      return res.status(422).send({
         success: false, 
         error: 'Teachers ID No. already exist'
      })
   } 

   newTeacher.save((err) => {
      if(err){
         console.log(err);
         return;
      } else {
         return res.status(200).send({
            success: true,
            msg:'Teacher has been registered',
            newTeacher
         })
      }
   })

});

router.put('/:id',   async (req,res) => {
   
   //OK
   const updateTeacher =  new Teacher({
      _id: req.params.id,
      tchID: req.body.tchID, 
      tchFirstName: req.body.tchFirstName, 
      tchLastName: req.body.tchLastName
   })

   console.log(updateTeacher)

   Teacher.updateOne({_id: req.params.id}, updateTeacher).then(
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

router.delete('/:tchID',  async (req,res) => {

   try{
      const searchTch = await Teacher.exists({ tchID: req.params.tchID})

      if(searchTch){
         await Teacher.deleteOne({ tchID : req.params.tchID })
         return res.status(200).send({
            success: true,
            msg: 'Data has been deleted'
         });
      } else {
         return res.status(404).send({
            success: false,
            error: 'Teacher ID not found'
         });
      }
   } catch (err) {
      console.log(err);
   }

})

router.put('/assignAddStudents/:tchID', async (req,res) => {
   
   try {
      const { 
         tchStudents
      } = req.body;
   
      // NOT YET INPUT
      const notInput = !tchStudents;

      if(notInput){
         return res.status(422).send({
            success:false,
            error: 'Please type for confirmation'
         })
      }

      const searchTch = await Teacher.findOne({ tchID: req.params.tchID })

      if(!searchTch){

         return res.status(404).send({
            success: false,
            error: 'Teacher ID not found'
         });
         
      } else {

         const tchStdIDExist = await Teacher.exists({tchStudents: req.body.tchStudents})

         if(tchStdIDExist){
            return res.status(422).send({
               success: false, 
               error: 'Student ID No. already exist'
            })
         } else { 

            let query = { tchID: req.params.tchID }
            let assignedStudentObjID = {$push:{tchStudents: req.body.tchStudents }}

            Teacher.updateOne(query, assignedStudentObjID ,() => {
               try{
                  return res.status(200).send({
                     success: true,
                     msg: 'Student ID has been assigned' 
                  });
               } catch(err) {
                  console.log(err);
                  return res.status(404).send({
                     success: false,
                     error: 'Teacher ID not found'
                  })
               }
            }) 


         }







         
      }

   } catch (err) {
      console.log(err)
   }
})

router.put('/assignRemoveStudents/:tchID', async (req,res) => {
   try {

      const { 
         tchStudents
      } = req.body;
   
      // NOT YET INPUT
      const notInput = !tchStudents;

      if(notInput){
         return res.status(422).send({
            success:false,
            error: 'Please type for confirmation'
         })
      }

      const searchTch = await Teacher.findOne({ tchID: req.params.tchID })

      if(!searchTch){
         return res.status(404).send({
            success: false,
            error: 'Teacher ID not found'
         });
      } else {

         let query = { tchID: req.params.tchID }
         let assignedStudentObjID = {$pull:{"tchStudents": req.body.tchStudents }}

         Teacher.updateOne(query, assignedStudentObjID ,() => {
            try{
               return res.status(200).send({
                  success: true,
                  msg: 'Student ID has been removed' 
               });
            } catch(err) {
               console.log(err);
               return res.status(404).send({
                  success: false,
                  error: 'Teacher ID not found'
               })
            }
         }) 
      }

   } catch (err) {
      console.log(err)
   }

})







module.exports = router;