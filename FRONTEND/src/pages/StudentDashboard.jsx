import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";

export default function StudentDashboard() {
  return (
    <>
      <Navigation />
      <Container>
        <h2>Student Dashboard</h2>
        <p>Welcome to your dashboard. Here you can book appointments.</p>
        {/* Future feature: List of teachers and booking form */}
      </Container>
    </>
  );
}