// module external imports
const express = require('express')
const dotenv = require('dotenv')
const { graphqlHTTP } = require('express-graphql')
const path = require('path')
const cookieParser = require('cookie-parser')
const { userData } = require('./src/middleware/userData')
//internal imports
const { connectDB } = require('./src/db')
const schema = require('./src/graphql/schema')
const { authenticate } = require('./src/middleware/auth')

dotenv.config()

//initalize app
const app = express()

//connect Deb with connect DB function
connectDB()
app.use(cookieParser())

//bring in schema attach to graphql endpoint
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

app.use(express.urlencoded({ extended: true }))

// set the view engine to ejs
app.set('view engine', 'ejs');

// update location of views folder that res.render pulls from
app.set('views', path.join(__dirname, '/src/templates/views'));


//registering our authentication
app.use(authenticate)
app.use(userData)

/* Initialize Routes */
require("./src/routes")(app)

//set our initial route
app.get("/", (req, res) => {
		res.send('Hello World of Quizly')
})

app.listen(process.env.PORT, () => {
    console.log(`Server now running on ${process.env.PORT}`)
});