import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { BrowserRouter as Link } from "react-router-dom";
import Logo from "./img/ProjectBuilder Logo.png";

function NavBar() {
  const name = useSelector((state) => state.auth.name);
  return (
    <div>
      <Navbar className="header">
        <Navbar.Brand>
          <img src={Logo} alt="Project Builder" width="60" height="60" />
        </Navbar.Brand>
        <Navbar.Collapse>
          <Nav>
            <Link to="/projects">Projects</Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justfy-content-end">
          <Navbar.Text>Signed in as {name}</Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;
