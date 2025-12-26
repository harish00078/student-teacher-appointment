import { useState } from "react";
import { register } from "../services/auth.service";

export default function Register() {
  const [form, setForm] = useState({});

  const handleRegister = async () => {
    await register(form);
    alert("Registered successfully");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <select onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
