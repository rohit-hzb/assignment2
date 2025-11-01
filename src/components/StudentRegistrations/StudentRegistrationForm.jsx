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
  const [courseOfferingId, setCourseOfferingId] = useState('');
  const [filterCourseType, setFilterCourseType] = useState('');
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
      courseOfferingId 
    });
    
    setFirstName('');
    setLastName('');
    setEmail('');
    setCourseOfferingId('');
    setFilterCourseType('');
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
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Select
        label="Filter by Course Type (Optional)"
        value={filterCourseType}
        onChange={(e) => {
          setFilterCourseType(e.target.value);
          setCourseOfferingId(''); // Reset offering when filter changes
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
      
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <ul className="list-disc list-inside text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
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
