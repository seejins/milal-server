# Milal App API

## Database Setup
To set up the database:
1. Make sure you are in psql in your command line.
2. Run the SQL command 'CREATE USER milal_admin;'.
3. Run the SQL command 'CREATE DATABASE milal-database OWNER milal_admin;'.
4. Ensure your .env file is created and includes the database location.
5. Run the command 'npm run migrate -- 1' to create the tables.
6. Run the command 'psql -U milal_admin -d milal-database -f ./seeds/seed/tables.sql' and psql -U milal_admin -d milal-database -f ./seeds/seed/hours_tables.sql' to seed the database.

### URL: https://shielded-shelf-30672.herokuapp.com/


## Endpoints:

#### Get all volunteers and hours using get /volunteers and get /hours

**Example Response: Volunteers**
```javascript
[
    {
        "id": 1,
        "name": "John Doe"
    },
    {
        "id": 2,
        "name": "Jane Doe"
    },
    {
        "id": 3,
        "name": "Random Guy"
    },
    {
        "id": 4,
        "name": "Random Girl"
    }
]
```

**Example Response: Hours** 
```javascript
[
    {
        "id": 1,
        "hours": 3,
        "date_added": "May 12, 2020",
        "volunteer_id": 1
    },
    {
        "id": 2,
        "hours": 4,
        "date_added": "May 12, 2020",
        "volunteer_id": 2
    },
    {
        "id": 3,
        "hours": 5,
        "date_added": "May 12, 2020",
        "volunteer_id": 3
    }
]
```

#### Get specific volunteers and their total hours using get /volunteers/:volunteer_id

**Example Response: VolunteerId**
```javascript
{
    "volunteers": {
        "id": 2,
        "name": "Jane Doe"
    },
    "total_hours": "9"
}
```

#### Add a volunteer using post /volunteers

**Required fields:** `name` (type=string)

**Example Request:**
```javascript
const newVolunteer {
    name: 'Random Name'
};
```

#### Add hours using post /hours

**Required fields:** `hours` (type=Number), `volunteer_id` (type=Number)

**Example Request:**
```javascript
const newHours {
    hours: 3,
    volunteer_id: 4
};
```



