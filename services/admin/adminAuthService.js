const config = require('../../config/config');

const checkAndLoginAdmin = (email, password) => {
    if(email === config.admin.email && password === config.admin.password){
        return { success: true };
    } else {
        return { success: false };
    }
}

module.exports = {
    checkAndLoginAdmin,
}