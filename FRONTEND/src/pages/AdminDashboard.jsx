import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import api from "../services/api";

export default function AdminDashboard() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "", password: "", department: "", subject: "" });

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const { data } = await api.get("/admin/pending-students");
      setPendingStudents(data);
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

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
        await api.post("/admin/create-teacher", teacherForm);
        setMessage(`Teacher ${teacherForm.name} added successfully!`);
        setTeacherForm({ name: "", email: "", password: "", department: "", subject: "" });
    } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Failed to add teacher.");
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
            <Table striped bordered hover>
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
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h4>Add New Teacher</h4>
            <Form onSubmit={handleAddTeacher}>
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
                        placeholder="Password" 
                        required 
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
                <Button type="submit">Add Teacher</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
