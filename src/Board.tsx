import React, { useContext, useEffect, useReducer, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Accordion,
  AccordionContext,
  Button,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { addTask, changeParent, fetchTasks } from "./actions";
import Loading from "./components/Loading";
import { TaskCard } from "./TaskCard";

import axios from "axios";

export const Board = (props) => {
  const activeProject = useSelector((state) => state.projects.activeProject);
  const tasks = useSelector((state) => state.project.columns);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const dispatch = useDispatch();

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      let [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      removed.parent = destination.droppableId;
      let payload = {
        source,
        destination,
        sourceColumn,
        destColumn,
        sourceItems,
        destItems,
        removed,
      };

      axios
        .post("/updateTasks", {
          updatedTask: removed,
        })
        .then((res) => {
          removed.lastMovedDate = res.data.lastMovedDate;
        })
        .catch((err) => {
          console.log(err);
        });
      dispatch(changeParent(payload));
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.tasks];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedItems,
        },
      });
    }
  };

  const getTasksFromDatabase = () => {
    axios
      .get("/api", {
        // get columns by their parent id. should result in the same thing
        //params : activeProject.id
      })
      .then((res) => {
        let [data] = res.data;
        const dataColumns = data.columns;
        let newState = {};
        for (const key of dataColumns) {
          newState[key._id] = {
            _id: key._id,
            name: key.name,
            tasks: data.tasks.filter((obj) => {
              return obj.parent === key._id;
            }), //jankey fix, should be better once I learn aggregation better
            //pull the tasks from tasks array by using the reference keys in the column.tasks array
          };
        }
        dispatch(fetchTasks(newState));
        setLoading(false);
      })
      .catch((err) => {
        //handle failure
        console.log("Found Error: ", err);
      });
  };

  useEffect(() => {
    getTasksFromDatabase();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, tasks, setColumns)}
      >
        <Container>
          <Row>
            {Object.entries(tasks).map(([_id, column]) => {
              return (
                <Droppable droppableId={_id} key={_id} style={{ margin: 8 }}>
                  {(provided, snapshot) => {
                    return (
                      <div>
                        <div
                          style={{
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <h3 style={{ paddingTop: 12 }}>{column.name}</h3>
                          <h5>{column.tasks.length} tasks</h5>
                        </div>
                        <Col
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e94560"
                              : "#16213e",
                            padding: 4,
                            width: 280,
                            margin: 16,
                            minHeight: 80,
                            borderRadius: 4,
                          }}
                        >
                          <AddTaskToggle _id={_id}></AddTaskToggle>
                          {column.tasks.map((task, index) => {
                            return (
                              <Draggable
                                key={task._id}
                                draggableId={task._id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <TaskCard
                                      key={task._id}
                                      task={task}
                                      provided={provided}
                                      snapshot={snapshot}
                                    ></TaskCard>
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

const AddTaskToggle = (props) => {
  const currentEventKey = useContext(AccordionContext);
  const tasks = useSelector((state) => state.project.columns);
  const [toggle, setToggle] = useState(false);
  const [activeKey, setActiveKey] = useState(0);

  return (
    <Accordion activeKey={activeKey}>
      <Accordion.Toggle
        as={Button}
        size="sm"
        className="button"
        eventKey="0"
        block
        onClick={() => setToggle(!toggle)}
      >
        {toggle ? "Cancel" : "Add Task"}
      </Accordion.Toggle>
      <Accordion.Collapse
        eventKey="0"
        style={{ width: "93%", margin: "0 auto" }}
      >
        <AddTask
          rootClose="true"
          tasks={tasks}
          _id={props._id}
          toggleForm={(e) => setActiveKey(e)}
        />
      </Accordion.Collapse>
    </Accordion>
  );
};

export const AddTask = (props) => {
  const [values, setValues] = useState({
    title: "",
    description: "",
  });
  const dispatch = useDispatch();
  const { tasks, _id } = props;

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTaskToColumn(tasks, _id, values);
    }
  };

  const addTaskToColumn = (tasks, _id, values) => {
    const column = tasks[_id];
    axios
      .post("/addTask", {
        title: values.title,
        content: values.description,
        parentID: _id,
      })
      .then((res) => {
        console.log(res.data);
        const newItem = res.data;
        console.log(res.data);
        const columnItems = [...column.tasks];
        columnItems.splice(column.index, 0, newItem);
        dispatch(
          addTask({
            columnItems,
            _id,
          })
        );
      });
  };

  return (
    <div style={{ backgroundColor: "#0f3460" }}>
      <Form>
        <Form.Text>Task Title</Form.Text>
        <Form.Control
          id="title"
          autoComplete="off"
          onKeyPress={(e) => handleKeyPress(e)}
          onChange={(event) =>
            setValues({
              title: event.target.value,
              description: values.description,
            })
          }
          value={values.title}
        ></Form.Control>
        <Form.Text>Task Description</Form.Text>
        <Form.Control
          id="description"
          autoComplete="off"
          placeholder="(Optional)"
          onChange={(event) =>
            setValues({ title: values.title, description: event.target.value })
          }
        ></Form.Control>
        <Button
          block
          size="sm"
          style={{ marginTop: "3px" }}
          disabled={values.title.length === 0}
          onClick={() => {
            addTaskToColumn(tasks, _id, values);
          }}
        >
          Add
        </Button>
      </Form>
    </div>
  );
};

export default withRouter(Board);
