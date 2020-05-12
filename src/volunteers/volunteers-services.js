const VolunteersService = {
    getAllVolunteers(knex) {
        return knex.select('*').from('volunteers')
    },

    insertVolunteer(knex, newVolunteer) {
        return knex
            .insert(newVolunteer)
            .into('volunteers')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex 
            .from('volunteers')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteVolunteer(knex, id) {
        return knex('volunteers')
            .where('id', id)
            .delete()
    },

    updateVolunteer(knex, id, newVolunteerFields) {
        return knex('volunteers')
            .where('id', id)
            .update(newVolunteerFields)
    },

    getTotalHours(knex, id) {
        return knex
            .from('hours')
            .select( knex.raw(`SUM(hours) as total_hours`))
            .where('volunteer_id', id)
            .groupBy('volunteer_id')
            
    }
}

module.exports = VolunteersService