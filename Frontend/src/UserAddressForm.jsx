// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./UserAddressForm.css";

const UserAddressForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = "http://localhost:8000/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, address }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setName("");
        setAddress("");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>User Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <button className="sub-btn" type="submit">
          Submit
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UserAddressForm;
