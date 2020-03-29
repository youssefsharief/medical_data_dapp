import React, { Component } from 'react';
import './App.css';
import Addressbar from './Addressbar'
import { BrowserRouter, Route } from 'react-router-dom';
import { DoctorsListing } from './routes/DoctorsListing';
import { connect } from 'react-redux';
import Web3 from 'web3';
import Medical from '../abis/Medical'
import { Navbar } from './layout/Navbar'
import { getDoctors, getFileHash } from '../actions';
import { DocumentPage } from './routes/DocumentPage';
import { ErrorModal } from './core/ErrorModal';



const mapStateToProps = state => ({ account: state.ethStore.account, contract: state.ethStore.deployedContract })
const mapDispatchToProps = dispatch => ({
  saveAccounts: (payload) => dispatch({ type: 'SAVE_ACCOUNT', payload }),
  getDoctors: (deployedContract, account) => dispatch(getDoctors(deployedContract, account)),
  setEthState: obj => dispatch({type: 'SET_ETH_STATE', payload: obj}),
  getFileHash: (contract) => dispatch(getFileHash(contract))
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
      this.props.setEthState({deployedContract, account: accounts[0]})
      this.props.getDoctors(deployedContract, accounts[0])
      this.props.getFileHash(this.props.contract)
    } else {
      window.alert('Contract is not found in your blockchain.')
    }


  }

  render() {
    return (
      
      <BrowserRouter>
          <Navbar />
          <ErrorModal></ErrorModal>
          <DocumentPage></DocumentPage>
        <div>
          <Addressbar account={this.props.account} />
        </div>
        <Route path="/doctors" component={DoctorsListing} />
        {/* <Route path="/documnent" component={DocumentPage} /> */}
      </BrowserRouter>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(Appa)
export default App;
