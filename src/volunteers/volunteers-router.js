const express = require('express')
const VolunteersService = require('./volunteers-service')
const logger = require('../logger')
const volunteersRouter = express.Router()
const bodyParser = express.json()
const { getVolunteerValidationError } = require('./volunteer-validator')
const path = require('path')

const serializeVolunteer = volunteer => ({
    id: volunteer.id,
    name: volunteer.name,
    absents: Number(volunteer.absents),
    tardies: Number(volunteer.tardies),
    total_hours: Number(volunteer.total_hours),

})

volunteersRouter
    .route('/')
    .get((req, res, next) => {
        VolunteersService.getAllVolunteers(req.app.get('db'))
            .then(volunteers => {
                res.json(volunteers.map(serializeVolunteer))
            })
            .catch(next)
    })

    .post(bodyParser, (req, res, next) => {
        const { name, absents, tardies, total_hours } = req.body
        const newVolunteer = { name, absents, tardies, total_hours }

        for (const field of ['name', 'absents', 'tardies', 'total_hours']) {
            if (!newVolunteer[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `'${field}' is required` }
                })
            }
        }

        const error = getVolunteerValidationError(newVolunteer)

        if (error) return res.status(400).send(error)

        // const totalHoursNum = Number(totalHoursNum)
        // if (!Number.isInteger(totalHoursNum) || totalHoursNum <= 0) {
        //     logger.error(`Invalid total_hours '${total_hours}' supplied`)
        //     return {
        //         error: {
        //             message: `'total_hours' must be a number greater than 0`
        //         }
        //     }
        // }

        VolunteersService.insertVolunteer(
            req.app.get('db'),
            newVolunteer
        )
            .then(volunteer => {
                logger.info(`Volunteer with id ${volunteer.id} created`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `${volunteer.id}`))
                    .json(serializeVolunteer(volunteer))
            })
            .catch(next)
    })


volunteersRouter
    .route('/:volunteer_id')

    .all((req, res, next) => {
        const { volunteer_id } = req.params
        VolunteersService.getById(req.app.get('db'), volunteer_id)
            .then(volunteer => {
                if (!volunteer) {
                    logger.error(`Volunteer with id ${volunteer_id} not found.`)
                    return res.status(404).json({
                        error: { message: `Volunteer doesn't exist.`}
                    })
                }

                res.volunteer = volunteer
                next()
            })
            .catch(next)
    })

    .get((req, res) => {
        res.json(serializeVolunteer(res.volunteer))
    })

    .delete((req, res, next) => {
        const { volunteer_id } = req.params
        VolunteersService.deleteVolunteer(
            req.app.get('db'),
            volunteer_id
        )
        .then(numRowsAffected => {
            logger.info(`Volunteer with id ${volunteer_id} deleted.`)
            res.status(204).end()
        })
        .catch(next)
    })

    .patch(bodyParser, (req, res, next) => {
        const { name, absents, tardies, total_hours } = req.body
        const volunteerToUpdate = { name, absents, tardies, total_hours }

        const numberOfValues = Object.values(volunteerToUpdate).filter(Boolean).length
        if(numberOfValues === 0 ) {
            logger.error(`Invalid update without required fields`)
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name', 'absents', tardies', 'total hours'`
                }
            })
        }

        const error = getVolunteerValidationError(volunteerToUpdate)

        if (error) return res.status(400).send(error)

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