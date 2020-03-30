import React from 'react'
import { DoctorsTable } from '../tables/DoctorsTable';
import Title from '../text/Title';
import { connect } from 'react-redux';
import { PageContentLayout } from '../layout/PageContentLayout';
import Modal from 'react-modal';
import { addDoctor, giveAccess, revokeAccess } from '../../actions';
import { ModalCLoseButton } from '../core/ModalCloseButton';


const mapStateToProps = state => ({ doctors: state.doctorsStore.items, contract: state.ethStore.deployedContract, myAccountAddress: state.ethStore.account })
const mapDispatchToProps = dispatch => ({
    addDoctor: (contract, pubkey, myAccountAddress) => dispatch(addDoctor(contract, pubkey, myAccountAddress)),
    grant: (contract, pubkey, myAccountAddress) => dispatch(giveAccess(contract, pubkey, myAccountAddress)),
    revoke: (contract, pubkey, myAccountAddress) => dispatch(revokeAccess(contract, pubkey, myAccountAddress)),
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

export class PDoctorsListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            input: ''
        };
    }
    openModal = () => {
        console.log(this.props)
        this.setState({ modalIsOpen: true })
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false })
    }

    handleChange = (e) =>  {
        this.setState({ input: e.target.value });
    }


    render() {
        return (
            <React.Fragment>
                <Title> Doctors </Title>
                <div> 
                <button className="btn btn-warning" onClick={this.openModal}>Add doctor</button>
                </div>
                
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"

                >
                    <ModalCLoseButton onClick={this.closeModal} />
                    <form className="mt-10">
                        <input className="form-control" onChange={ this.handleChange } placeholder="Enter doctor's public key"/>
                       
                    </form>
                    <button className="btn btn-warning mt-10" onClick={ () => this.props.addDoctor(this.props.contract, this.state.input, this.props.myAccountAddress)}>Add</button>

                </Modal>
                <PageContentLayout isRendering={Object.keys(this.props.doctors).length} unAvailabilityText="No doctors">

                    <DoctorsTable doctors={this.props.doctors} onGrantClick={ (doctorPubKey) => this.props.grant(this.props.contract, doctorPubKey, this.props.myAccountAddress)}  onRevokeClick={ (doctorPubKey) => this.props.revoke(this.props.contract, doctorPubKey, this.props.myAccountAddress)} />

                </PageContentLayout>

            </React.Fragment>
        )
    }

}


export const DoctorsListing = connect(mapStateToProps, mapDispatchToProps)(PDoctorsListing)