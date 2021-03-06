require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const volunteersRouter = require('./volunteers/volunteers-router')
const hoursRouter = require('./hours/hours-router')
const errorHandler = require('./error-handler')


const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api/volunteers', volunteersRouter)
app.use('/api/hours', hoursRouter)

app.use(errorHandler)

module.exports = app