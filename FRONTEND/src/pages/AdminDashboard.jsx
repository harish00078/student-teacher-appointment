import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";

export default function AdminDashboard() {
  return (
    <>
      <Navigation />
      <Container>
        <h2>Admin Dashboard</h2>
        <p>System administration.</p>
        {/* Future feature: Add teachers */}
      </Container>
    </>
  );
}