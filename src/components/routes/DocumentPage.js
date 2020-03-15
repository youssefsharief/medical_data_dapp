import React, { Component } from "react";
import { storeFileHash } from "../../actions";
import { connect } from 'react-redux';
import { AES, enc } from 'crypto-js';

const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });


const mapStateToProps = state => ({ contract: state.ethStore.deployedContract, myAccountAddress: state.ethStore.account, hash: state.documentStore.hash })
const mapDispatchToProps = dispatch => ({
  storeFileHash: (contract, myAccountAddress, hash) => dispatch(storeFileHash(contract, myAccountAddress, hash)),
})


export class PDocumentPage extends Component {
  state = {
    dataUrl: undefined
  }
  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    
    reader.onloadend = () => {
      this.setState({dataUrl: reader.result})
    };
    reader.readAsDataURL(file);
  };

  // decrypt = (encrypted) => {
  //   const dataUrl = 
  // }

  onSubmit = event => {
    event.preventDefault();
    console.log('this.state.dataUrl', this.state.dataUrl);
    const encryptedString = AES.encrypt(this.state.dataUrl, 'secret key 123').toString()
    const decryptedString = AES.decrypt(encryptedString, 'secret key 123').toString(enc.Utf8)
    console.log(decryptedString)
    ipfs.files.add(Buffer(encryptedString), (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("File added succesfully");
      console.log("IPFS result", result);

      this.props.storeFileHash(this.props.contract, this.props.myAccountAddress, result[0].hash);
    });
  };

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main>
            <div>
              <h3> {this.props.hash ? 'Yes you have a document saved for yourself' : 'Naa, you do not have a document'}  </h3>
              <div>
                {this.props.hash && 'URL:    https://ipfs.infura.io/ipfs/' + this.props.hash}
              </div>
            </div>
            <form onSubmit={this.onSubmit}>
              <div>
                <label className="mr-2">Upload your medical document:</label>
                <input type="file" onChange={this.captureFile} />
                <input type="submit" />
              </div>
            </form>
          </main>
        </div>
      </div>
    );
  }
}

export const DocumentPage = connect(mapStateToProps, mapDispatchToProps)(PDocumentPage)