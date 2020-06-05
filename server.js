require('dotenv').config()
//require the dotenv module and invoke 
//its config() method to read the .env file
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    console.log(authToken)
    
    if (!authToken || authToken.split('')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    //move to the next middleware in the pipeline
    next()
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIEDEX

    //the API responds with an array of full movie entries for the search results

    //users can search by genre, country, or avg_vote
    //provided in query string parameters

    //when searching by genre
    //users search for whether the movie genre includes a specific string
    //.includes()
    if (req.query.genre) {
        response = response.filter(movie => 
            movie.genre.includes(req.query.genre)
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
        if (avg_vote >= req.query.avg_vote) {
            response = response.filter(movie => 
                movie.avg_vote.includes(req.query.avg_vote)
            )
        }
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})