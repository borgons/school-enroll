const express = require('express')
const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const auth = require('../middleware/auth');
const config = require('../config/config');

const router = express.Router()

router.post('/signUp', async (req, res) => {
   const { adminID, 
      adminPassword, 
      adminConfirmPassword,
      adminFirst, 
      adminLast } = req.body;

   const notMatch = adminPassword !== adminConfirmPassword

   const admIDExist = await Admin.exists({adminID: req.body.adminID})

   if(notMatch){
      return res.status(401).send({
         success: false,
         error: 'Password not match' 
      });
   }

   if(admIDExist){
      return res.status(422).send({ 
         success: false,
         error: 'Admin ID No. already exist' 
      });
   }


   // NOT YET INPUT
   const notInput = !adminID || !adminFirst || !adminLast || !adminPassword ;

   if(notInput){
      return res.status(422).send({
         success: false,
         error: 'Please enter all fields' 
      });
   }

   const admin = new Admin({
      adminID, 
      adminPassword, 
      adminFirst, 
      adminLast
   })

   //PASSWORD
   bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(admin.adminPassword, salt, async (err,hash) => {
         //Hash Password
         if(err) throw err;
         admin.adminPassword = hash;
         admin.save()
            .then(admin => {
               jwt.sign(
                  {id: admin.id},
                  config.JWT_SECRET,
                  {expiresIn:3600},
                  (err,token) => {
                     if(err) throw err;
                     res.status(200).send({
                        msg: 'You are now registered',
                        admin:{
                           id:admin.id,
                           adminID: admin.adminID,
                           adminFirst:admin.adminFirst,
                           adminLast:admin.adminLast,
                        },
                        token
                     })
                  }
               )
            })
      })
   })
})


router.post('/login', async (req, res) => {
   
   const { adminID, adminPassword } = req.body;

   const notInput = !adminID || !adminPassword;

   if(notInput){
      return res.status(422).send({
         success: false,
         error: 'Please enter all fields' 
      });
   }

   //Check for existing Admin ID
   Admin.findOne({adminID})
      .then(admin => {
         if(!admin){
            return res.status(400).send({
               success: false,
               error: 'Invalid Credentials' 
            });
         } 

         //Validate password
         bcrypt.compare(adminPassword, admin.adminPassword)
         
         .then(isMatch => {
            if(!isMatch) {
               return res.status(400).send({
                  success:false,
                  error:'Invalid Crendentials'
               })
            }
            //==== JWT ====
            jwt.sign(
               {id: admin.id},
               config.JWT_SECRET,
               {expiresIn:3600},
               (err,token) => {
                  if(err) throw err;
                  res.status(200).send({
                     msg: 'You are now login',
                     token,
                     admin:{
                        id:admin.id,
                        adminID: admin.adminID,
                        adminFirst:admin.adminFirst,
                        adminLast:admin.adminLast,
                     }
                  })
               }
            )
         })
      })
})

router.post('/logout', async (req, res) => {
   
   return res.status(200).send({
      success: true,
      msg: 'Your are now logging out', 
   });
})

router.get('/adminUser', auth, (req,res) => {
   Admin.findById(req.user.id)
   .select('-password -__v')
   .then(user=> res.json(user))
})


module.exports = router;