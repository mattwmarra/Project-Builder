import React from 'react';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {BrowserRouter as Router , Link } from 'react-router-dom';

let NavBar = (props) => {
    return(
        <div>
            <Navbar className="header">
                <Navbar.Brand><span className="nav-title">Project Builder</span></Navbar.Brand>
                <Navbar.Collapse>
                    <Nav>
                        <Link to="/projects">Projects</Link>
                    </Nav>
                    <NavDropdown title={props.projectName + " Links"}>
                        {/* <NavDropdown.Item>
                            <Link to="/dashboard">Dashboard</Link>
                        </NavDropdown.Item>   */}
                        <NavDropdown.Item>
                            <Link to="/board">Tasks</Link>
                        </NavDropdown.Item>
                        {/* <NavDropdown.Item>
                            <Link to="/budget">Budget</Link>
                        </NavDropdown.Item> */}
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar>
        </div>
    ) 
}

export default NavBar