import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/students/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/students`, form);
      }
      setForm({ name: '', age: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEdit = (student) => {
    setForm({ name: student.name, age: student.age, email: student.email });
    setEditingId(student.id);
  };

  return (
    <div className="container">
      <h1>Student Management</h1>
      
      <div className="form-card">
        <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <button type="submit">{editingId ? 'Update' : 'Add'}</button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setForm({ name: '', age: '', email: '' });
            }}>Cancel</button>
          )}
        </form>
      </div>

      <div className="table-container">
        <h2>Student List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.email}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center'}}>No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
