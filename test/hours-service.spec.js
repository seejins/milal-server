const app = require('../src/app')
const knex = require('knex')
const { makeVolunteersArray } = require('./test-helpers')
const helpers = require('./test-helpers')

describe(`Hours service object`, function() {
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

    describe(`GET /hours`, () => {

        context('Given no hours', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/hours')
    
                    .expect(200, [])
            })
        })

        context('Given there are hours in the database', () => {
            const testHours = helpers.makeHoursArray()
            const testVolunteers = makeVolunteersArray()

            beforeEach('insert voluneers', () => {
                return db
                    .into('volunteers')
                    .insert(testVolunteers)
            })

            beforeEach('insert hours', () => {
                return db
                    .into('hours')
                    .insert(testHours)
            })

            it('GET / responds with 200 containing "Hello, world!"', () => {
                return supertest(app)
                    .get('/api/hours')
    
                    .expect(200, testHours)
            })
        })
    })

    describe(`GEt /api/hours/:hours_id`, () => {
        
        context('Given no hours', () => {
            it(`responds with 404`, () => {
                const hoursId = 1234
                return supertest(app)
                    .get(`/api/hours/${hoursId}`)
    
                    .expect(404, { error: { message: `Hours doesn't exist.` }})
            })
        })

        context('Given there are hours in the database', () => {
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

            it('GET /api/hours/:hours_id responds with 200', () => {
                const hoursId = 2
                return supertest(app)
                    .get(`/api/hours/${hoursId}`)
    
                    .expect(200)
            })
        })
    })

    describe(`POST /api/hours`, () => {
        it(`responds with 400 missing 'hours' if not supplied`, () => {  
            const newHoursMissingField = {
                volunteer_id: 3
            }

            return supertest(app)
                .post(`/api/hours`)
                .send(newHoursMissingField)
                .expect(400, {
                    error: { message: `Missing 'hours' in request body.`}
                })
        })

        it(`responds with 400 missing 'volunteer_id' if not supplied`, () => {
            const newHoursMissingField ={
                hours: 3 
            }

            return supertest(app)
                .post(`/api/hours`)
                .send(newHoursMissingField)
                .expect(400, {
                    error: { message: `Missing 'volunteer_id' in request body.`}
                })
        })
    })

    describe(`DELETE /api/hours/:hours_id`, () => {
        
        context('Given no hours', () => {
            it(`responds with 404`, () => {
                const hoursId = 1234
                return supertest(app)
                    .get(`/api/hours/${hoursId}`)
    
                    .expect(404, { error: { message: `Hours doesn't exist.` }})
            })
        })

        context(`Given there are hours in the database`, () => {
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

            it(`responds with 204 and removes the hours`, () => {
                const idToRemove = 2
                const expectedHours = testHours.filter(hour => hour.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/hours/${idToRemove}`)
    
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/hours/`)
                            .expect(expectedHours)
                    )
            })
        })
    })
})