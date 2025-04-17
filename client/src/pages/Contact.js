import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>About Us</h2>
      <p>
        <strong>Student Housing Helper</strong> is a platform built to simplify the student housing experience in Ireland. 
        Our goal is to connect students with compatible roommates and suitable housing based on lifestyle, preferences, and location.
      </p>
      <p>
        We understand through our own personal expierence how hard it is to find reliable accommodation while managing college life. That’s why we’re developing smarter tools that make it easier for students to match, connect, and move in, without stress.
      </p>
      <p>
        Whether you're moving for the first time or looking for a better housing setup, we're here to help.
      </p>
      
      <h2>Contact</h2>
      <p>
        Have questions, feedback, or need help finding the right place? We're here to help!
        Reach out to our team and we’ll get back to you as soon as possible.
      </p>
      <p>Email: <a href="mailto:Contact@StudentHousingHelper.ie">Contact@StudentHousingHelper.ie</a></p>

      <h2>Our Mission</h2>
        <p>
        We’re on a mission to make student accommodation simple, trustworthy, and tailored to real student life.
        From matching with like-minded roommates to exploring verified listings, we’re building tools to help you live better during college.
        </p>


        <h2>Coming Soon</h2>
        <ul>
        <li>Verified landlord badges</li>
        <li>Mobile app for iOS and Android</li>
        <li>Support for more Irish universities</li>
        <li>And much, much more</li>
        </ul>

    </div>
  );
};

export default Contact;
