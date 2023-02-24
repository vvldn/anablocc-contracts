// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract LandOwnership {
    struct Ownership {
        address owner;
        address buyer;
        uint8 state;
        string[] ipfsDocs;
    }
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }   
    /*
    States = 
        1 = BASE
        2 = SALE_INITIATED
        3 = SALE_ACCEPTED
        4 = TX_INITIATED
        5 = TX_ACK
        6 = CLOSED
    */

    mapping(uint256 => uint256) pixelToPlotMap;
    mapping(uint256 => uint256[]) plotToPixelMap;
    mapping(uint256 => Ownership) plotToOwnershipMap;

    uint256 plotCount;
    uint256 ownershipCount;
    address admin;

    constructor() {
        admin = msg.sender;
        plotCount = 1;
        ownershipCount = 1;
    }

    function initiateSale(uint256[] memory pixels) public {
        for(uint8 i = 0; i < pixels.length; i++) {
            uint256 pixel = pixels[i];
            if (pixelToPlotMap[pixel] == 0) {
                require(msg.sender == admin, 'E0');
            } else {
                require(msg.sender == plotToOwnershipMap[pixelToPlotMap[pixel]].owner, 'E1');
            }
            plotToOwnershipMap[pixelToPlotMap[pixel]].state = 2;
        }
    }

    function acceptSale(address user2, uint256 ownershipId) public {
        require(msg.sender != plotToOwnershipMap[ownershipId].owner,'E3');
        require(plotToOwnershipMap[ownershipId].state == 2, 'E4');
        plotToOwnershipMap[ownershipId].state = 3;
        plotToOwnershipMap[ownershipId].buyer = user2;
    }

    function initiatePayment(uint256 ownershipId) public {
        require(msg.sender == plotToOwnershipMap[ownershipId].buyer, 'E4');
        require(plotToOwnershipMap[ownershipId].state == 3, 'E5');
        plotToOwnershipMap[ownershipId].state = 4;
    }
    
    function acknowledgePayment(uint256 ownershipId) public {
        require(msg.sender == plotToOwnershipMap[ownershipId].owner, 'E6');
        require(plotToOwnershipMap[ownershipId].state == 4);
        plotToOwnershipMap[ownershipId].state = 5;
    }

    function uploadBuyerDocs(string memory ipfsUrl, uint256 ownershipId) public {
        // before payment
        require(msg.sender == plotToOwnershipMap[ownershipId].buyer, 'E6');
        require(plotToOwnershipMap[ownershipId].state == 5);
        plotToOwnershipMap[ownershipId].ipfsDocs.push(ipfsUrl);
    }
    function rejectDocs(uint256 ownershipId) public {
        require(msg.sender == admin);
        require(plotToOwnershipMap[ownershipId].state == 5);
        delete plotToOwnershipMap[ownershipId].ipfsDocs;
        plotToOwnershipMap[ownershipId].state = 5;

    }
    function approveDocumentsAndMarkSale(uint256[] memory pixels, address buyer) public {
        require(msg.sender == admin);
        for(uint8 i = 0; i < pixels.length; i++) {
            uint256 pixel = pixels[i];
            require(plotToOwnershipMap[pixelToPlotMap[pixel]].buyer == buyer);
            require(plotToOwnershipMap[pixelToPlotMap[pixel]].state == 5);
            plotToPixelMap[plotCount].push(pixel);
            pixelToPlotMap[pixel] = plotCount;
            plotToOwnershipMap[plotCount].owner = buyer;
            plotToOwnershipMap[plotCount].state = 1;
            plotCount = plotCount + 1;
        }
    }

    function cancelSale(uint256 ownershipId) public {
        require(plotToOwnershipMap[ownershipId].state < 4);
        require((msg.sender == admin) || (msg.sender == plotToOwnershipMap[ownershipId].owner) || (msg.sender == plotToOwnershipMap[ownershipId].buyer));
        plotToOwnershipMap[ownershipId].buyer = address(0);
        delete plotToOwnershipMap[ownershipId].ipfsDocs;
        plotToOwnershipMap[ownershipId].state = 1;
    }
}
