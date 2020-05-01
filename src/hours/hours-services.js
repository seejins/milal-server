const HoursService = {
    getAllHours(knex) {
        return knex
            .select('*')
            .from('hours')
    },

    insertHours(knex, newHours) {
        return knex 
            .insert(newHours)
            .into('hours')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('hours')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteHours(knex, id) {
        return knex('hours')
            .where('id', id)
            .delete()
    },

    updateHours(knex, id, newHoursFields) {
        return knex('hours')
            .where('id', id)
            .update(newHoursFields)
    },
}

module.exports = HoursService