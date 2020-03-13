import React from 'react'
import { TableLayout } from './TableLayout';

export const DoctorsTable = ({ doctors, onGrantClick, onRevokeClick }) => (

    <TableLayout
        TableHeaders={() =>
            <React.Fragment>
                <th>Address</th>
                <th>Access</th>
            </React.Fragment>
        }


        TableBodyContent={() => Object.keys(doctors).map((address, index) =>
            (
                <tr key={index}>
                    <td>{address}</td>


                    <td className="text-center ">
                        {
                            doctors[address].haveAccess ?
                                <button className="link" onClick={() => onRevokeClick(address)}>
                                    <i className="fa fa-thumbs-down text-danger"> </i>
                                </button>
                                :
                                <button className="link" onClick={() => onGrantClick(address)}>
                                    <i className="fa fa-thumbs-down text-success"> </i>
                                </button>
                        }
                    </td>


                </tr>
            ))}

    />

)