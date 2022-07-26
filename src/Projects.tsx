import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setProjects, setActive } from "./actions";
import Loading from "./components/Loading";
import { Button } from "react-bootstrap";
const ProjectsPage = () => {
  const userID = useSelector((state) => state.isLogged.id);
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

  const getUserProjects = () => {
    axios
      .get("/api/getUserProjects", {
        _id: userID,
      })
      .then((res) => {
        console.log(res);
        dispatch(setProjects(res.data));
        setData(res.data);
        setLoading(false);
      });
  };
  if (loading) {
    return <Loading />;
  }
  console.log(data);
  if (!data.projects) {
    return (
      <div>
        <h3>Looks like you don't have any projects</h3>
        <Button variant="primary">Click here to make your first one!</Button>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "5%",
        }}
      >
        {data.map((project) => {
          return (
            <Link
              to="/board"
              key={project._id}
              id={project._id}
              onClick={() => setActiveProject(project.name, project._id)}
            >
              <Card style={{ width: 400 }}>
                <Card.Title style={{ color: "black", textAlign: "center" }}>
                  {project.name}
                </Card.Title>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  }
};

export default ProjectsPage;
