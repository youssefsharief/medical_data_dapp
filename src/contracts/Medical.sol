pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Medical{
    address private owner = msg.sender;
    mapping(string => bool) public doesDoctorHaveAccess;
    mapping(string => string) public encryptedSecretKey;
    string[] private doctorsPubKeys;
    string private fileHash;
    string private secretObjectHash;

    function returnDoctorsPubKeys() public view returns(string[] memory)  {
        return doctorsPubKeys;
    }

    function grantAccessToDoctor( string memory publicKey )  public isOwner() publickKeyProvided(publicKey) {
        doesDoctorHaveAccess[publicKey] = true;
        resetDocument();
    }

    function amIOwner() public view returns(bool) {
        return msg.sender == owner;
    }

    function revokeAccessFromDoctor ( string memory publicKey )  public isOwner() publickKeyProvided(publicKey){
        doesDoctorHaveAccess[publicKey] = false;
        resetDocument();
    }

    function resetDocument() private {
        fileHash = '';
        secretObjectHash = '';
    }

    function storeFileHash ( string memory str )  public isOwner() hashProvided(str){
        require(bytes(str).length > 0, 'You need to  provide a hash for the file');
        fileHash = str;
    }

    function storeSecretObjectHash ( string memory str )  public isOwner() hashProvided(str){
        secretObjectHash = str;
    }

    function getFileHash () public isOwner() view  returns(string memory) {
        return fileHash;
    }

    function getSecretObjectHash () public isOwner() view  returns(string memory) {
        return secretObjectHash;
    }

    function registerDoctor ( string memory publicKey   )  public isOwner() {
        require(bytes(publicKey).length > 0, 'You need to  provide a public key');
        doctorsPubKeys.push(publicKey);
        doesDoctorHaveAccess[publicKey] = false;
    }

    modifier userExists(address _userId) {
        require (_userId != address(0x0), 'The user should exist');
        _;
    }

    modifier publickKeyProvided(string memory str) {
        require (bytes(str).length > 0, 'You need to provide a publick key');
        _;
    }

    modifier hashProvided(string memory str) {
        require (bytes(str).length > 0, 'You need to provide a hash');
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, 'You are not the owner of this contract');
        _;
    }

 }