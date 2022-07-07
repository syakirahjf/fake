// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Fake {
    address public owner;
    mapping (address => uint) public fmTransaction;
    mapping (address => uint) public fmBalance;
    
    struct Product{
        address creator;
        string productName;
        uint256 productId;
        string date;
    }
    Product product;

    struct Member{
        uint id;
        string name;
        uint balance;
    }
    Member member;

    mapping (uint => Member) public members;
    event savingsEvent(uint indexed _memberId);
    uint public memberCount;


    constructor() {
        owner = msg.sender;
        fmBalance[address(this)] = 1000;
        fmTransaction[address(this)] = 10;

        memberCount = 0;
        addMember("chris",9000);
        addMember("yassin",6000);
    }

    function getBalance() public view returns (uint) {
        return owner.balance;
    }

    function getFMBalance() public view returns (uint) {
        return fmBalance[address(this)];
    }

    function purchase(uint amount) public payable {
        require(msg.value <= amount * 2 ether, "Not enough ether!");
        require(amount * 2 ether >= fmTransaction[address(this)], "Transaction exceed!");
        fmBalance[address(this)] -= amount;
        fmBalance[msg.sender] += amount;
        
    }
    
    function setProduct() public {
      product = Product(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, 'Face Mask Batch 1', 1, '2020-2-2');
    }

    function searchProduct() public returns (string memory) {
        string memory output="Product Name: ";
        output=concat(output, product.productName);
        output=concat(output, "<br>Manufacture Date: ");
        output=concat(output, product.date);
        return output;        
    }

    function concat(string memory _a, string memory _b) public returns (string memory){
        bytes memory bytes_a = bytes(_a);
        bytes memory bytes_b = bytes(_b);
        string memory length_ab = new string(bytes_a.length + bytes_b.length);
        bytes memory bytes_c = bytes(length_ab);
        uint k = 0;
        for (uint i = 0; i < bytes_a.length; i++) bytes_c[k++] = bytes_a[i];
        for (uint i = 0; i < bytes_b.length; i++) bytes_c[k++] = bytes_b[i];
        return string(bytes_c);
    }

    function addMember(string memory _name,uint _balance) public {
        members[memberCount] = Member(memberCount,_name,_balance);
        memberCount++;
    }
    //return Single structure
    function get(uint _memberId) public view returns(Member memory) {
        return members[_memberId];
    }

    //return Array of structure Value
    function getMember() public view returns (uint[] memory, string[] memory,uint[] memory){
        uint[]    memory id = new uint[](memberCount);
        string[]  memory name = new string[](memberCount);
        uint[]    memory balance = new uint[](memberCount);
        
        for (uint i = 0; i < memberCount; i++) {
            Member storage member = members[i];
            id[i] = member.id;
            name[i] = member.name;
            balance[i] = member.balance;
        }
        return (id, name,balance);

  }
    //return Array of structure
    function getMembers() public view returns (Member[] memory){
        Member[]    memory id = new Member[](memberCount);
        for (uint i = 0; i < memberCount; i++) {
            Member storage member = members[i];
            id[i] = member;
        }
        return id;
    }
    
    function transfer(uint amt) public payable{ 
        require(amt >= member.balance, "Transaction more than balance");
        require(amt >= 10000, "Transaction exceed! Might MONEY LAUNDERING"); 
        member.balance -= amt;
        member.balance += amt;
    }

}