import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Table, Button, Badge } from "react-bootstrap";
import api from "../services/api";

export default function TeacherDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // We need an endpoint to get appointments for the logged-in teacher.
    // Currently we don't have a specific "get my appointments" for teacher in routes?
    // Let's assume we will add it or have it. 
    // Wait, appointment.routes.js has no GET. I need to add it.
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // Create this endpoint first!
      const { data } = await api.get("/appointments/my-appointments"); 
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h2>Teacher Dashboard</h2>
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
                  {app.status === 'cancelled' && (
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
