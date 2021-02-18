import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, Jumbotron } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { signInAction } from './actions';

const LoginPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const[state, setState]  = useState({
        email : "",
        password : ""
    })
    const handleChange = (e) => {
        let field = e.target.id;
        setState({
          ...state,
        [field]: e.target.value
        });
      };
    const login = () => {
        axios.post('login', {
            email : state.email,
            password: state.password
        }).then((res) => {

            if(res.status === 200){
                dispatch(signInAction(res.data))    
                history.push("/projects")
            }
        }).catch((err)=> {
            console.log(err)
        })
    }
    return(
        <div style={{display:"flex", flexDirection:"column"}}>
            <Jumbotron className="header">
                <h1>Project Builder</h1>
            </Jumbotron>
            <div style={{width: '80%', margin:"0 auto"}}>
                <Form>
                    <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" id="email" placeholder="Enter email" onChange={handleChange}></Form.Control>
                        <Form.Text className="text-muted">We'll never share your email with anyone.</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" id="password" onChange={handleChange} placeholder="Password"></Form.Control>
                    </Form.Group>
                    <Button className="button"onClick={login}>Login</Button>
                </Form>
            <Link to="/registration">Or make an account here!</Link>
            </div>
        </div>

    )

}

export default LoginPage;