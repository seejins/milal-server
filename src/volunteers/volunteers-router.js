const path = require('path')
const express = require('express')
const xss = require('xss')
const VolunteersService = require('./volunteers-services')

const volunteersRouter = express.Router()
const jsonParser = express.json()


const serializeVolunteer = volunteer => ({
    id: volunteer.id,
    name: xss(volunteer.name),
    total_hours: Number(volunteer.total_hours)

})

volunteersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        VolunteersService.getAllVolunteers(knexInstance)
            .then(volunteers => {
                res.json(volunteers.map(serializeVolunteer))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name  } = req.body
        const newVolunteer = { name }

        if(!name) {
            return res.status(400).json({
                error: { message: `Missing 'name' in request body`}
            })
        }

        VolunteersService.insertVolunteer(
            req.app.get('db'),
            newVolunteer
        )
            .then(volunteer => {
                res 
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${volunteer.id}`))
                    .json(serializeVolunteer(volunteer))
            })
            .catch(next)
    })

volunteersRouter   
    .route('/:volunteer_id')
    .all((req, res, next) => {
        VolunteersService.getById(
            req.app.get('db'),
            req.params.volunteer_id
        )

            .then(volunteer => {
                if (!volunteer) {
                    return res.status(404).json({
                        error: { message: `Volunteer doesn't exist.` }
                    })
                }
                res.volunteer = volunteer
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeVolunteer(res.volunteer))
    })
    .delete((req, res, next) => {
        VolunteersService.deleteVolunteer(
            req.app.get('db'),
            req.params.volunteer_id,
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name } = req.body
        const volunteerToUpdate = { name }

        if (!name) {
            return res.status(400).json({
                error: { message: `Missing 'name' in request body.`}
            })
    }

    VolunteersService.updateVolunteer(
        req.app.get('db'),
        req.params.volunteer_id,
        volunteerToUpdate
    )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)

    })

module.exports = volunteersRouter
    
