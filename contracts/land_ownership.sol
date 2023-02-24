// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract LandOwnership {
    struct Ownership {
        uint256 plotId;
        address owner;
        string state;
        string[] ipfsDocs;
    }
    /*
    States = 
        BASE
        SALE_INITIATED
        SALE_ACCEPTED
        TX_INITIATED
        TX_DOC_UPLOADED
        TX_APPROVED
        DOC_UPLOADED_2? DISCUSS
        CLOSED
    */

    mapping(uint256 => uint256) pixelToPlotMap;
    mapping(uint256 => uint256) plotToPixelMap;
    mapping(uint256 => Ownership) plotToOwnershipMap;


    address admin;

    constructor() {
        admin = msg.sender;
    }

    function initiateSale(uint256[] memory pixels) public {
    }

    function acceptSale(address user2) public {}

    function uploadBuyerDocs(string[] memory ipfsUrls) public {}
    
    function acknowledgePayment(uint256 ownershipId) public {}

    function approveDocuments(uint256 ownershipId) public {}

    function markSale(uint256 ownershipId) public {} // do we need this??
}
