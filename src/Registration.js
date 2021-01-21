import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { signInAction } from './actions';

const Registration = () => {
    const dispatch = useDispatch();
    const[state, setState]  = useState({
        email : "",
        name : "",
        password : ""
    })
    const registerNewAccount = () => {
        axios.post('register',{
            email : state.email,
            name : state.name,
            password : state.password
        }).then((res) => {
            dispatch(signInAction(res.data))
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleChange = (e) => {
        let field = e.target.id;
        setState({
          ...state,
        [field]: e.target.value
        });
        console.log(state)
      };
    return(
        <Form>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" id="email" onChange={handleChange} placeholder="someone@somewhere.com"></Form.Control>
            <Form.Label>Name</Form.Label>
            <Form.Control type="string" id="name" onChange={handleChange} placeholder="Someone Somename"></Form.Control>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" id="password" onChange={handleChange} placeholder="Some Password"></Form.Control>
            <Button className="button" onClick={registerNewAccount}>Create Account</Button>
        </Form>
    )
}

export default Registration;