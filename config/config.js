const config = {};

config.PORT = process.env.PORT || 3000;
config.mongoUri = 'mongodb+srv://anablocc:tryhq123@cluster01.cyoxs11.mongodb.net/?retryWrites=true&w=majority';

config.admin = {
    email: 'admin@anablocc.com',
    password: 'tryhq@123',
}

config.testOtp = '9999';

config.jwt = {
    userSecret: 'userjwtsecret',
    adminSecret: 'adminjstsecret',
}

config.aadharOtp = '1010';

module.exports = config;