const path = require('path')
const express = require('express')
const xss = require('xss')
const VolunteersService = require('./volunteers-services')

const volunteersRouter = express.Router()
const jsonParser = express.json()


const serializeVolunteer = volunteer => ({
    id: volunteer.id,
    name: xss(volunteer.name),

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
        let total_hours = VolunteersService.getTotalHours(req.app.get('db'), req.params.volunteer_id)
        let volunteer = VolunteersService.getById(req.app.get('db'), req.params.volunteer_id)
        

        Promise.all([total_hours, volunteer])
            .then(values => {
                let volunteer = values[1]
                let total_hours = values[0]

                res.volunteers = volunteer
                res.total_hours = total_hours

                console.log('1', total_hours, volunteer)

                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.json({
            volunteers: serializeVolunteer(res.volunteers),
            total_hours: res.total_hours[0].total_hours
        })
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
    
