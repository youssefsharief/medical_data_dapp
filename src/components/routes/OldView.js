import React from 'react'
import { connect } from 'react-redux';


const mapStateToProps = state => ({ doctors: state.doctors.items })
const mapDispatchToProps = dispatch => ({  })


export class POldView extends React.Component {


    render() {
        return (
            <h1> HHHHHHHHH </h1>
        )
    }

}


export const OldView = connect(mapStateToProps, mapDispatchToProps)(POldView)