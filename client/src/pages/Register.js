import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    accountType: "student",
    gender: "",
    pronouns: "",
    age: "",
    course: "",
    year: "",
    smoking: "",
    drinking: "",
    pets: "",
    openTo: {
      smokers: false,
      petOwners: false,
      mixedGender: false,
      internationalStudents: false,
    },
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("openTo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        openTo: { ...prev.openTo, [field]: checked },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-header">Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <select name="accountType" onChange={handleChange} required>
          <option value="student">Student</option>
          <option value="listing owner">Listing Owner</option>
        </select>

        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>

        <input name="pronouns" placeholder="Pronouns (e.g. she/her)" onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} />
        <input name="course" placeholder="Course" onChange={handleChange} />

        <select name="year" onChange={handleChange}>
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="Final Year">Final Year</option>
          <option value="Postgraduate">Postgraduate</option>
        </select>

        <select name="smoking" onChange={handleChange}>
          <option value="">Smoker?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="drinking" onChange={handleChange}>
          <option value="">Drinks Alcohol?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="pets" onChange={handleChange}>
          <option value="">Has Pets?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <textarea
          name="bio"
          placeholder="Short bio about yourself..."
          onChange={handleChange}
        />

        <div className="auth-checkboxes">
          <label><input type="checkbox" name="openTo.smokers" onChange={handleChange} /> Open to living with smokers</label>
          <label><input type="checkbox" name="openTo.petOwners" onChange={handleChange} /> Open to living with pet owners</label>
          <label><input type="checkbox" name="openTo.mixedGender" onChange={handleChange} /> Open to mixed-gender households</label>
          <label><input type="checkbox" name="openTo.internationalStudents" onChange={handleChange} /> Open to international students</label>
        </div>

        <button type="submit" className="auth-submit">Register</button>
      </form>
    </div>
  );
}
