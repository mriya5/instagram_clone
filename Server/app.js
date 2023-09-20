const express= require('express')
const app= express()     // to invoke the express
const mongoose= require('mongoose')
const PORT= process.env.PORT|| 5000
const{ MONGOURI }= require('../config/keys')

// require('./models/user')

// app.use(express.json())
// app.use(require('./routes/auth'))

mongoose.connect(MONGOURI,{family:4})
mongoose.connection.on('connected',()=>{
    console.log('Connected to mongo yeahh')
})

mongoose.connection.on('error',(err)=>{
    console.log('error connecting', err)
})

// just a "Hello world" program of node.js

// const customMiddleware= (req,res,next)=>{
//     console.log('Middleware Executed!!')
//     next()     // this next is to stop middleware and execute the next middleware or execute the code further
// }
// // app.use(customMiddleware)    // middleware takes the incoming request and modifies it before reaching to the actual route handler
// app.get('/home', (req,res)=> {
//     console.log("home")
//     res.send("Hello World")
// })
// app.get('/about',customMiddleware, (req,res)=> {
//     console.log("about")
//     res.send("About Page")
// })
require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){    // if we are in production site
    app.use(express.static('client/build'))   // then we'll server the static file (i,e css and html) which is inside the build folder
    const path= require('path')   // we require the path module
    app.get("*",(req,res)=>{   // if client will be making any request 
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))  // then we'll send index.html(it contains our entire react application) file which is inside build folder
    })
}

app.listen(PORT,()=>{
    console.log('Server is running on',PORT) 
})