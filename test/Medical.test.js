

const M = artifacts.require("Medical");
require('chai')
.use(require('chai-as-promised'))
.should();

contract(M, ([deployer, seller, buyer])=>{
    let instance;

    before(async () => {
        instance = await M.deployed()
    })
    describe('Deployment', async () => {
        it('The deployment should be done successfully', async () => {
            const address = await instance.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    })
    
    before(async () =>{
        instance = await M.deployed();
    });

    describe('Adding a doctor', () => {
        it('should fail if no string is provided for public key', async () => {
            await instance.registerDoctor('', {from: deployer}).should.be.rejected
        })

        it('should work if a string is provided for public key', async () => {
            await instance.registerDoctor('6a9fb88b3488d43f7410b89fbe49b21646097b8ee4e4a6c402799398ec0214c55b60b4dd957704cc57d6609a238edc04288a28999bbc2c01d75d726dcbc0517e', {from: deployer})
            const doctors = await instance.doctorsPubKeys
            console.log(doctors)
        })

    })

});
