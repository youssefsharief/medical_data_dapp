pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Medical{
    address owner;
    constructor() public{
        owner = msg.sender;
    }
    mapping(string => bool) public doesDoctorHaveAccess;
    string[] public doctorsPubKeys;
    address private document;

    function returnDoctorsPubKeys() public view returns(string[] memory) {
        return doctorsPubKeys;
    }


    function grantAccessToDoctor ( string memory a ) public {
        doesDoctorHaveAccess[a] = true;
    }

    function revokeAccessFromDoctor ( string memory a )  public {
        doesDoctorHaveAccess[a] = false;
    }


    function registerDoctor ( string memory a   )  public {
        doctorsPubKeys.push(a);
        doesDoctorHaveAccess[a] = false;
    }

    function ListOfDoctors() public view  returns(string[] memory) {
        return doctorsPubKeys;
    }

    modifier userExists(address _userId) {
        require (_userId != address(0x0), 'The user should exist');
        _;
    }

 }