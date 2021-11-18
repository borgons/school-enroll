module.exports =  {
   PORT: process.env.PORT || 8000,
   MONGO_URI: 'mongodb://localhost:27017/schoolEnroll',
   JWT_SECRET: process.env.JWT_SECRET || 'secret1'
}