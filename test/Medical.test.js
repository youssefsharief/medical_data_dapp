

const M = artifacts.require("Medical");
require('chai')
.use(require('chai-as-promised'))
.should();

contract(M,(accounts)=>{
    let m;
    before(async () =>{
        m = await M.deployed();
    });

    it.only('The smart contract deployment should be done successfully',async() =>{
        const address = await m.address;
        assert.notEqual(address,0x0);
        assert.notEqual(address,'');
        assert.notEqual(address,null);
        assert.notEqual(address,undefined);
    });

    it.only ('return d', async ()=>{
        assert.equal(await m.returnD(), 'a');
    });
  

});
