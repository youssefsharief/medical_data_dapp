pragma solidity ^0.5.6;
pragma experimental ABIEncoderV2;

contract Medical{
    address owner;
    constructor() public{
        owner = msg.sender;
    }
    mapping(address => bool) public doesDoctorHaveAccess;
    address[] public doctorsAddresses;
    address private document;
    function accessDocument ( address _patientID ) public view   userExists(_patientID) returns(address ){
        require (doesDoctorHaveAccess [msg.sender] == true, "You do not have an access to this patient's medical records !");
        return document;
    }

    function returnDoctorsAddresses() public view returns(address[] memory) {
        return doctorsAddresses;
    }


    function grantAccessToDoctor ( address a ) public userExists(a) {
        doesDoctorHaveAccess[a] = true;
    }

    function revokeAccessFromDoctor ( address a )  public userExists(a) {
        doesDoctorHaveAccess[a] = false;
    }


    function registerDoctor ( address a  )  public {
        doctorsAddresses.push(a);
        doesDoctorHaveAccess[a] = false;
    }

    function ListOfDoctors(address _patientID) public view  userExists(_patientID) returns(address[] memory) {
        return doctorsAddresses;
    }

    modifier userExists(address _userId) {
        require (_userId != address(0x0), 'The user should exist');
        _;
    }

 }