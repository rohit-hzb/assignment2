import React, { useState, useEffect } from 'react';
import Select from '../Common/Select';
import Button from '../Common/Button';
import { validateCourseOffering } from '../../utils/validation';

const CourseOfferingForm = ({ 
  offering, 
  courses, 
  courseTypes, 
  onSubmit, 
  onCancel 
}) => {
  const [courseId, setCourseId] = useState('');
  const [courseTypeId, setCourseTypeId] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (offering) {
      setCourseId(offering.courseId);
      setCourseTypeId(offering.courseTypeId);
    }
  }, [offering]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateCourseOffering(courseId, courseTypeId);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({ courseId, courseTypeId });
    setCourseId('');
    setCourseTypeId('');
    setErrors([]);
  };

  const courseOptions = courses.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const courseTypeOptions = courseTypes.map((ct) => ({
    value: ct.id,
    label: ct.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Course"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        options={courseOptions}
        placeholder="Select a course"
        required
        error={errors.find(e => e.includes('course'))}
      />

      <Select
        label="Course Type"
        value={courseTypeId}
        onChange={(e) => setCourseTypeId(e.target.value)}
        options={courseTypeOptions}
        placeholder="Select a course type"
        required
        error={errors.find(e => e.includes('course type'))}
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
        <Button type="submit" variant="primary" className="flex-1">
          {offering ? 'Update' : 'Create'} Course Offering
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CourseOfferingForm;
