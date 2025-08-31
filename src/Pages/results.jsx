import React from 'react'
import { useState } from "react";

function Addmission() {
  const [formData, setFormData] = useState({
    studentName: "",
    age: "",
    grade: "",
    email: "",
    guardianName: "",
    guardianPhone: "",
    village: "",
    postOffice: "",
    district: "",
    nationality: "",
    gender: "",
    religion: "",
  });

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      const response = await fetch('http://localhost:5000/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Admission submitted successfully');
        // Reset form or redirect as needed
      } else {
        alert('Failed to submit admission');
      }
    } catch (error) {
      console.error('Error submitting admission:', error);
    }
    // Send `formData` to your server/API here
  };

  return (
    <section className='flex w-full'>
         <div className="md:w-full max-w-2xl mx-auto mt-14 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center">School Admission Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Student Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Applying For Class</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Religion</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>
          </div>

          <div className="mt-4 mb-6">
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          
  <h2 className="text-xl font-semibold mb-4">Address Information</h2>

  <div className="mb-4">
    <label className="block text-sm font-medium">Village</label>
    <input
      type="text"
      name="village"
      value={formData.village || ""}
      onChange={handleChange}
      required
      className="mt-1 p-2 block w-full border rounded-md"
    />
  </div>

  <div className="mb-4">
    <label className="block text-sm font-medium">Post Office</label>
    <input
      type="text"
      name="postOffice"
      value={formData.postOffice || ""}
      onChange={handleChange}
      required
      className="mt-1 p-2 block w-full border rounded-md"
    />
  </div>

  <div className="mb-4">
    <label className="block text-sm font-medium">District</label>
    <input
      type="text"
      name="district"
      value={formData.district || ""}
      onChange={handleChange}
      required
      className="mt-1 p-2 block w-full border rounded-md"
    />
  </div>
</div>

        {/* Guardian Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Guardian Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">Guardian Name</label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Guardian Phone</label>
            <input
              type="tel"
              name="guardianPhone"
              value={formData.guardianPhone}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Guardian Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700"
        >
          Submit Application
        </button>
      </form>
    </div>
    </section>
  )
}

export default Addmission
