import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Form,
  FormControl,
  FormLabel,
  FormGroup,
  Button,
  Table,
  Navbar,
  Nav
} from "react-bootstrap";
import "./App.css";
import {
  listTask,
  addTask,
  deleteTask,
  editTask,
  getTask,
} from "./Service/api";
import { useParams, Link, Routes, Route,  Router } from "react-router-dom";

import ReactPaginate from "react-paginate";
import ReactDOM from "react-dom";
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import flatpickr from "flatpickr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Chart from "./pages/chart";

function App() {
  const initialValue = {
    title: "",
    description: "",
    reminder: ""
  };

  const { speak } = useSpeechSynthesis();
  // const { listen, listening, stop } = useSpeechRecognition({
  //   onResult: (result) => {
  //     setTask(result);
  //   },
  // });
  const [task, setTask] = useState(initialValue);
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [pageNumber, setpageNumber] = useState(0);
  const { title, description, reminder } = task;
  const { id } = useParams();
  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;

  const displayUsers = tasks.slice(pagesVisited, pagesVisited + usersPerPage);
  const pageCount = Math.ceil(tasks.length / usersPerPage);
  const changePage = ({ selected }) => {
    setpageNumber(selected);
  };

  useEffect(() => {
    taskList();
  }, []);

  // const createNotification = (type) => {
  //   return () => {
  //     NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
  //   }
  // }

  const onValueChange = (e) => {
    //  console.log('eeeeeee', { [e.target.name]: e.target.value })
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleDate = (e) => {
    var selectDay = moment(e).format('YYYY-MM-DD HH:mm:ss');
    setStartDate(e);
    setTask({ ...task, reminder: selectDay })
  }

  const taskList = async () => {
    let result = await listTask();
    // console.log("result", result.data.data);
    setTasks(result.data.data);
  };

  const taskDelete = async (id) => {
    await deleteTask(id);
    taskList();
  };

  const taskUpdate = async (id, task) => {
    // console.log("update id", id);
    // console.log("update task", task);
    setTask(task);
  };

  const taskLoad = async (text) => {
    //console.log('text', text)
    speak({ text: text })
  }

  // {flatpickr("#input", {})};

  const taskAdd = async () => {
    //  console.log('task-------------', task)
    let data = {
      description: task.description,
      title: task.title,
      // reminder: task.reminderDate.concat(` ${task.reminderTime}`)
      reminder: task.reminder
    }
    console.log('data', data)
    if (task.id) {
      console.log("update");
      await editTask(task.id, data);
      setTask(initialValue);
      setStartDate(new Date())
      taskList();
    } else {
      console.log("add");
      await addTask(data);
      setTask(initialValue);
      setStartDate(new Date())
      taskList();
    }
  };

  return (
    <div>
      <Container>
        <>
        
        </>
        { }
        <Row>
          <Form id="">
            <FormGroup>
              <FormLabel>Enter Title</FormLabel>
              <FormControl
                type="text"
                name="title"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => {
                  onValueChange(e);
                }}
              ></FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel>Enter Description</FormLabel>
              <FormControl
                type="text"
                name="description"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => {
                  onValueChange(e);
                }}
              ></FormControl>
            </FormGroup>
            <FormLabel>Set Reminder</FormLabel>
            <DatePicker
              className="dateInput"
              selected={startDate}
              onChange={(e) => handleDate(e)}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
            />


            <Button onClick={() => taskAdd()}>Save</Button>
            <Button><i class="fas fa-angle-double-right"></i></Button>
          </Form>
        </Row>

        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Reminder</th>
              <th>Update</th>
              <th>Delete</th>
              <th>Speack</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((t) => {
              // console.log('reminder', new Date(t.reminder))
              return (
                <tr>
                  <th>{t.id}</th>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td>{t.reminder}</td>
                  {/* <td><button className='btn btn-info'
                    onClick={this.createNotification('info')}>Info
                  </button></td> */}
                  <td><Button variant="warning" size="sm" id="update" onClick={() => taskUpdate(t.id, t)}> Edit </Button></td>
                  <td><Button variant="danger" size="sm" onClick={() => taskDelete(t.id)}> Delete </Button></td>
                  <td><Button variant="success" size="sm" onClick={() => taskLoad(t.title)}> Speack </Button></td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <ReactPaginate
          previousLabel={"< Previous"}
          nextLabel={"next >"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      </Container>
    </div>
  );
}

export default App;
