import React, { useState, useEffect } from 'react';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { validateCourse } from '../../utils/validation';

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (course) {
      setName(course.name);
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateCourse(name);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({ name: name.trim() });
    setName('');
    setErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Course Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Hindi, English, Urdu, Mathematics"
        required
        error={errors[0]}
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
          {course ? 'Update' : 'Create'} Course
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
