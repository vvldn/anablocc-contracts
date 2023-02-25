const getOwnershipDetails = async (req, res, next) => {
    try {
        return res.status(500).send();
    } catch(err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}