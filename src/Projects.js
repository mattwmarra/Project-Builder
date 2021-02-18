import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setProjects, setActive } from './actions';
import Loading from './components/Loading';

const ProjectsPage = () => {
    const projectIDs = useSelector(state => state.isLogged.projects);
    const projects = useSelector(state => state.projects);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const setActiveProject = (name, id) => {
        dispatch(setActive({
            name: name,
            id : id
        }))
    }

    const getUserProjects = () => {
        console.log({projectIDs});
        axios.get('/getUserProjects', {
            params : {
                projects : projectIDs
            }
        }).then((res) => {
            dispatch(setProjects(res.data))
            setData(res.data)
            setLoading(false)
        })
    }
    useEffect(() => {
        getUserProjects()
    }, [])

    if(loading){return <Loading/>}

    return(
        <div style={{display: 'flex', justifyContent: "space-evenly", marginTop: "5%"}}>
        {        
        data.map((project) => {
            return(
                <Link to="/board" key={project._id} id={project._id} onClick={(name, id) => setActiveProject(project.name, project._id)}>
                    <Card style={{width: 400}}>
                        <Card.Title style={{color: "black", textAlign:"center"}} >{project.name}</Card.Title>
                    </Card>
                </Link>
            )
        })
        }
        </div>
    )
}

export default ProjectsPage;