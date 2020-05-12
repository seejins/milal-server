const path = require('path')
const express = require('express')
const xss = require('xss')
const HoursService = require('./hours-services')

const hoursRouter = express.Router()
const jsonParser = express.json()

const serializeHours = hours => ({
    id: hours.id,
    hours: Number(hours.hours),
    date_added: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      }).format(hours.date_added),
    volunteer_id: hours.volunteer_id
})

hoursRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        HoursService.getAllHours(knexInstance)
            .then(hours => {
                res.json(hours.map(serializeHours))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { hours, volunteer_id } = req.body
        const newHours = { hours, volunteer_id }

        for (const [key, value] of Object.entries(newHours)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body.` }
                })
            }
        }

        HoursService.insertHours(
            req.app.get('db'),
            newHours
        )
            .then(hours => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${hours.id}`))
                    .json(serializeHours(hours))
            })
            .catch(next)
    })

hoursRouter
    .route('/:hours_id')
    .all((req, res, next) => {
        HoursService.getById(
            req.app.get('db'),
            req.params.hours_id
        )
            .then(hours => {
                if (!hours) {
                    return res.status(404).json({
                        error: { message: `Hours doesn't exist.` }
                    })
                }
                res.hours = hours
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeHours(res.hours))
    })
    .delete((req, res, next) => {
        HoursService.deleteHours(
            req.app.get('db'),
            req.params.hours_id,
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { hours, date_added, volunteer_id } = req.body
        const hoursToUpdate = { hours, date_added, volunteer_id }

        const numberOfValues = Object.values(hoursToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: { message: `Request body must contain either 'hours', 'date_added', or 'volunteer_id'` }

            })

        HoursService.updateHours(
            req.app.get('db'),
            req.params.hours_id,
            hoursToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = hoursRouter