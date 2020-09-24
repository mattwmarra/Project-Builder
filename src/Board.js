import React, { useState,  useEffect } from 'react';
import { Container, Col, Row, Button, OverlayTrigger } from 'react-bootstrap';
import { Card, Popover, Form, Accordion, Badge } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {Category } from './App';
import {useLocation, withRouter} from 'react-router-dom'
const axios = require('axios')

const onDragEnd = (result, columns, setColumns) => {
  if(!result.destination) return;
  const {source, destination} = result;
  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.tasks];
    const destItems = [...destColumn.tasks];
    let [removed] = sourceItems.splice(source.index, 1);

    removed.parent = destination.droppableId
    
    axios.post('/updateTasks', {
      updatedTask : removed
    }).then((res) => {
      console.log(res.data)
      console.log(removed)
      removed.lastMovedDate = res.data.lastMovedDate; 
    }).catch((err) => {
      console.log(err)
    });
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks:sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destItems
      }
    })
    destItems.splice(destination.index, 0, removed);

  }
  else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.tasks]
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId] : {
        ...column,
        tasks: copiedItems
      }
    })
  }
}
export const Board = (props) => {
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    getTasksFromDatabase(setColumns)
  }, [])
  return (
    <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
      <Container>
        <Row>
          {Object.entries(columns).map(([_id, column]) => {
            return (
              <Droppable droppableId={_id} key={_id} style={{ margin: 8 }}>
                {(provided, snapshot) => {
                  return (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <h3>{column.name}</h3>
                        <OverlayTrigger trigger="click" placement="right"
                          overlay={<EditCardPopover rootClose="true" //can only use hooks "nested" by passing as a <Element/> idk why} 
                            columns={columns} setColumns={setColumns} _id={_id} />}>
                          <Button size="sm" key={_id}>Add Task</Button>
                        </OverlayTrigger>

                      </div>
                      <Col {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                          padding: 4,
                          width: 300,
                          margin: 16,
                          minHeight: 500,
                          borderRadius: 4
                        }}
                      >

                        {column.tasks.map((task, index) => {
                          return (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <Category
                                    task={task}
                                    provided={provided}
                                    snapshot={snapshot}>
                                  </Category>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </Col>
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </Row>
      </Container>
    </DragDropContext>
  );
};


const getTasksFromDatabase = ( setColumns) => {
  axios.get('/api', {
  })
  .then((res) => {
    let [data] = res.data;
    console.log(res.data)
    const dataColumns = data.columns;
    let newState = {};
    console.log({data})
    for(const key of dataColumns){
      newState[key._id] = {
        _id : key._id,
        name : key.name,
        tasks : data.tasks.filter(obj => {return (obj.parent === key._id);}) //jankey fix, should be better once I learn aggregation better
        //pull the tasks from tasks array by using the reference keys in the column.tasks array
      }
    }
    setColumns(newState)
  
  })
  .catch((err)=>{
    //handle failure
    setColumns([])
    console.log("Found Error: ", err)
  })
}


const addTaskToColumn = (columns, setColumns, _id, values) => {
  console.log(values)
  const column = columns[_id];

  axios.post("/addTask", {
    title: values.title,
    content : values.description,
    parentID : _id
  }).then((res) =>{
    console.log(res.data)
    const newItem = res.data
    console.log(res.data)
    const columnItems = [...column.tasks];
    columnItems.splice(column.index, 0, newItem);
    setColumns({
      ...columns,
      [_id] : {
        ...column,
        tasks: columnItems
      }
    })
  })
}

export const EditCardPopover = (props) => {
   const [values, setValues] = useState({
    title : "",
    description : ""
  })
  const {columns, setColumns, _id} = props;

  return(
      <div>
        <Popover>
          <Popover.Title>Add Task</Popover.Title>
          <Popover.Content>
            <Form>
              <Form.Text>Task Title</Form.Text>
              <Form.Control id="title" onChange={(event) => setValues({
                title : event.target.value,
                description : values.description
                })} value={values.title}></Form.Control>
              <Form.Text>Task Description</Form.Text>
              <Form.Control id="description" placeholder="(Optional)" onChange={(event) => setValues(
                { title: values.title,
                  description : event.target.value})}></Form.Control>
              <Button onClick={() => {addTaskToColumn(columns, setColumns,_id, values)}}>Add</Button>
            </Form>
          </Popover.Content>
        </Popover>
      </div>
  )
}



export default withRouter(Board)