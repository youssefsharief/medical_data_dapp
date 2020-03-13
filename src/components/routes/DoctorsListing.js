import React from 'react'
import { DoctorsTable } from '../tables/DoctorsTable';
import Title from '../text/Title';
import { connect } from 'react-redux';
import { PageContentLayout } from '../layout/PageContentLayout';
import Modal from 'react-modal';
import { addDoctor } from '../../actions';


const mapStateToProps = state => ({ doctors: state.doctorsStore.items, contract: state.ethStore.deplyedContract })
const mapDispatchToProps = dispatch => ({
    addDoctor: (contract, address) => dispatch(addDoctor(contract, address)),
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

        };
    }
    openModal = () => {
        this.setState({ modalIsOpen: true })
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false })
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
                        <input />
                        <button onClick={this.props.addDoctor}>Add</button>
                    </form>

                </Modal>
                <PageContentLayout isRendering={this.props.doctors.length} unAvailabilityText="No users">

                    <DoctorsTable doctors={this.props.doctors} />

                </PageContentLayout>

            </React.Fragment>
        )
    }

}


export const DoctorsListing = connect(mapStateToProps, mapDispatchToProps)(PDoctorsListing)