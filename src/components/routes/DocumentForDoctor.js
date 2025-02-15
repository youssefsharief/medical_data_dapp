import React, { Component } from "react";
import { connect } from 'react-redux';
import { showMyEncryptedSecret } from "../../actions";
import Modal from 'react-modal';
import { getFile } from "../../services/file.service";
import './DocumentForDoctor.css';
import { ModalCLoseButton } from "../core/ModalCloseButton";

const mapStateToProps = state => ({ fileHash: state.documentStore.fileHash, secretObjectHash: state.documentStore.secretObjectHash, myAccountAddress: state.ethStore.account, myEncryptedSecretKey: state.documentStore.myEncryptedSecretKey })
const mapDispatchToProps = dispatch => ({
  showMyEncryptedSecret: (secretObjectHash, myAccountAddress) => dispatch(showMyEncryptedSecret(secretObjectHash, myAccountAddress)),
  openErrorMoadalForWrongSecretKey : () => dispatch({
    type: 'OPEN_ERROR_MODAL',
    message: 'Wrong secret key'
  })
})

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export class PDocumentForDoctorPage extends Component {

  state = {
    modalIsOpen: false,
    input: ''
  };

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  }

  downloadFile = async () => {
    try {
      await getFile(this.props.fileHash, this.state.input)
    } catch(e) {
      this.closeModal()
      this.props.openErrorMoadalForWrongSecretKey()
    }
    
  }

  render() {
    return (
      <div className="container-fluid mt-5">

        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Ente secret key modal"
        >
          <ModalCLoseButton onClick={this.closeModal} />
          <form>
            <div className="form-group">
              <input name="decryptedSecret" className="form-control" onChange={this.handleChange} placeholder="Enter decrypted secret" />
            </div>
          </form>
          <button className="btn btn-warning" onClick={this.downloadFile}>GetFile</button>

        </Modal>


        <div className="row">
          <main>
            <div>
              {this.props.fileHash ? 'Patient\'s document URL:    https://ipfs.infura.io/ipfs/' + this.props.fileHash : 'No files are saved for the patient'}
            </div>
            <div>
              {this.props.secretObjectHash && 'Secret Object URL:    https://ipfs.infura.io/ipfs/' + this.props.secretObjectHash}
            </div>
            {this.props.secretObjectHash && <button onClick={() => this.props.showMyEncryptedSecret(this.props.secretObjectHash, this.props.myAccountAddress)} className="btn btn-warning mt-10">Get My Encrypted Secret Key</button>}


            {this.props.myEncryptedSecretKey &&



              <div className="secret-block mt-10">
                <button className="btn btn-link"  onClick={() => {navigator.clipboard.writeText(this.props.myEncryptedSecretKey)}}>Copy</button>
                <div className="body mt-10">
                  {this.props.myEncryptedSecretKey}
                </div>

              </div>

            }

            <div>
              <button onClick={this.openModal} className="btn btn-warning mt-10">Get File</button>
            </div>

          </main>
        </div>
      </div>
    );
  }
}

export const DocumentForDoctorPage = connect(mapStateToProps, mapDispatchToProps)(PDocumentForDoctorPage)