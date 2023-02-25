// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract LandOwnership {
    uint8 BASE = 1;
    uint8 SALE_INITIATED = 2;
    uint8 SALE_ACCEPTED = 3;
    uint8 DOC_UPLOADED = 4;
    uint8 DOC_APPROVED = 5;
    uint8 TX_INITIATED = 6;
    uint8 TX_ACKNOWLEDGED = 7;
    uint8 CLOSED = 8;

    struct Ownership {
        address owner;
        address buyer;
        uint8 state;
        string[] ipfsDocs;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    mapping(bytes32 => uint256) pixelToPlotMap;
    mapping(uint256 => bytes32[]) plotToPixelMap;
    mapping(uint256 => Ownership) plotToOwnershipMap;
    mapping(address => bytes32) userHashes;

    event InitiateSale(address indexed owner, address indexed buyer, uint256 ownershipId);
    event CloseSale(uint256 ownershipId);

    uint256 plotCount;
    uint256 ownershipCount;
    address admin;

    constructor() {
        admin = msg.sender;
        plotCount = 1;
        ownershipCount = 1;
    }

    function initiateSale(bytes32[] memory pixels, address buyer) public {
        for(uint8 i = 0; i < pixels.length; i++) {
            bytes32 pixel = pixels[i];
            if (pixelToPlotMap[pixel] == 0) {
                require(msg.sender == admin, 'E0');
            } else {
                require(msg.sender == plotToOwnershipMap[pixelToPlotMap[pixel]].owner, 'E1');
                require(plotToOwnershipMap[pixelToPlotMap[pixel]].state == BASE);
                plotToOwnershipMap[pixelToPlotMap[pixel]].state = SALE_INITIATED;
                plotToOwnershipMap[pixelToPlotMap[pixel]].buyer = buyer;
            }
        }
    }

    function acceptSale(address buyer, uint256 ownershipId) public {
        require(msg.sender != plotToOwnershipMap[ownershipId].owner,'E3');
        require(plotToOwnershipMap[ownershipId].state == SALE_INITIATED, 'E4');
        require(plotToOwnershipMap[ownershipId].buyer == buyer, 'E10');
        plotToOwnershipMap[ownershipId].state = SALE_ACCEPTED;
    }
    
    function uploadBuyerDocs(string memory ipfsUrl, uint256 ownershipId) public {
        require(msg.sender == plotToOwnershipMap[ownershipId].buyer, 'E6');
        require(plotToOwnershipMap[ownershipId].state == SALE_ACCEPTED);
        plotToOwnershipMap[ownershipId].ipfsDocs.push(ipfsUrl);
        plotToOwnershipMap[ownershipId].state = DOC_UPLOADED;
    }
    
    function rejectDocs(uint256 ownershipId) public {
        require(msg.sender == admin);
        require(plotToOwnershipMap[ownershipId].state == DOC_UPLOADED);
        delete plotToOwnershipMap[ownershipId].ipfsDocs;
        plotToOwnershipMap[ownershipId].state = SALE_ACCEPTED;
    }

    function approveDocs(uint256 ownershipId)  public {
        require(msg.sender == admin);
        require(plotToOwnershipMap[ownershipId].state == DOC_UPLOADED);
        plotToOwnershipMap[ownershipId].state = DOC_APPROVED;
    }

    function initiatePayment(uint256 ownershipId) public {
        require(msg.sender == plotToOwnershipMap[ownershipId].buyer, 'E4');
        require(plotToOwnershipMap[ownershipId].state == DOC_APPROVED, 'E5');
        plotToOwnershipMap[ownershipId].state = TX_INITIATED;
    }
    
    function acknowledgePayment(uint256 ownershipId) public {
        require(msg.sender == plotToOwnershipMap[ownershipId].owner || msg.sender == admin, 'E6');
        require(plotToOwnershipMap[ownershipId].state == TX_INITIATED);
        plotToOwnershipMap[ownershipId].state = TX_ACKNOWLEDGED;
    }

    function approveDocumentsAndMarkSale(bytes32[] memory pixels, address buyer) public {
        require(msg.sender == admin);
        for(uint8 i = 0; i < pixels.length; i++) {
            bytes32 pixel = pixels[i];
            require(plotToOwnershipMap[pixelToPlotMap[pixel]].buyer == buyer);
            require(plotToOwnershipMap[pixelToPlotMap[pixel]].state == TX_ACKNOWLEDGED);
            plotToPixelMap[plotCount].push(pixel);
            pixelToPlotMap[pixel] = plotCount;
            plotToOwnershipMap[plotCount].owner = buyer;
            plotToOwnershipMap[plotCount].state = BASE;
            plotCount = plotCount + 1;
        }
    }

    function cancelSale(uint256 ownershipId) public {
        require(plotToOwnershipMap[ownershipId].state < 4);
        require((msg.sender == admin) || (msg.sender == plotToOwnershipMap[ownershipId].owner) || (msg.sender == plotToOwnershipMap[ownershipId].buyer));
        plotToOwnershipMap[ownershipId].buyer = address(0);
        delete plotToOwnershipMap[ownershipId].ipfsDocs;
        plotToOwnershipMap[ownershipId].state = BASE;
    }

    function getOwnershipInfo(uint256 ownershipId) view public returns (Ownership memory) {
        return plotToOwnershipMap[ownershipId];
    }

    function getPixelHistory(bytes32 pixelHash) view public returns (Ownership[] memory) {
        uint256 count = 0;
        for(uint256 i = 0; i < plotCount; i++) {
            bool hasPixel = false;
            uint256 pos = 0;
            for(uint256 j = 0; j < plotToPixelMap[j].length; j++) {
                if (plotToPixelMap[i][j] == pixelHash) {
                    hasPixel = true;
                    pos = j;
                    break;
                }
            }
            if (hasPixel) {
                count += 1;
            }
        }

        Ownership[] memory ownerships = new Ownership[](count);
        uint8 posx = 0;
        for(uint256 i = 0; i < plotCount; i++) {
            bool hasPixel = false;
            uint256 pos = 0;
            for(uint256 j = 0; j < plotToPixelMap[j].length; j++) {
                if (plotToPixelMap[i][j] == pixelHash) {
                    hasPixel = true;
                    pos = j;
                    break;
                }
            }
            if (hasPixel) {
                ownerships[posx] = plotToOwnershipMap[pos];
                posx += 1;
            }
        }
        return ownerships;
    }

    function getOpenSales() public view returns (Ownership[] memory) {
        uint256 openSaleCount = 0;
        for(uint256 i = 0; i < plotCount; i++) {
            if (plotToOwnershipMap[i].state == SALE_INITIATED) openSaleCount += 1; 
        }
        Ownership[] memory ownerships = new Ownership[](openSaleCount);
        uint256 posx = 0;
        for(uint256 i = 0; i < plotCount; i++) {
            if (plotToOwnershipMap[i].state == SALE_INITIATED) {
                ownerships[posx] = plotToOwnershipMap[i];
                posx += 1;
            }
        }
        return ownerships;
    }
}
