
// function fetchSecretSauce() {
//     return fetch('https://www.google.com/search?q=secret+sauce');
// }

// function makeASandwich(forPerson, secretSauce) {
//     return {
//         type: 'MAKE_SANDWICH',
//         forPerson,
//         secretSauce,
//     };
// }

// function apologize(fromPerson, toPerson, error) {
//     return {
//         type: 'APOLOGIZE',
//         fromPerson,
//         toPerson,
//         error,
//     };
// }

// function withdrawMoney(amount) {
//     return {
//         type: 'WITHDRAW',
//         amount,
//     };
// }
export function getDoctors(deployedContract) {
    return async function (dispatch) {
        const addresses = await deployedContract.methods.returnDoctorsAddresses().call()
        const count = addresses.length
        console.log(count)
        const doctors = []
        for (let i = 0; i < addresses.length; i++) {
            const haveAccess = deployedContract.methods.doesDoctorHaveAccess(i).call()
            doctors.push({ address: addresses, haveAccess })
        }
        console.log(doctors)
        return dispatch({type: 'SAVE_DOCTORS', payload: doctors})
    };
}


export function addDoctor(deployedContract, address) {
    return async function (dispatch) {
        const gasAmount = await deployedContract.methods.registerDoctor(address).estimateGas()
        deployedContract.methods.registerDoctor(address).send({gas: gasAmount}).once('receipt', (receipt)=> {
            return dispatch(getDoctors(deployedContract))
          })
    };
}