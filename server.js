require('dotenv').config()
//require the dotenv module and invoke 
//its config() method to read the .env file
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    //move to the next middleware in the pipeline
    next()
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIEDEX;

    //when searching by genre
    //users search for whether the movie genre includes a specific string
    //.includes()
    if (req.query.genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    //when searching by country
    //users search for whether the movies country includes a specific string
    //search should be case insensitive
    //.toLowerCase() and .includes()
    if (req.query.country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    //when searching by avg_vote
    //users are searching for movies with an avg_vote 
    //that is greater than or equal to supplied number
    if (req.query.avg_vote) {
        response = response.filter(movie => 
            Number(movie.avg_vote) >= Number(req.query.avg_vote)
        )
    }

    res.json(response)
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})