import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Table, Button, Modal, Form, Alert, Row, Col, Badge, Card } from "react-bootstrap";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [bookingData, setBookingData] = useState({ date: "", time: "", message: "" });
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTeachers();
    fetchMyAppointments();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/teachers");
      setTeachers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/my-appointments");
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      fetchMyAppointments();
      setMessage("Appointment deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to delete appointment.");
    }
  };

  const handleBookClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShow(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/appointments", {
        teacher: selectedTeacher._id,
        ...bookingData
      });
      setMessage("Appointment booked successfully!");
      setShow(false);
      fetchMyAppointments();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.errors 
        ? err.response.data.errors.map(e => e.msg).join(", ") 
        : err.response?.data?.message || "Failed to book appointment.";
      setMessage(errorMsg);
    }
  };

  const filteredTeachers = searchQuery.trim() === "" 
    ? [] 
    : teachers.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      case 'cancelled': return <Badge bg="secondary">Cancelled</Badge>;
      default: return <Badge bg="warning" text="dark">Pending</Badge>;
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <Card className="mt-4 mb-4 bg-light shadow-sm">
            <Card.Body>
                <h2>Welcome, {user?.name || "Student"}!</h2>
                <p className="text-muted mb-0">Role: Student</p>
            </Card.Body>
        </Card>
        {message && <Alert variant="info">{message}</Alert>}
        
        <Row className="mt-4 mb-3 align-items-center">
            <Col md={8}>
                <h4>Find a Teacher</h4>
            </Col>
            <Col md={4}>
                <Form.Control 
                    type="text" 
                    placeholder="Search by Name, Department, or Subject..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Subject</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.department}</td>
                <td>{t.subject}</td>
                <td>
                  <Button size="sm" onClick={() => handleBookClick(t)}>Book Appointment</Button>
                </td>
              </tr>
            ))}
            {searchQuery.trim() === "" && (
              <tr><td colSpan="4" className="text-center text-muted">Type in the search box to find a teacher.</td></tr>
            )}
            {searchQuery.trim() !== "" && filteredTeachers.length === 0 && (
              <tr><td colSpan="4" className="text-center">No teachers found matching your search.</td></tr>
            )}
          </tbody>
        </Table>

        <Row className="mt-5">
            <Col>
                <h4>My Appointments</h4>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Teacher</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(app => (
                            <tr key={app._id}>
                                <td>{app.teacher?.name || "N/A"}</td>
                                <td>{app.date}</td>
                                <td>{app.time}</td>
                                <td>{getStatusBadge(app.status)}</td>
                                <td>
                                    {(app.status === 'approved' || app.status === 'rejected' || app.status === 'cancelled') && (
                                        <Button size="sm" variant="danger" onClick={() => deleteAppointment(app._id)}>Delete</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {appointments.length === 0 && (
                            <tr><td colSpan="5" className="text-center">You haven't booked any appointments yet.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>

        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Book Appointment with {selectedTeacher?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleBookSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" required onChange={e => setBookingData({...bookingData, date: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Control type="time" required onChange={e => setBookingData({...bookingData, time: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Reason for appointment..." onChange={e => setBookingData({...bookingData, message: e.target.value})} />
              </Form.Group>
              <Button type="submit">Confirm Booking</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
