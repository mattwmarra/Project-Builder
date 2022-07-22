import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, Jumbotron } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { signInAction } from './actions';
import validator from 'validator';
const LoginPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [message, setMessage] = useState('');
    const[state, setState]  = useState({
        email : "",
        password : ""
    })
    const handleSubmit = () => {
        if(validator.isEmail(state.email)){
            login()
        }else {
            setMessage("Please enter a valid email");
        }
    }
    const handleChange = (e) => {
        let field = e.target.id;
        setState({
          ...state,
        [field]: e.target.value
        });
      };

    const login = async () => {
        try {
            const res = await axios.post('/login', {
                email : state.email,
                password: state.password
            })
            if(res.status === 200){
                dispatch(signInAction(res.data))    
                history.push("/projects")
            }
        }catch (e){
            console.log(e)
        }
    }
    return(
        <div style={{display:"flex", flexDirection:"column"}}>
            <Jumbotron className="header">
                <h1>Project Builder</h1>
            </Jumbotron>
            <div className='d-flex px-80% flex-column justify-content-center '>
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
                    <Button className="button"onClick={handleSubmit}>Login</Button>
                </Form>
                <p>{message}</p>
                <Link to="/registration">        
                    <Button variant="secondary" size="sm">
                    Or make an account here!
                    </Button>
                </Link>
            </div>
        </div>

    )

}

export default LoginPage;