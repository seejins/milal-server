const app = require('../src/app')
const knex = require('knex')
const { makeVolunteersArray } = require('./test-helpers')

describe(`Volunteers service object`, function () {
    let db

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db('milal_volunteers').truncate())

    afterEach('cleanup', () => db('milal_volunteers').truncate())

    describe(`GET /volunteers`, () => {

        context('Given no volunteers', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/volunteers')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
        })

        context('Given there are volunteers in the database', () => {
            const testVolunteers = makeVolunteersArray()

            beforeEach('insert volunteers', () => {
                return db
                    .into('milal_volunteers')
                    .insert(testVolunteers)
            })

            it('GET / responds with 200 containing "Hello, world!"', () => {
                return supertest(app)
                    .get('/api/volunteers')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
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
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: { message: `Volunteer doesn't exist.` }})
            })
        })

        context('Given there are volunteers in the database', () => {
            const testVolunteers = makeVolunteersArray()

            beforeEach('insert volunteers', () => { 
                return db  
                    .into('milal_volunteers')
                    .insert(testVolunteers)
            })

            it('GET /api/volunteers/:volunteer_id responds with 200 and specified volunteer', () => {
                const volunteerId = 2
                const expectedVolunteer = testVolunteers[volunteerId - 1]
                return supertest(app)
                    .get(`/api/volunteers/${volunteerId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, expectedVolunteer)
            })
        })
    })

    describe(`POST /api/volunteers`, () => {
        it(`responds with 400 missing 'name' if not supplied`, () => {  
            const newVolunteerMissingName = {
                absents: 0,
                tardies: 0,
                total_hours: 20,
            }

            return supertest(app)
                .post(`/api/volunteers`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newVolunteerMissingName)
                .expect(400, {
                    error: { message: `'name' is required`}
                })
        })

        it(`responds with 400 missing 'absents' if not supplied`, () => {  
            const newVolunteerMissingAbsents = {
                name: 'test name',
                //absents: 0,
                tardies: 0,
                total_hours: 20,
            }

            return supertest(app)
                .post(`/api/volunteers`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newVolunteerMissingAbsents)
                .expect(400, {
                    error: { message: `'absents' is required`}
                })
        })

        it(`responds with 400 missing 'tardies' if not supplied`, () => {  
            const newVolunteerMissingTardies = {
                name: 'test name',
                absents: 1,
                //tardies: 0,
                total_hours: 20,
            }

            return supertest(app)
                .post(`/api/volunteers`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newVolunteerMissingTardies)
                .expect(400, {
                    error: { message: `'tardies' is required`}
                })
        })

        it(`responds with 400 missing 'total_hours' if not supplied`, () => {  
            const newVolunteerMissingTotalHours = {
                name: 'test name',
                absents: 1,
                tardies: 2,
                //total_hours: 20,
            }

            return supertest(app)
                .post(`/api/volunteers`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newVolunteerMissingTotalHours)
                .expect(400, {
                    error: { message: `'total_hours' is required`}
                })
        })
    })

    describe(`DELETE /api/volunteers/:volunteers_id`, () => {
        
        context('Given no volunteers', () => {
            it(`responds with 404`, () => {
                const volunteerId = 1234
                return supertest(app)
                    .get(`/api/volunteers/${volunteerId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: { message: `Volunteer doesn't exist.` }})
            })
        })

        context(`Given there are volunteers in the database`, () => {
            const testVolunteers = makeVolunteersArray()

            beforeEach('insert volunteers', () => {
                return db
                    .into('milal_volunteers')
                    .insert(testVolunteers)
            })

            it(`responds with 204 and removes the bookmark`, () => {
                const idToRemove = 2
                const expectedVolunteers = testVolunteers.filter(volunteer => volunteer.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/volunteers/${idToRemove}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/volunteers/`)
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect(expectedVolunteers)
                    )
            })
        })
    })
})