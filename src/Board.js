import React, { useState,  useEffect, useReducer } from 'react';
import { Container, Col, Row, Button, OverlayTrigger } from 'react-bootstrap';
import { Card, Popover, Form, Accordion, Badge } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskCard } from "./TaskCard";
import {useLocation, withRouter} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import {fetchTasks, changeParent, addTask} from './actions';

const axios = require('axios')

export const Board = (props) => {
  const [columns, setColumns] = useState([]);
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.project.columns)

  const onDragEnd = (result, columns, setColumns) => {
    if(!result.destination) return;
    const {source, destination} = result;
    if(source.droppableId !== destination.droppableId){
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      let [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);  
      removed.parent = destination.droppableId
      let payload = {
        source,
        destination,
        sourceColumn,
        destColumn,
        sourceItems,
        destItems,
        removed
      }
      
      axios.post('/updateTasks', {
        updatedTask : removed
      }).then((res) => {
        removed.lastMovedDate = res.data.lastMovedDate; 
      }).catch((err) => {
        console.log(err)
      });
      dispatch(changeParent(payload))

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

  const getTasksFromDatabase = () => {
    axios.get('/api', {
    })
    .then((res) => {
      let [data] = res.data;
      const dataColumns = data.columns;
      let newState = {};
      for(const key of dataColumns){
        newState[key._id] = {
          _id : key._id,
          name : key.name,
          tasks : data.tasks.filter(obj => {return (obj.parent === key._id);}) //jankey fix, should be better once I learn aggregation better
          //pull the tasks from tasks array by using the reference keys in the column.tasks array
        }
      }
      dispatch(fetchTasks(newState))
    })
    .catch((err)=>{
      //handle failure
      console.log("Found Error: ", err)
    })
  }

  useEffect(() => {
    getTasksFromDatabase()
  }, [])
  return (
    <div>
          <DragDropContext onDragEnd={result => onDragEnd(result, tasks, setColumns)}>
          <Container>
            <Row>
              {Object.entries(tasks).map(([_id, column]) => {
                return (
                  <Droppable droppableId={_id} key={_id} style={{ margin: 8 }}>
                    {(provided, snapshot) => {
                      return (
                        <div>
                          <div style={{textAlign:"center", display: "flex", justifyContent: "center", flexDirection:"column" }}>
                            <h3 style={{paddingTop: 12}}>{column.name}</h3>
                            <h5>{column.tasks.length} tasks</h5>
                          </div>
                          <div>

                          </div>

                          <Col {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver ? '#e94560' : '#16213e',
                              padding: 4,
                              width: 280,
                              margin: 16,
                              minHeight: 80,
                              borderRadius: 4
                            }}
                          >
                          <OverlayTrigger trigger="click" placement="right"
                              overlay={<EditCardPopover rootClose="true" 
                                tasks={tasks} setColumns={setColumns} _id={_id} />}>
                              <button className="button" style={{width: "93%"}}key={_id}>Add Task</button>
                            </OverlayTrigger>
                            {column.tasks.map((task, index) => { // TODO get tasks from redux store rather than state
                              return (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                  {(provided, snapshot) => {
                                    return (
                                      <TaskCard
                                        task={task}
                                        provided={provided}
                                        snapshot={snapshot}>
                                      </TaskCard>
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

    </div>
  );
};

export const EditCardPopover = (props) => {
   const [values, setValues] = useState({
    title : "",
    description : ""
  })
  const dispatch = useDispatch();
  const {tasks, setColumns, _id} = props;

  const addTaskToColumn = (tasks, setColumns, _id, values) => {
    const column = tasks[_id];
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
      dispatch(addTask({
        columnItems,
        _id
      }))
      setColumns({
        ...tasks,
        [_id] : {
          ...column,
          tasks: columnItems
        }
      })
    })
  }
  

  return(
      <div className="card-popover">
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
              <Button onClick={() => {addTaskToColumn(tasks, setColumns,_id, values)}}>Add</Button>
            </Form>
          </Popover.Content>
        </Popover>
      </div>
  )
}



export default withRouter(Board)