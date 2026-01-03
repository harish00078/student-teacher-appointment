import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Table, Button, Badge, Alert, Card } from "react-bootstrap";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/my-appointments"); 
      setAppointments(data);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to load appointments", type: "danger" });
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      setMessage({ text: `Appointment ${status} successfully`, type: "success" });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.errors 
        ? err.response.data.errors.map(e => e.msg).join(", ") 
        : err.response?.data?.message || "Failed to update status";
      setMessage({ text: errorMsg, type: "danger" });
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      setMessage({ text: "Appointment deleted successfully", type: "success" });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.message || "Failed to delete appointment", type: "danger" });
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <Card className="mt-4 mb-4 bg-light shadow-sm">
            <Card.Body>
                <h2>Welcome, {user?.name || "Teacher"}!</h2>
                <div className="text-muted">
                    <p className="mb-1"><strong>Department:</strong> {user?.department || "N/A"}</p>
                    <p className="mb-0"><strong>Subject:</strong> {user?.subject || "N/A"}</p>
                </div>
            </Card.Body>
        </Card>
        {message.text && <Alert variant={message.type} onClose={() => setMessage({ text: "", type: "" })} dismissible>{message.text}</Alert>}
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Time</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id}>
                <td>{app.student?.name || "Unknown"}</td>
                <td>{app.date}</td>
                <td>{app.time}</td>
                <td>{app.message}</td>
                <td>
                  <Badge bg={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : app.status === 'cancelled' ? 'secondary' : 'warning'}>
                    {app.status}
                  </Badge>
                </td>
                <td>
                  {app.status === 'pending' && (
                    <>
                      <Button size="sm" variant="success" className="me-2" onClick={() => updateStatus(app._id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(app._id, 'rejected')}>Reject</Button>
                    </>
                  )}
                  {app.status === 'approved' && (
                     <Button size="sm" variant="warning" onClick={() => updateStatus(app._id, 'cancelled')}>Cancel</Button>
                  )}
                  {(app.status === 'cancelled' || app.status === 'rejected') && (
                     <Button size="sm" variant="danger" onClick={() => deleteAppointment(app._id)}>Delete</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
