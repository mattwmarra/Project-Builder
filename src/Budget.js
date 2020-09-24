import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap'
import {useLocation, withRouter} from "react-router-dom"

const Budget = () => {
    let location = useLocation()
    useEffect(() => {

    }, [location])
    return(
        <div>
            <h1>Budget</h1>
        </div>
    )
}

export default withRouter(Budget)