pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Medical{
    address private owner = msg.sender;
    mapping(string => bool) public doesDoctorHaveAccess;
    string[] private doctorsPubKeys;
    string private documentHash;

    function returnDoctorsPubKeys() public isOwner() view returns(string[] memory)  {
        return doctorsPubKeys;
    }

    function grantAccessToDoctor ( string memory a ) public isOwner() {
        doesDoctorHaveAccess[a] = true;
    }

    function revokeAccessFromDoctor ( string memory a )  public isOwner() {
        doesDoctorHaveAccess[a] = false;
    }

    function storeFileHash ( string memory a )  public isOwner(){
        documentHash = a;
    }

    function getFileHash () public isOwner() view  returns(string memory) {
        return documentHash;
    }

    function registerDoctor ( string memory a   )  public isOwner(){
        doctorsPubKeys.push(a);
        doesDoctorHaveAccess[a] = false;
    }

    modifier userExists(address _userId) {
        require (_userId != address(0x0), 'The user should exist');
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, 'You are not the owner of this contract');
        _;
    }

    modifier reject() {
        require(true == false, 'Not reasonable');
        _;
    }

 }