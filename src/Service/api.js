import axios from "axios";

const usersUrl = 'http://localhost:3000/api';

export const getTask = async (id) => {
    return await axios.get(`${usersUrl}/task/${id}`)
}

export const listTask = async () => {
    return await axios.get(`${usersUrl}/list`);
}

export const addTask = async (task) => {
    console.log('task', task)
    return await axios.post(`${usersUrl}/create`, task);
}

export const deleteTask = async (id) => {
    return await axios.delete(`${usersUrl}/delete/${id}`);
}

export const editTask = async (id, task) => {
    console.log(`id :${id} + task: ${task}`)
    return await axios.put(`${usersUrl}/update/${id}`, task)
}