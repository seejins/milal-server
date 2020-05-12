const app = require('../src/app')
const knex = require('knex')
const { makeVolunteersArray } = require('./test-helpers')
const helpers = require('./test-helpers')

describe(`Volunteers service object`, function() {
    let db

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /volunteers`, () => {

        context('Given no volunteers', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/volunteers')
    
                    .expect(200, [])
            })
        })

        context('Given there are volunteers in the database', () => {
            const testVolunteers = makeVolunteersArray()

            beforeEach('insert volunteers', () => {
                return db
                    .into('volunteers')
                    .insert(testVolunteers)
            })

            it('GET / responds with 200 containing "Hello, world!"', () => {
                return supertest(app)
                    .get('/api/volunteers')
    
                    .expect(200, testVolunteers)
            })
        })
    })

    describe(`GEt /api/volunteers/:volunteer_id`, () => {
        
        context('Given no volunteers', () => {
            it(`responds with 404`, () => {
                const volunteerId = 1234
                return supertest(app)
                    .get(`/api/volunteers/${volunteerId}`)
    
                    .expect(404, { error: { message: `Volunteer doesn't exist.` }})
            })
        })

        context('Given there are volunteers in the database', () => {
            const testVolunteers = makeVolunteersArray()
            const testHours = helpers.makeHoursArray()

            beforeEach('insert volunteers', () => { 
                return db  
                    .into('volunteers')
                    .insert(testVolunteers)
            })

            beforeEach('insert hours', () => {
                return db
                    .into('hours')
                    .insert(testHours)
            })

            it('GET /api/volunteers/:volunteer_id responds with 200', () => {
                const volunteerId = 2
                return supertest(app)
                    .get(`/api/volunteers/${volunteerId}`)
    
                    .expect(200)
            })
        })
    })

    describe(`POST /api/volunteers`, () => {
        it(`responds with 400 missing 'name' if not supplied`, () => {  
            const newVolunteerMissingName = {
                name: ''
            }

            return supertest(app)
                .post(`/api/volunteers`)

                .send(newVolunteerMissingName)
                .expect(400, {
                    error: { message: `Missing 'name' in request body`}
                })
        })
    })

    describe(`DELETE /api/volunteers/:volunteers_id`, () => {
        
        context('Given no volunteers', () => {
            it(`responds with 404`, () => {
                const volunteerId = 1234
                return supertest(app)
                    .get(`/api/volunteers/${volunteerId}`)
    
                    .expect(404, { error: { message: `Volunteer doesn't exist.` }})
            })
        })

        context(`Given there are volunteers in the database`, () => {
            const testVolunteers = makeVolunteersArray()

            beforeEach('insert volunteers', () => {
                return db
                    .into('volunteers')
                    .insert(testVolunteers)
            })

            it(`responds with 204 and removes the volunteer`, () => {
                const idToRemove = 2
                const expectedVolunteers = testVolunteers.filter(volunteer => volunteer.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/volunteers/${idToRemove}`)
    
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/volunteers/`)
                            .expect(expectedVolunteers)
                    )
            })
        })
    })
})