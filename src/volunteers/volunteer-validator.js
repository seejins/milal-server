const logger = require('../logger')

const NO_ERRORS = null

function getVolunteerValidationError({ absents, tardies}) {
    const absentsNum = Number(absents)
    if (!Number.isInteger(absentsNum) || absentsNum <= -1) {
        logger.error(`Invalid absents '${absents}' supplied`)
        return {
            error: {
                message: `'absents' must be a number greater than 0`
            }
        }
    }

    const tardiesNum = Number(tardies)
    if (!Number.isInteger(tardiesNum) || tardiesNum <= -1) {
        logger.error(`Invalid tardies '${tardies}' supplied`)
        return {
            error: {
                message: `'tardies' must be a number greater than 0`
            }
        }
    }

    

    return NO_ERRORS
}

module.exports = {
    getVolunteerValidationError,
}