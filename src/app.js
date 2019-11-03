/**
 * Import build-in modules
 */
import express from 'express'
import dotenv from 'dotenv'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import connectFlash from 'connect-flash'
import cors from 'cors'

/**
 * Import defined modules
 */
import sessionConfig from './configs/session'
import apiRouter from './routes/apiRouter'

dotenv.config({ path: process.cwd() + '/sh/.env' })

const app = express()
// Config session
sessionConfig.config(app)

// Use Cors
app.use(cors({
  credentials: true,
  origin: true
}))

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Use Cookie Parser
app.use(cookieParser())

// Enable flash message
app.use(connectFlash())

// Config passport
app.use(passport.initialize())
app.use(passport.session())

// Init all routes
app.use("/api", apiRouter)

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log('Server is running at port ' + process.env.APP_PORT)
})
