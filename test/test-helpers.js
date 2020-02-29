function makeVolunteersArray() {
    return [
        {
            id: 1,
            name: 'John Doe',
            absents: 0,
            tardies: 3,
            total_hours: 40,
        },
        {
            id: 2,
            name: 'Jane Doe',
            absents: 2,
            tardies: 0,
            total_hours: 30,
        },
        {
            id: 3,
            name: 'Random Guy',
            absents: 5,
            tardies: 3,
            total_hours: 10,
        },
        {
            id: 4,
            name: 'Test Girl',
            absents: 0,
            tardies: 0,
            total_hours: 50,
        }
    ]
}

module.exports = {
    makeVolunteersArray
}