import React from 'react';
import { Jumbotron, ProgressBar } from 'react-bootstrap'
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const columns = useSelector(state => state.project.columns);
    const totalTasks = 0;
    const finishedTasks = 0;

    return(
        <div>
            <Jumbotron className="header">
                <h1>Dashboard</h1>
            </Jumbotron>
            <div style={{width: "77%", margin: "0 auto"}}>
                <h2>Project Progress: ({finishedTasks}/{totalTasks})</h2>
                <ProgressBar variant="success" now={50}></ProgressBar>
                <br></br><br></br><br></br>
                <h2>Most Recently Modified Tasks:</h2>
                <br></br><br></br><br></br>
                <h2>Budget Overview:</h2>
            </div>

        </div>
    )

}

export default Dashboard