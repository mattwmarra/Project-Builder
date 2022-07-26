import axios from "axios";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { signInAction } from "./actions";
import validator from "validator";

const Registration = ({ show, closeModal }) => {
  const handleClose = () => {
    closeModal();
  };
  const dispatch = useDispatch();
  const [state, setState] = useState({
    email: "",
    name: "",
    password: "",
  });
  const handleSubmit = () => {
    if (validator.isEmail(state.email)) {
      registerNewAccount();
    } else {
      console.error("invalid email");
    }
  };
  const registerNewAccount = () => {
    axios
      .post("register", {
        email: state.email,
        name: state.name,
        password: state.password,
      })
      .then((res) => {
        dispatch(signInAction(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (e) => {
    let field = e.target.id;
    setState({
      ...state,
      [field]: e.target.value,
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create an Account</Modal.Title>
      </Modal.Header>
      <Form>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          id="email"
          onChange={handleChange}
          placeholder="someone@somewhere.com"
        ></Form.Control>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="string"
          id="name"
          onChange={handleChange}
          placeholder="Someone Somename"
        ></Form.Control>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          id="password"
          onChange={handleChange}
          placeholder="Some Password"
        ></Form.Control>

        <Button className="button" onClick={handleSubmit}>
          Create Account
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Form>
    </Modal>
  );
};

export default Registration;
