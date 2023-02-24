// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract LandOwnership {
    struct Ownership {
        uint256 plotId;
        address owner;
        address buyer;
        string state;
        string[] ipfsDocs;
    }
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }   
    /*
    States = 
        BASE
        SALE_INITIATED
        SALE_ACCEPTED
        TX_INITIATED
        TX_ACK
        TX_DOC_UPLOADED
        CLOSED
    */

    mapping(uint256 => uint256) pixelToPlotMap;
    mapping(uint256 => uint256[]) plotToPixelMap;
    mapping(uint256 => Ownership) plotToOwnershipMap;


    address admin;

    constructor() {
        admin = msg.sender;
    }

    function initiateSale(uint256[] memory pixels) public {
        for(uint8 i = 0; i < pixels.length; i++) {
            uint256 pixel = pixels[i];
            if (pixelToPlotMap[pixel] == 0) {
                require(msg.sender == admin, 'E0');
            } else {
                require(msg.sender == plotToOwnershipMap[pixelToPlotMap[pixel]].owner, 'E1');
            }
            plotToOwnershipMap[pixelToPlotMap[pixel]].state = 'SALE_INITIATED';
        }
    }

    function acceptSale(address user2, uint256 ownershipId) public {
        require(msg.sender != plotToOwnershipMap[ownershipId].owner,'E3');
        require(compareStrings(plotToOwnershipMap[ownershipId].state, 'SALE_INITIATED') == true, 'E4');
        plotToOwnershipMap[ownershipId].state = 'SALE_ACCEPTED';
        plotToOwnershipMap[ownershipId].buyer = user2;
    }

    function initiatePayment(uint256 ownershipId) public {}
    
    function acknowledgePayment(uint256 ownershipId) public {}

    function uploadBuyerDocs(string[] memory ipfsUrls) public {}

    function approveDocumentsAndMarkSale(uint256 ownershipId) public {}

    function cancelSale(uint256 ownershipId) public {}

}
