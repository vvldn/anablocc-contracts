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

config.adminPhone = "9898989898";

config.adminUserId = '63f9dca1b4b02daa53fdb977';

config.ownershipId = '001';

config.contractAddress = '0xA7cCd8E659099dfe58E394AAb4442E246D46b061';

module.exports = config;