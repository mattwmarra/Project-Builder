import React from 'react';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {BrowserRouter as Router , Link } from 'react-router-dom';

let NavBar = (props) => {
    return(
        <div>
            <Navbar bg="light">
                <Navbar.Brand>Project Builder</Navbar.Brand>
                <Navbar.Collapse>
                    <Nav.Link>
                        <Link to="/projects">Projects</Link>
                    </Nav.Link>
                    <NavDropdown title={props.projectName + " Links"}>
                        <NavDropdown.Item>
                            <Link to="/dashboard">Dashboard</Link>
                        </NavDropdown.Item>  
                        <NavDropdown.Item>
                            <Link to="/board">Tasks</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <Link to="/budget">Budget</Link>
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar>
        </div>
    ) 
}

export default NavBar