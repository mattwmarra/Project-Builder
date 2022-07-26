import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Jumbotron, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { signInAction } from "./actions";
import validator from "validator";
import logo from "./img/ProjectBuilder Logo.png";
import { LoginPageAlert } from "./components/LoginPageAlert";
import Registration from "./Registration";

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const closeModal = () => {
    setRegisterModalVisible(false);
  };
  const handleSubmit = () => {
    if (validator.isEmail(state.email)) {
      login();
    } else {
      setMessage("Please enter a valid email");
    }
  };
  const handleChange = (e) => {
    let field = e.target.id;
    setState({
      ...state,
      [field]: e.target.value,
    });
  };

  const login = async () => {
    try {
      const res = await axios.post("/api/login", {
        email: state.email,
        password: state.password,
      });
      if (res.status === 200) {
        dispatch(signInAction(res.data));
        history.push("/projects");
      }
    } catch (e: Error) {
      const status = e.response.status;
      switch (status) {
        case 403: {
          setMessage("Invalid Password");
          break;
        }
        case 404: {
          setMessage("User does not exist");
          break;
        }
        default: {
          setMessage("There was an unknown error");
        }
      }
    }
  };
  return (
    <div>
      <Jumbotron className="header">
        <img src={logo} alt="Project Builder"></img>
      </Jumbotron>
      <Container fluid="md">
        <Col className="justify-content-md-center">
          <Form>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                id="email"
                placeholder="Enter email"
                onChange={handleChange}
              ></Form.Control>
              <Form.Text className="text-muted">
                We'll never share your email with anyone.
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                onChange={handleChange}
                placeholder="Password"
              ></Form.Control>
            </Form.Group>
            <Button className="button" onClick={handleSubmit}>
              Login
            </Button>
            <Button
              className="button"
              variant="secondary"
              size="sm"
              onClick={() => setRegisterModalVisible(true)}
            >
              Or make an account here!
            </Button>
          </Form>
          {/* <Link to="/registration"> */}
          {/* </Link> */}
          {message.length !== 0 ? <LoginPageAlert message={message} /> : null}
        </Col>
        <div className="waves"></div>
      </Container>
      <Registration show={registerModalVisible} closeModal={closeModal} />
    </div>
  );
};

export default LoginPage;
