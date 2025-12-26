import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";

export default function TeacherDashboard() {
  return (
    <>
      <Navigation />
      <Container>
        <h2>Teacher Dashboard</h2>
        <p>Manage your appointments here.</p>
        {/* Future feature: List of appointments to approve/reject */}
      </Container>
    </>
  );
}