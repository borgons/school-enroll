const express = require('express')
const Enroll = require('../model/Enroll')
const Student = require('../model/Student')

const auth = require('../middleware/auth')

const router = express.Router()

router.get('/allEnrolls', async (req,res) => {
   
   const limit = parseInt(req.query.limit, 4) || 4;
   const page = parseInt(req.query.page, 10) || 1;

   const PAGE_SIZE = 10;
   const skip = (page - 1) * PAGE_SIZE;

   const options = {
      sort:     { date: -1 },
      populate: 'enStudent',
   };

   try{

      const enNum = await Enroll.paginate(req.query.enNum ?
         {enNum: req.query.enNum} : {}, {limit,page,skip, options})
      return res.status(200).json({
         success: true,
         data: enNum
      })
   
   } catch(err){
      console.log(err);
   }

})

// router.get('/:id', async (req, res) => {
//    try{
//       const enID = await Enroll.findById(req.params.id)
//       .populate('enStudent','stdID stdFirstName stdLastName')

//       return res.status(200).json({
//          success:true,
//          data: enID
//       })
//    } catch(err){
//       console.log(err)
//    }


// })




router.get('/:enNum', auth, async (req,res) => {
   
   try {
      const enNum = await Enroll.find({ enNum: req.params.enNum });
      
      return res.status(200).json({
         success:true,
         data: enNum
      })
   } catch (err) {
      console.log(err)
   }

})


router.get('/showStd/:id', auth, async (req,res) => {
   const stdObj = await Student.findOne({ _id: req.params.id }).select("-__v")

   return res.status(200).json({
      success:true,
      data: stdObj
   })
})

router.post('/addEnrolls', async(req, res) => {

   const {
      enNum,
      enSclYear,
      enStudent,
      enGrade,
      enSection
   } = req.body;

   // NOT YET INPUT
   const notInput= !enNum || !enSclYear || !enGrade || !enSection || !enStudent;

   //NAN
   const notNumber = isNaN(enNum);

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

   let newEnroll = await new Enroll();

   newEnroll.enNum = enNum;
   newEnroll.enSclYear = enSclYear;
   newEnroll.enStudent = enStudent;
   newEnroll.enGrade = enGrade;
   newEnroll.enSection = enSection

   const enNumExist = await Enroll.exists({ enNum: req.body.enNum});

   if(enNumExist){
      return res.status(422).send({
         success: false,
         error: 'Enroll Num. already exist'
      })
   }

   newEnroll.save((err) => {
      if(err){
         console.log(err);
         return;
      } else {
         return res.status(200).send({
            success: true,
            msg: 'Enroll has been registered'
         })
      }
   })

})


router.put('/:id',   async (req,res) => {

   const updateEnroll = new Enroll({
      _id: req.params.id,
      enNum: req.body.enNum,
      enSclYear: req.body.enSclYear,
      enGrade: req.body.enGrade,
      enSection: req.body.section,
      enStudent: req.body.enStudent
   });

   console.log(updateEnroll)

   Enroll.updateOne({_id: req.params.id}, updateEnroll).then(
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

router.delete('/:enNum',   async (req,res) => {

   try {
      const searchEnrl = await Enroll.exists({enNum: req.params.enNum})

      if(searchEnrl){
         await Enroll.deleteOne({ enNum: req.params.enNum })
         return res.status(200).send({
            success: true,
            msg: 'Data has been deleted'
         })
      } else {
         return res.status(404).send({
            success: false,
            error: 'Enroll No. not found'
         })
      }
   } catch (err) {
      console.log(err);
   }

})

module.exports = router;