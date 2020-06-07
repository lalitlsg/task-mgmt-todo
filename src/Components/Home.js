import React, { useState, useEffect } from "react";
import "/home/gslab/react/todo/src/App.css";
import { Container, Row, Col, Card ,Button, Navbar, Modal, InputGroup, FormControl, Badge
} from "react-bootstrap";

const Home = (props) => {
  const [tasks, setTasks] = useState([]);

  const [show, setShow] = useState(false);
  const [data, setData] = useState({
      taskName: "",
      dueDate: "",
      selectedCategory: "",
      status:""
  });

  const [tasklist, setTaskList] = useState({
      taskListArray:[]
  })


  async function FetchData() {
    let getTasks = await fetch("http://0.0.0.0:5010/tasks");
    let tasklist = await getTasks.json();

    setTasks(tasklist.data);
    console.log("called")
  }

  async function markDone(id) {
    let response = await fetch("http://0.0.0.0:5010/tasks", {
      method: "PUT",
      body: JSON.stringify({
        id: id
      })
    });

    let result = await response.json();
    FetchData();
  }

  async function deleteTask(id) {
    let response = await fetch("http://0.0.0.0:5010/tasks", {
      method: "DELETE",
      body: JSON.stringify({
        id: id
      })
    });
    let result = await response.json();
    FetchData();
  }

  const MarkDone = props => {
    if (props.status === "Ongoing") {
      return (
        <small
          className="card-button"
          onClick={() => {
            markDone(props.id);
          }}
        >
          Mark as done
        </small>
      );
    } else {
      return (
        <small
          className="card-button"
          onClick={() => {
            deleteTask(props.id);
          }}
        >
          Delete Task
        </small>
      );
    }
  };

  const TaskCard = props => {
    console.log(props);
    return (
      <Card style={{ width: "25rem", margin: "5px" }}>
        <Card.Body>
          <Card.Title>{props.task.taskName}</Card.Title>
          <Card.Text>
            <div
              className="card-item"
              style={{
                backgroundColor:
                  props.task.status === "Completed" ? "#b3ffb3" : null
              }}
            >
              <ul>
                <li>Due Date : {props.task.dueDate}</li>
                <li>Category : {props.task.selectedCategory}</li>
                <li>
                  Status : {props.task.status}
                  &nbsp;
                  <span
                    className={
                      props.task.status === "Ongoing" ? "dot-green" : "dot-red"
                    }
                  ></span>
                  <MarkDone
                    status={props.task.status}
                    id={props.task._id.$oid}
                  />
                </li>
              </ul>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  
  useEffect(() => {
    FetchData();
  }, []);

  const handleClose = () => {
    setShow(false);
    clearData();
}
const handleShow = () => setShow(true);

const clearData = () => {
    setData({
        taskName: "",
        dueDate: "",
        selectedCategory: "",
        status:""
    })
}


const getData = (event) => {
    // console.log(event.target.value)
    const { name, value } = event.target
    setData((preValue) => {
        // console.log(preValue)
        return {
            ...preValue,
            [name]: value

        }
    })
}

const selectCategory = (category) => {


    setData((preValue) => {
        // console.log(preValue)
        return {
            ...preValue,
            selectedCategory: category,
            status:"Ongoing"

        }
    })
}

async function saveData() {
    
    let response = await fetch("http://0.0.0.0:5010/tasks", {
        method: 'POST',
        body: JSON.stringify(data)
    });

    let result = await response.json();

    let getTasks = await fetch("http://0.0.0.0:5010/tasks")
    let tasklist = await getTasks.json();
    setTaskList({
        taskListArray: tasklist
    })

    FetchData();
    handleClose();


}



  let taskCard = tasks.map(task => {
    return (
      <Col sm="4" xs="12">
        <TaskCard task={task} />
      </Col>
    );
  });
  return (
      <>
      <Navbar className="custom-nav" expand="lg">
                <Navbar.Brand href="#home">Task Management To-do List</Navbar.Brand>
                <Button onClick={handleShow}>Add Task</Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Body>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1"
                                    style={{
                                        width: 100
                                    }}
                                >Enter Task</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Enter Task Name"
                                type="text"
                                onChange={getData}
                                value={data.taskName}
                                name="taskName"
                                autoComplete="off"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text
                                    style={{
                                        width: 100
                                    }}
                                    id="basic-addon1">Due Date</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Enter Due Date"
                                type="date"
                                onChange={getData}
                                value={data.dueDate}
                                name="dueDate"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text
                                    style={{
                                        width: 100
                                    }}
                                    id="basic-addon1">Category</InputGroup.Text>
                            </InputGroup.Prepend>
                            <div>
                                {data.selectedCategory == "personal" ?
                                    <Badge className="category"
                                        style={{ backgroundColor: "green" }}
                                    >Personal</Badge> :
                                    <Badge className="category"
                                        onClick={() => { selectCategory("personal") }}
                                    >Personal</Badge>
                                }

                                {data.selectedCategory == "work" ?
                                    <Badge className="category"
                                        style={{ backgroundColor: "green" }}
                                    >Work</Badge> :
                                    <Badge className="category"
                                        onClick={() => { selectCategory("work") }}
                                    >Work</Badge>
                                }

                                {data.selectedCategory == "shopping" ?
                                    <Badge className="category"
                                        style={{ backgroundColor: "green" }}
                                    >Shopping</Badge> :
                                    <Badge className="category"
                                        onClick={() => { selectCategory("shopping") }}
                                    >Shopping</Badge>
                                }

                                {data.selectedCategory == "other" ?
                                    <Badge className="category"
                                        style={{ backgroundColor: "green" }}
                                    >Other</Badge> :
                                    <Badge className="category"
                                        onClick={() => { selectCategory("other") }}
                                    >Other</Badge>
                                }
                            </div>
                        </InputGroup>

                        <Button onClick={saveData}>Save</Button>
                        <Button onClick={handleClose}
                            style={{ float: 'right', backgroundColor: 'tomato', border: 'none' }}>Cancel</Button>
                    </Modal.Body>

                </Modal>
            </Navbar>
      <Container fluid>
        <Row>{taskCard}</Row>
      </Container>
      </>
  );
};

export default Home;
