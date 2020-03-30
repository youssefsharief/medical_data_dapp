import React from 'react'
import { TableLayout } from './TableLayout';

export const DoctorsTable = ({ doctors, onGrantClick, onRevokeClick }) => (

    <TableLayout
        TableHeaders={() =>
            <React.Fragment>
                <th>Public Key</th>
                <th>Address</th>
                <th>Grant or Revoke Access</th>
            </React.Fragment>
        }


        TableBodyContent={() => Object.keys(doctors).map((pubKey, index) =>
            (
                <tr key={index} style={{
                    background: doctors[pubKey].haveAccess ? 'lightgreen' : 'initial'
                }
                    
                }>
                    <td>{pubKey}</td>
                    <td>{doctors[pubKey].address}</td>


                    <td>
                        {
                            doctors[pubKey].haveAccess ?
                                <button  onClick={() => onRevokeClick(pubKey)} className="btn btn-warning"> Revoke Access </button>
                                :
                                <button  onClick={() => onGrantClick(pubKey)} className="btn btn-warning"> Grant Access </button>
                        }
                    </td>


                </tr>
            ))}

    />

)