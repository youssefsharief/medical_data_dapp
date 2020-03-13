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


        TableBodyContent={() => doctors.map((item, index) =>
            (
                <tr key={index}>
                    <td>{item.address}</td>


                    <td className="text-center ">
                        {
                            item.haveAccess ?
                                <button className="link" onClick={() => onRevokeClick(item.address)}>
                                    <i className="fa fa-thumbs-down text-danger"> </i>
                                </button>
                                :
                                <button className="link" onClick={() => onGrantClick(item.address)}>
                                    <i className="fa fa-thumbs-down text-success"> </i>
                                </button>
                        }
                    </td>


                </tr>
            ))}

    />

)