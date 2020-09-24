import { render } from '@testing-library/react';
import React from 'react';
import { Button, Form, Jumbotron } from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import {signInAction} from './actions'

const LoginPage = () => {
    const dispatch = useDispatch();
    return(
        <div style={{display:"flex", flexDirection:"column"}}>
            <Jumbotron>
                <h1>Project Builder</h1>
            </Jumbotron>
            <div style={{width: '80%', margin:"0 auto"}}>
                <Form>
                    <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email"></Form.Control>
                        <Form.Text className="text-muted">We'll never share your email with anyone.</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"></Form.Control>
                    </Form.Group>
                    <Link to="/board"><Button variant="primary" type="submit" onClick={() => dispatch(signInAction()) }>Login</Button></Link>
                </Form>
            </div>
        </div>

    )

}

export default LoginPage;