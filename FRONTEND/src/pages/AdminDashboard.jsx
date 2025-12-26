import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import api from "../services/api";

export default function AdminDashboard() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [teacherForm, setTeacherForm] = useState({ name: "", department: "", subject: "", user_id: "" }); // Need user_id for linking

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

  // Note: Adding a teacher currently requires a linked User ID. 
  // For this simple prototype, maybe we just list users and allow promoting them to teacher?
  // Or we manually input a User ID (which is bad UX).
  // Ideally: Select a user from a list of "all users" to make them a teacher.
  // OR: Create a new User AND Teacher at the same time.
  
  // Let's implement "Create Teacher Account" which creates both User and Teacher profile.
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    // Complex flow: Register User -> Get ID -> Create Teacher
    // Doing this from frontend is okay for prototype.
    try {
        // 1. Create User
        const userRes = await api.post("/auth/register", {
            name: teacherForm.name,
            email: teacherForm.email,
            password: "password123", // Default password
            role: "teacher"
        });
        
        // 2. Create Teacher Profile
        await api.post("/teachers", {
            user_id: userRes.data._id,
            name: teacherForm.name,
            department: teacherForm.department,
            subject: teacherForm.subject
        });
        
        setMessage(`Teacher ${teacherForm.name} added! Default password: password123`);
        setTeacherForm({ name: "", email: "", department: "", subject: "" });
    } catch (err) {
        setMessage("Failed to add teacher.");
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
                    <Form.Control placeholder="Name" required onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Control type="email" placeholder="Email" required onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Control placeholder="Department" required onChange={e => setTeacherForm({...teacherForm, department: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Control placeholder="Subject" required onChange={e => setTeacherForm({...teacherForm, subject: e.target.value})} />
                </Form.Group>
                <Button type="submit">Add Teacher</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
