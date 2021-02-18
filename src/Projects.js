import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
    const projects = useSelector(state => state.isLogged.projects)
    const [data, setData] = useState([]);
    const getUserProjects = () => {
        console.log(projects)
        axios.get('/getUserProjects', {
            params : {
                projects : projects
            }
        }).then((res) => {
            console.log(res.data)
            setData(res.data);
            
        })
    }
    useEffect(() => {
        getUserProjects()
    }, [])
    return(
        <div style={{display: 'flex', justifyContent: "space-evenly"}}>
        {        
        data.map((project) => {
            return(
                <Link to="/board">
                    <Card style={{width: 400}}>
                        <Card.Title style={{color: "black", textAlign:"center"}}>{project.name}</Card.Title>
                    </Card>
                </Link>
            )
        })
        }
        </div>
    )
}

export default ProjectsPage;