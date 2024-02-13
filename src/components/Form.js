import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

function Form() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [editingId, setEditingId] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);//for combobox
    const [searchQuery, setSearchQuery] = useState('');//for searchbox

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangeCombo = (event, newValue) => {
        setSelectedOption(newValue);
    };

    const filterUsers = (query) => {
        return users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    const filteredUsersByText = filterUsers(searchQuery);
    const filteredUsersByAutocomplete = selectedOption ? [selectedOption] : users;

    const filteredUsers = filteredUsersByText.filter(user =>
        filteredUsersByAutocomplete.find(u => u.id === user.id)
    );
    

    //call data from json-server that i built myself
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users');
            setUsers(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    //eventHandler for geting name and email from user
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //eventHandler for add or edit user data
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId === null) {
            await addUser(formData);
        } else {
            await updateUser(editingId, formData);
        }
        setFormData({ name: '', email: '' });
        setEditingId(null);
    };

    const addUser = async (userData) => {
        try {
            await axios.post('http://localhost:3000/users', userData);
            fetchData();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const updateUser = async (id, updatedUserData) => {
        try {
            await axios.put(`http://localhost:3000/users/${id}`, updatedUserData);
            fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleEdit = (id) => {
        const userToEdit = users.find(user => user.id === id);
        setFormData({ name: userToEdit.name, email: userToEdit.email });
        setEditingId(id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <div style={{display:"flex" , justifyContent:"space-between" , width:"1400px", margin:"auto", marginTop:"60px"}}>
            <form onSubmit={handleSubmit}>
                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} sx={{marginRight:"10px"}}/>
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} sx={{marginRight:"10px"}} />
                <Button variant="contained" color="primary" type="submit" sx={{height:"56px"}}>{editingId !== null ? 'Update' : 'Submit'}</Button>
            </form>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={users}
              filterOptions={(users, { inputValue }) =>
                  users.filter((user) =>
                  user.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
              value={selectedOption}
              onChange={handleChangeCombo}
              getOptionLabel={(user) => user.name}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Users" />}
            />
            <TextField
                label="Search by Name"
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                
                style={{ marginBottom: 16 , width:"300px" }}
            />
            </div>
            
            <TableContainer component={Paper} sx={{width:"1200px" , margin:"auto" , marginTop:"40px"}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell style={{ width: '170px' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" sx={{marginRight:"10px"}} onClick={() => handleEdit(user.id)}>Edit</Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Form;


