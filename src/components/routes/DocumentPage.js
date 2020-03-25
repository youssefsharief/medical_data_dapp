import React, { Component } from "react";
import { dealWithDocument } from "../../actions";
import { connect } from 'react-redux';


const mapStateToProps = state => ({ contract: state.ethStore.deployedContract, myAccountAddress: state.ethStore.account, hash: state.documentStore.hash, doctors: state.doctorsStore.items, myAddress: state.ethStore.account })
const mapDispatchToProps = dispatch => ({
  dealWithDocument: (contract, myAccountAddress, doctors) => dispatch(dealWithDocument(contract, myAccountAddress, doctors)),
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
    this.props.dealWithDocument(this.props.contract, this.props.myAccountAddress, this.props.doctors)
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