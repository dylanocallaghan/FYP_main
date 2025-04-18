import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Login.css";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // set up this information below
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

  // Function to save each field 
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

  // handle the submit
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
      <h2 className="auth-header">{t("register")}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" placeholder={t("name")} onChange={handleChange} required />
        <input name="username" placeholder={t("username")} onChange={handleChange} required />
        <input name="email" type="email" placeholder={t("email")} onChange={handleChange} required />
        <input name="password" type="password" placeholder={t("password")} onChange={handleChange} required />

        <select name="accountType" onChange={handleChange} required>
          <option value="student">{t("student")}</option>
          <option value="listing owner">{t("listingOwner")}</option>
        </select>

        <div className={`student-fields ${formData.accountType === "student" ? "visible" : "hidden"}`}>
          <select name="gender" onChange={handleChange}>
            <option value="">{t("gender")}</option>
            <option value="Male">{t("male")}</option>
            <option value="Female">{t("female")}</option>
            <option value="Non-binary">{t("nonBinary")}</option>
            <option value="Prefer not to say">{t("preferNot")}</option>
          </select>

          <input name="pronouns" placeholder={t("pronouns")} onChange={handleChange} />
          <input name="age" type="number" placeholder={t("age")} onChange={handleChange} />
          <input name="course" placeholder={t("course")} onChange={handleChange} />

          <select name="year" onChange={handleChange}>
            <option value="">{t("selectYear")}</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="Final Year">Final Year</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>

          <select name="smoking" onChange={handleChange}>
            <option value="">{t("smoking")}</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select name="drinking" onChange={handleChange}>
            <option value="">{t("drinking")}</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select name="pets" onChange={handleChange}>
            <option value="">{t("pets")}</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <div className="auth-checkboxes">
            <label><input type="checkbox" name="openTo.smokers" onChange={handleChange} /> {t("openSmokers")}</label>
            <label><input type="checkbox" name="openTo.petOwners" onChange={handleChange} /> {t("openPets")}</label>
            <label><input type="checkbox" name="openTo.mixedGender" onChange={handleChange} /> {t("openGender")}</label>
            <label><input type="checkbox" name="openTo.internationalStudents" onChange={handleChange} /> {t("openInternational")}</label>
          </div>
        </div>

        <textarea
          name="bio"
          placeholder={t("bio")}
          onChange={handleChange}
        />

        <button type="submit" className="auth-submit">{t("submit")}</button>
      </form>
    </div>
  );
}
