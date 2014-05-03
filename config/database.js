module.exports = {
    development: {
        driver:   'mongodb',
        url:      'mongodb://localhost/compound-mongo-dev'
    },
    test: {
        driver:   'mongodb',
        url:      'mongodb://localhost/compound-mongo-test'
    },
    production: {
        driver:   'mongodb',
        url:      'mongodb://localhost/compound-mongo-production'
    }
};
