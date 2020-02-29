const VolunteersService = {
    getAllVolunteers(knex) {
        return knex
            .select('*')
            .from('milal_volunteers')
            .orderBy('id')
    },

    getById(knex, id) {
        return knex
            .from('milal_volunteers')
            .select('*')
            .where('id', id)
            .first()
    },

    insertVolunteer(knex, newVolunteer) {
        return knex 
            .insert(newVolunteer)
            .into('milal_volunteers')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteVolunteer(knex, id) {
        return knex('milal_volunteers')
        .where('id', id)
        .delete()
    },

    updateVolunteer(knex, id, newVolunteerFields) {
        return knex('milal_volunteers')
            .where('id', id)
            .update(newVolunteerFields)
    },
}

module.exports = VolunteersService