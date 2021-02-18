import React, { useState } from 'react';
import { Accordion, Button, Card, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { changePriority, renameTask } from './actions';
import {FaInfoCircle} from 'react-icons/fa'
const axios = require('axios');

export const TaskCard = (props) => {
  const dispatch = useDispatch();
  const task = useSelector(state => state.project.columns);

  const capitalize = (string) => {
    if(typeof string != 'string'){
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const convertToLocal = (date) => {
    let newDate = new Date(date);
    return (newDate.toLocaleDateString() + " at " + newDate.toLocaleTimeString()) 
  }

  const [state, setState] = useState({
    editTitle: false,
    editContent: false,
    props: props.task,
    tempData: props.task
  });

  const setPriorityColor = (priority) => {
    switch (priority) {
      case "low": {
        return 'success';
      }
      case "medium": {
        return 'warning';
      }
      case "high": {
        return "danger";
      }
      default: {
        return 'primary';
      }
    }
  };

  const handleDoubleClick = (e) => {
    console.log(e.target);
    switch (e.target.id) {
      case "title": {
        setState({
          ...state,
          editContent: false,
          editPriority: false,
          editTitle: !state.editTitle
        });
        break;
      }
      case "priority": {
        setState({
          ...state,
          editContent: false,
          editTitle: false,
          editPriority: !state.editPriority
        });
        break;
      }
      case "content": {
        setState({
          ...state,
          editContent: !state.editContent,
          editTitle: false,
          editPriority: false
        });
        break;
      }
      default: {
        //do nothing
      }
    }
  };

  const handleKeyPress = (e) => {
    let editField = "edit" + e.target.id[0].toUpperCase() + e.target.id.slice(1);
    if (e.key === 'Enter') {
      setState({
        ...state,
        [editField]: false
      });
      dispatch(renameTask(state.props));
      console.log(task);

      axios.post('/updateTasks', {
        updatedTask: state.props
      }).then((res) => {
        console.log(res.data);
      });

    }
    else if (e.key === "Escape") {
      setState({
        props: state.tempData,
        [editField]: false
      });
    }
  };

  const changeCardPriority = (value) => {
    console.log(task);
    let newTask = {
      ...state.props,
      priority: value
    };
    setState({
      ...state,
      props: newTask
    });
    axios.post('/updateTasks', {
      updatedTask: newTask
    }).then((res) => {
      console.log(res.data);
    });
    dispatch(changePriority(newTask));

  };

  const handleChange = (e) => {
    let field = e.target.id;
    setState({
      ...state,
      props: {
        ...props.task,
        [field]: e.target.value
      }
    });
  };
  return (
    <div>
      <Card
        id={props.task.id}
        bg={setPriorityColor(state.props.priority)}
        text={setPriorityColor(state.props.priority) === 'light' ? 'dark' : 'white'}
        ref={props.provided.innerRef}
        {...props.provided.draggableProps}
        {...props.provided.dragHandleProps}
        style={{
          userSelect: 'none',
          margin: 8,
          backgroundColor: "#fff",
          // boxShadow: props.snapshot.isDragging ? "10px 10px 5px -4px rgba(97,97,97,0.37)" : "none",
          ...props.provided.draggableProps.style
        }}>
        <Accordion>
          <div>
            {!state.editTitle
              ?
              <Card.Header id={"title"} onDoubleClick={handleDoubleClick}
                style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                {state.props.title}
                <Accordion.Toggle as={Button} variant="link" style={{ color: "#ffffff" }} eventKey="0" size="sm">
                  <FaInfoCircle size={20}/>
                  </Accordion.Toggle>
              </Card.Header>
              :
              <Card.Header onKeyPress={handleKeyPress} onChange={handleChange}>
                <Form.Control id={"title"} autoComplete={"off"} placeholder={props.task.title}></Form.Control>
              </Card.Header>}
          </div>
          <Accordion.Collapse eventKey="0">
            <Card.Body background='white'>
                {!state.editContent ?
                <Card.Text id={"content"} onDoubleClick={handleDoubleClick}>{state.props.content} </Card.Text>
                :
                <Form.Control id={"content"} placeholder={props.task.content} autoComplete={"off"} onKeyPress={handleKeyPress} onChange={handleChange}></Form.Control>
                }
              <Card.Subtitle>Last Modified: {props.task.lastMovedDate !== undefined ? convertToLocal(props.task.lastMovedDate) : "N/A"}</Card.Subtitle>
                <br></br>
                {!state.editPriority ?
                <Card.Subtitle id={"priority"} onDoubleClick={handleDoubleClick} variant={setPriorityColor(state.props.priority)}>Priority: {capitalize(state.props.priority)}</Card.Subtitle>
                :
                <DropdownButton title={"Priority: " + capitalize(state.props.priority)}  variant={setPriorityColor(state.props.priority)} style={{height : 40, margin : 0}}>
                  <Dropdown.Item onClick={() => changeCardPriority("low")}>Low</Dropdown.Item>
                  <Dropdown.Item onClick={() => changeCardPriority("medium")}>Medium</Dropdown.Item>
                  <Dropdown.Item onClick={() => changeCardPriority("high")}>High</Dropdown.Item>
                </DropdownButton>}
            </Card.Body>
          </Accordion.Collapse>

        </Accordion>
      </Card>
    </div>
  );
};
