import React, { useState } from 'react';
import Input from '../Common/Input';
import Select from '../Common/Select';
import Button from '../Common/Button';
import { validateStudentRegistration } from '../../utils/validation';

const StudentRegistrationForm = ({ 
  offerings, 
  courses, 
  courseTypes, 
  onSubmit, 
  onCancel 
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [courseOfferingId, setCourseOfferingId] = useState('');
  const [filterCourseType, setFilterCourseType] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateStudentRegistration(
      firstName, 
      lastName, 
      email, 
      courseOfferingId
    );
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({ 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth,
      address: address.trim(),
      courseOfferingId,
      paymentStatus,
      notes: notes.trim()
    });
    
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setDateOfBirth('');
    setAddress('');
    setCourseOfferingId('');
    setFilterCourseType('');
    setPaymentStatus('pending');
    setNotes('');
    setErrors([]);
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : 'Unknown';
  };

  const getCourseTypeName = (courseTypeId) => {
    const courseType = courseTypes.find((ct) => ct.id === courseTypeId);
    return courseType ? courseType.name : 'Unknown';
  };

  const filteredOfferings = filterCourseType
    ? offerings.filter(o => o.courseTypeId === filterCourseType)
    : offerings;

  const offeringOptions = filteredOfferings.map((o) => ({
    value: o.id,
    label: `${getCourseTypeName(o.courseTypeId)} - ${getCourseName(o.courseId)}`,
  }));

  const courseTypeOptions = courseTypes.map((ct) => ({
    value: ct.id,
    label: ct.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Personal Information Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            required
            error={errors.find(e => e.includes('First name'))}
          />

          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            required
            error={errors.find(e => e.includes('Last name'))}
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          required
          error={errors.find(e => e.includes('Email') || e.includes('email'))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />

          <Input
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="label">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter full address"
            className="input-field resize-none"
            rows="2"
          />
        </div>
      </div>

      {/* Course Information Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Course Information</h4>
        
        <Select
          label="Filter by Course Type (Optional)"
          value={filterCourseType}
          onChange={(e) => {
            setFilterCourseType(e.target.value);
            setCourseOfferingId('');
          }}
          options={courseTypeOptions}
          placeholder="All course types"
        />

        <Select
          label="Course Offering"
          value={courseOfferingId}
          onChange={(e) => setCourseOfferingId(e.target.value)}
          options={offeringOptions}
          placeholder="Select a course offering"
          required
          error={errors.find(e => e.includes('course offering'))}
        />
      </div>

      {/* Payment Information Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
        
        <Select
          label="Payment Status"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'partial', label: 'Partial' },
            { value: 'paid', label: 'Paid' }
          ]}
        />
      </div>

      {/* Additional Notes Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Additional Notes</h4>
        
        <div className="mb-4">
          <label className="label">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional information about the student"
            className="input-field resize-none"
            rows="3"
          />
        </div>
      </div>
      
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <ul className="list-disc list-inside text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white">
        <Button type="submit" variant="success" className="flex-1">
          Register Student
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default StudentRegistrationForm;
