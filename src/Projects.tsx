import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setProjects, setActive } from "./actions";
import Loading from "./components/Loading";
import { Button } from "react-bootstrap";

function ProjectsPage() {
  const userID = useSelector((state) => state.auth.id);
  const projects = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const setActiveProject = (name, id) => {
    dispatch(
      setActive({
        name: name,
        id: id,
      })
    );
  };

  const getUserProjects = async () => {
    const res = await axios.get("/api/getUserProjects", {
      params: {
        id: userID,
      },
    });
    dispatch(setProjects(res.data));
    setData(res.data);
    setLoading(false);
  };

  const createNewProject = async () => {
    const res = await axios.post("/api/createNewProject", {
      name: "Project 1",
      id: userID,
    });
  };

  useEffect(() => {
    getUserProjects();
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (!projects) {
    return (
      <div>
        <h3>Looks like you don't have any projects</h3>
        <Button variant="primary" onClick={createNewProject}>
          Click here to make your first one!
        </Button>
      </div>
    );
  } else {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "5%",
        }}
      >
        <Col>
          <h2>Your Projects</h2>
          <Row>
            {data.map((project) => {
              return (
                <Link
                  to="/board"
                  key={project._id}
                  id={project._id}
                  onClick={() => setActiveProject(project.name, project._id)}
                >
                  <Card style={{ width: 400, margin: "1rem" }}>
                    <Card.Body>
                      <Card.Title>{project.name}</Card.Title>
                      <Card.Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              );
            })}
          </Row>
        </Col>
      </Container>
    );
  }
}

export default ProjectsPage;
