module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://milal_admin@localhost/milal-database',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://milal_admin@localhost/milal-test'
  }