import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import api from "../services/api";

export default function StudentDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [bookingData, setBookingData] = useState({ date: "", time: "", message: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/teachers");
      setTeachers(data);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      setMessage("Failed to book appointment.");
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h2>Student Dashboard</h2>
        {message && <Alert variant="info">{message}</Alert>}
        
        <h4 className="mt-4">Available Teachers</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Subject</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.department}</td>
                <td>{t.subject}</td>
                <td>
                  <Button size="sm" onClick={() => handleBookClick(t)}>Book Appointment</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

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
