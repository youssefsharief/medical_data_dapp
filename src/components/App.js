import React, { Component } from 'react';
import './App.css';
import Addressbar from './Addressbar'
import { BrowserRouter, Route } from 'react-router-dom';
import { DoctorsListing } from './routes/DoctorsListing';
import { OldView } from './routes/OldView';
import { connect } from 'react-redux';
import Web3 from 'web3';
import Medical from '../abis/Medical'
import { Navbar } from './layout/Navbar'
import { getDoctors } from '../actions';



const mapStateToProps = state => ({ account: state.ethStore.account })
const mapDispatchToProps = dispatch => ({
  saveAccounts: (payload) => dispatch({ type: 'SAVE_ACCOUNT', payload }),
  getDoctors: (deployedContract) => dispatch(getDoctors(deployedContract)),
  setEthState: obj => dispatch({type: 'SET_ETH_STATE', payload: obj})
})


class Appa extends Component {
  state = {

  }
  async getWeb3Provider() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
  async componentDidMount() {
    await this.appInititiated();
  }

  async appInititiated() {
    await this.getWeb3Provider()
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.props.saveAccounts(accounts)
    const networkId = await web3.eth.net.getId()
    const networkData = Medical.networks[networkId];
    if (networkData) {
      const deployedContract = new web3.eth.Contract(Medical.abi, networkData.address);
      console.log(deployedContract.methods)
      this.props.getDoctors(deployedContract)
      this.props.setEthState({deployedContract, account: accounts[0]})
      // const doctors = ['0x0176507cc937Fba82CA648Da8E8c92693be3C666', '0x7F21F4FA0803A8B015B7d01Cad832a1c0153019c', '0xC81542a3Dd3c6630Bda3dd0a3b22C9b44C947FC4']
      // const gasAmount = await deployedContract.methods.registerDoctors(doctors).estimateGas({ from: accounts[0] })

      // deployedContract.methods.registerDoctors(doctors).send({ from: accounts[0], gas: gasAmount })
      // const items = []
      // for (var i = 1; i <= totalNumber; i++) {
      //   const item = await deployedContract.methods.items(i).call();
      //   items.push(item)
      // }
      // this.props
      // return Observable.of({items, totalNumber, deployedContract})
    } else {
      window.alert('Contract is not found in your blockchain.')
    }


  }

  render() {
    return (
      <BrowserRouter>
        <Navbar />
        <div>
          <Addressbar account={this.props.account} />
        </div>
        <Route path="/doctors" component={DoctorsListing} />
        <Route path="/main" component={OldView} />
      </BrowserRouter>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(Appa)
export default App;
