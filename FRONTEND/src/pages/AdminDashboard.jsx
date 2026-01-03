import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import api from "../services/api";

export default function AdminDashboard() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState("");
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "", password: "", department: "", subject: "" });
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  useEffect(() => {
    fetchPendingStudents();
    fetchTeachers();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const { data } = await api.get("/admin/pending-students");
      setPendingStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/teachers");
      setTeachers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveStudent = async (id) => {
    try {
      await api.put(`/admin/approve-student/${id}`);
      fetchPendingStudents();
      setMessage("Student approved successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
        await api.delete(`/teachers/${id}`);
        setMessage("Teacher deleted successfully");
        fetchTeachers();
    } catch (err) {
        console.error(err);
        setMessage("Failed to delete teacher");
    }
  };

  const handleEditTeacher = (teacher) => {
    setMessage(""); // Clear any previous messages
    setEditingTeacherId(teacher._id);
    setTeacherForm({
        name: teacher.name,
        email: teacher.user_id?.email || "",
        department: teacher.department,
        subject: teacher.subject,
        password: "" // Keep blank to imply no change
    });
  };

  const handleCancelEdit = (e) => {
    if (e) e.preventDefault();
    setMessage("");
    setEditingTeacherId(null);
    setTeacherForm({ name: "", email: "", password: "", department: "", subject: "" });
  };

  const handleAddOrUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
        if (editingTeacherId) {
            await api.put(`/teachers/${editingTeacherId}`, teacherForm);
            setMessage("Teacher updated successfully!");
        } else {
            await api.post("/admin/create-teacher", teacherForm);
            setMessage(`Teacher ${teacherForm.name} added successfully!`);
        }
        
        setTeacherForm({ name: "", email: "", password: "", department: "", subject: "" });
        setEditingTeacherId(null);
        fetchTeachers();
    } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Operation failed.");
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h2>Admin Dashboard</h2>
        {message && <Alert variant="info">{message}</Alert>}

        <Row className="mt-4">
          <Col md={6}>
            <h4>Pending Student Approvals</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>
                      <Button size="sm" onClick={() => approveStudent(s._id)}>Approve</Button>
                    </td>
                  </tr>
                ))}
                {pendingStudents.length === 0 && <tr><td colSpan="3" className="text-center">No pending students</td></tr>}
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h4>{editingTeacherId ? "Edit Teacher" : "Add New Teacher"}</h4>
            <Form onSubmit={handleAddOrUpdateTeacher}>
                <Form.Group className="mb-2">
                    <Form.Control 
                        placeholder="Name" 
                        required 
                        value={teacherForm.name}
                        onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} 
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Control 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={teacherForm.email}
                        onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} 
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Control 
                        type="password" 
                        placeholder={editingTeacherId ? "Password (leave blank to keep current)" : "Password"}
                        required={!editingTeacherId} 
                        value={teacherForm.password}
                        onChange={e => setTeacherForm({...teacherForm, password: e.target.value})} 
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Control 
                        placeholder="Department" 
                        required 
                        value={teacherForm.department}
                        onChange={e => setTeacherForm({...teacherForm, department: e.target.value})} 
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Control 
                        placeholder="Subject" 
                        required 
                        value={teacherForm.subject}
                        onChange={e => setTeacherForm({...teacherForm, subject: e.target.value})} 
                    />
                </Form.Group>
                <Button type="submit" variant={editingTeacherId ? "warning" : "primary"}>
                    {editingTeacherId ? "Update Teacher" : "Add Teacher"}
                </Button>
                {editingTeacherId && (
                    <Button variant="secondary" className="ms-2" onClick={handleCancelEdit} type="button">
                        Cancel
                    </Button>
                )}
            </Form>
          </Col>
        </Row>

        <Row className="mt-5">
            <Col>
                <h4>Manage Teachers</h4>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Subject</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher._id}>
                                <td>{teacher.name}</td>
                                <td>{teacher.user_id?.email || "N/A"}</td>
                                <td>{teacher.department}</td>
                                <td>{teacher.subject}</td>
                                <td>
                                    <Button size="sm" variant="info" className="me-2" onClick={() => handleEditTeacher(teacher)}>Edit</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeleteTeacher(teacher._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                         {teachers.length === 0 && <tr><td colSpan="5" className="text-center">No teachers found</td></tr>}
                    </tbody>
                </Table>
            </Col>
        </Row>
      </Container>
    </>
  );
}
