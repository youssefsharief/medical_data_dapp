import React, { Component } from "react";
import { dealWithDocument } from "../../actions";
import { connect } from 'react-redux';


const mapStateToProps = state => ({
  contract: state.ethStore.deployedContract,
  myAccountAddress: state.ethStore.account,
  fileHash: state.documentStore.fileHash,
  doctors: state.doctorsStore.items,
  myAddress: state.ethStore.account,
  secretObjectHash: state.documentStore.secretObjectHash
})
const mapDispatchToProps = dispatch => ({
  dealWithDocument: (contract, myAccountAddress, doctors, dataUrl) => dispatch(dealWithDocument(contract, myAccountAddress, doctors, dataUrl)),
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
      this.setState({ dataUrl: reader.result })
    };
    reader.readAsDataURL(file);
  };

  onSubmit = event => {
    event.preventDefault();
    console.log('this.state.dataUrl', this.state.dataUrl);
    this.props.dealWithDocument(this.props.contract, this.props.myAccountAddress, this.props.doctors, this.state.dataUrl)
  };

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main>


            <div>
              <h6> {this.props.fileHash ? 'Yes you have a document saved for yourself' : 'Naa, you do not have a document'}  </h6>
              <div>
                {this.props.fileHash && 'URL:    https://ipfs.infura.io/ipfs/' + this.props.fileHash}
              </div>
            </div>

            <div>
              <div>
                {this.props.secretObjectHash && 'Secret Object URL:    https://ipfs.infura.io/ipfs/' + this.props.secretObjectHash}
              </div>
            </div>


            <form onSubmit={this.onSubmit}>
              <div>
                <label className="mr-2">Upload your medical document:</label>
                <input type="file" onChange={this.captureFile} />
                <input className="btn btn-warning" type="submit" />
              </div>
            </form>
          </main>
        </div>
      </div>
    );
  }
}

export const DocumentPage = connect(mapStateToProps, mapDispatchToProps)(PDocumentPage)