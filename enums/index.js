const ownershipStatusEnum = {
    BASE: 'BASE',
    SALE_INITIATED: 'SALE_INITIATED',
    SALE_ACCEPTED: 'SALE_ACCEPTED',
    DOC_UPLOADED: 'DOC_UPLOADED',
    DOC_APPROVED: 'DOC_APPROVED',
    TX_INITIATED: 'TX_INITIATED', 
    TX_ACKNOWLEDGED: 'TX_ACKNOWLEDGED',
    CLOSED: 'CLOSED',
};

const propertyStateEnum = {
    BASE: 'BASE',
    SALE_IN_PROGRESS: 'SALE_IN_PROGRESS',
};

const documentsStatusEnum = {
    VERIFICATION_PENDING: 'VERIFICATION_PENDING',
    VERIFIED: 'VERIFIED'
}

module.exports = {
    ownershipStatusEnum, propertyStateEnum, documentsStatusEnum
};