import React, { Component } from "react";
import { connect } from 'react-redux';


const mapStateToProps = state => ({ myAccountAddress: state.ethStore.account, fileHash: state.documentStore.fileHash, doctors: state.doctorsStore.items, secretObjectHash: state.documentStore.secretObjectHash })
const mapDispatchToProps = dispatch => ({
  
})


export class PDocumentForDoctorPage extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main>
            <div>
              <div>
                {this.props.fileHash && 'Patient\'s document URL:    https://ipfs.infura.io/ipfs/' + this.props.fileHash}
              </div>
            </div>
            

            <div>
              <div>
                {this.props.secretObjectHash && 'Secret Object URL:    https://ipfs.infura.io/ipfs/' + this.props.secretObjectHash}
              </div>
            </div>
            
          </main>
        </div>
      </div>
    );
  }
}

export const DocumentForDoctorPage = connect(mapStateToProps, mapDispatchToProps)(PDocumentForDoctorPage)