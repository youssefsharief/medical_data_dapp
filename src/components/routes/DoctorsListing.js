import React from 'react'
import { DoctorsTable } from '../tables/DoctorsTable';
import Title from '../text/Title';
import { connect } from 'react-redux';
import { PageContentLayout } from '../layout/PageContentLayout';
import Modal from 'react-modal';
import { addDoctor, giveAccess, revokeAccess } from '../../actions';


const mapStateToProps = state => ({ doctors: state.doctorsStore.items, contract: state.ethStore.deployedContract, myAccount: state.ethStore.account })
const mapDispatchToProps = dispatch => ({
    addDoctor: (contract, address, myAccount) => dispatch(addDoctor(contract, address, myAccount)),
    grant: (contract, address, myAccount) => dispatch(giveAccess(contract, address, myAccount)),
    revoke: (contract, address, myAccount) => dispatch(revokeAccess(contract, address, myAccount)),
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
                <h2 onClick={this.openModal}>Open</h2>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"

                >
                    <button onClick={this.closeModal}>close</button>
                    <form>
                        <input onChange={ this.handleChange }/>
                       
                    </form>
                    <button onClick={ () => this.props.addDoctor(this.props.contract, this.state.input, this.props.myAccount)}>Add</button>

                </Modal>
                <PageContentLayout isRendering={Object.keys(this.props.doctors).length} unAvailabilityText="No doctors">

                    <DoctorsTable doctors={this.props.doctors} onGrantClick={ (doctorAddress) => this.props.grant(this.props.contract, doctorAddress, this.props.myAccount)}  onRevokeClick={ (doctorAddress) => this.props.revoke(this.props.contract, doctorAddress, this.props.myAccount)} />

                </PageContentLayout>

            </React.Fragment>
        )
    }

}


export const DoctorsListing = connect(mapStateToProps, mapDispatchToProps)(PDoctorsListing)