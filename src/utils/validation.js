export const validateCourseType = (name) => {
  const errors = [];
  
  if (!name || name.trim() === '') {
    errors.push('Course type name is required');
  } else if (name.trim().length < 2) {
    errors.push('Course type name must be at least 2 characters');
  } else if (name.trim().length > 50) {
    errors.push('Course type name must not exceed 50 characters');
  }
  
  return errors;
};

export const validateCourse = (name) => {
  const errors = [];
  
  if (!name || name.trim() === '') {
    errors.push('Course name is required');
  } else if (name.trim().length < 2) {
    errors.push('Course name must be at least 2 characters');
  } else if (name.trim().length > 100) {
    errors.push('Course name must not exceed 100 characters');
  }
  
  return errors;
};

export const validateCourseOffering = (courseId, courseTypeId) => {
  const errors = [];
  
  if (!courseId) {
    errors.push('Please select a course');
  }
  
  if (!courseTypeId) {
    errors.push('Please select a course type');
  }
  
  return errors;
};

export const validateStudentRegistration = (firstName, lastName, email, courseOfferingId) => {
  const errors = [];
  
  if (!firstName || firstName.trim() === '') {
    errors.push('First name is required');
  } else if (firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (!lastName || lastName.trim() === '') {
    errors.push('Last name is required');
  } else if (lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }
  
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!courseOfferingId) {
    errors.push('Please select a course offering');
  }
  
  return errors;
};
