function makeVolunteersArray() {
    return [
        {
            id: 1,
            name: 'John Doe'
        },
        {
            id: 2,
            name: 'Jane Doe'
        },
        {
            id: 3,
            name: 'Random Guy'
        },
        {
            id: 4,
            name: 'Test Girl'
        }
    ]
}

function makeHoursArray() {
    return [
 
        {
            id: 1,
            hours: 3,
            date_added: 'May 12, 2020',
            volunteer_id: 2
        },
        {
            id: 2,
            hours: 5,
            date_added: 'May 12, 2020',
            volunteer_id: 1
        },
        {
            id: 3,
            hours: 6,
            date_added: 'May 12, 2020',
            volunteer_id: 4
        },
        {
            id: 4,
            hours: 2,
            date_added: 'May 12, 2020',
            volunteer_id: 3
        },
        {
            id: 5,
            hours: 4,
            date_added: 'May 12, 2020',
            volunteer_id: 2
        },
        {
            id: 6,
            hours: 6,
            date_added: 'May 12, 2020',
            volunteer_id: 1
        },
        {
            id: 7,
            hours: 1,
            date_added: 'May 12, 2020',
            volunteer_id: 4
        },
    ]
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          volunteers,
          hours
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE volunteers_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE hours_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('volunteers_id_seq', 0)`),
          trx.raw(`SELECT setval('hours_id_seq', 0)`),
        ])
      )
    )
  }

module.exports = {
    makeVolunteersArray, 
    makeHoursArray,
    cleanTables
}