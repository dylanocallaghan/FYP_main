import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    quizResponses: {
      cleanliness: 3,
      sleepSchedule: 3,
      sociability: 3,
      guestPolicy: 3,
      personalSpace: 3,
      financialHabits: 3
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message || "Registered!");
  };

  const updateQuiz = (field, value) => {
    setForm({
      ...form,
      quizResponses: { ...form.quizResponses, [field]: parseInt(value) }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <h3>Roommate Preferences (1-5)</h3>
      {Object.keys(form.quizResponses).map((key) => (
        <div key={key}>
          <label>{key}</label>
          <input
            type="number"
            min="1"
            max="5"
            value={form.quizResponses[key]}
            onChange={(e) => updateQuiz(key, e.target.value)}
          />
        </div>
      ))}

      <button type="submit">Register</button>
    </form>
  );
}
