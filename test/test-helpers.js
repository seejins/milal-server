function makeVolunteersArray() {
    return [
        {
            id: 1,
            name: 'John Doe',
            total_hours: 0,
        },
        {
            id: 2,
            name: 'Jane Doe',
            total_hours: 0,
        },
        {
            id: 3,
            name: 'Random Guy',
            total_hours: 0,
        },
        {
            id: 4,
            name: 'Test Girl',
            total_hours: 0,
        }
    ]
}

function makeHoursArray() {
    return [
 
        {
            hours: 3,
            volunteer_id: 2
        },
        {
            hours: 5,
            volunteer_id: 1
        },
        {
            hours: 6,
            volunteer_id: 4
        },
        {
            hours: 2,
            volunteer_id: 3
        },
        {
            hours: 4,
            volunteer_id: 2
        },
        {
            hours: 6,
            volunteer_id: 1
        },
        {
            hours: 1,
            volunteer_id: 4
        },
    ]
}

module.exports = {
    makeVolunteersArray, 
    makeHoursArray
}