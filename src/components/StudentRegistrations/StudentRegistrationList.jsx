import React, { useState } from 'react';
import { Plus, Search, Filter, Users } from 'lucide-react';
import StudentCard from './StudentCard';
import StudentRegistrationForm from './StudentRegistrationForm';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { generateId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const StudentRegistrationList = ({ 
  registrations, 
  setRegistrations, 
  offerings, 
  courses, 
  courseTypes 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOffering, setFilterOffering] = useState('');

  const handleCreate = (data) => {
    // Check for duplicate email in same offering
    const duplicate = registrations.find(
      r => r.email.toLowerCase() === data.email.toLowerCase() && 
           r.courseOfferingId === data.courseOfferingId
    );
    
    if (duplicate) {
      toast.error('This student is already registered for this course offering!');
      return;
    }

    const newRegistration = {
      id: generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      courseOfferingId: data.courseOfferingId,
      registeredAt: Date.now(),
    };
    
    setRegistrations([...registrations, newRegistration]);
    setIsModalOpen(false);
    toast.success('Student registered successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this student registration?')) {
      setRegistrations(registrations.filter((r) => r.id !== id));
      toast.success('Student registration removed successfully!');
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : 'Unknown';
  };

  const getCourseTypeName = (courseTypeId) => {
    const courseType = courseTypes.find((ct) => ct.id === courseTypeId);
    return courseType ? courseType.name : 'Unknown';
  };

  const getOfferingDetails = (offeringId) => {
    const offering = offerings.find((o) => o.id === offeringId);
    if (!offering) return { courseName: 'Unknown', courseTypeName: 'Unknown' };
    
    return {
      courseName: getCourseName(offering.courseId),
      courseTypeName: getCourseTypeName(offering.courseTypeId),
    };
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const details = getOfferingDetails(reg.courseOfferingId);
    const fullName = `${reg.firstName} ${reg.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.courseTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterOffering || reg.courseOfferingId === filterOffering;
    
    return matchesSearch && matchesFilter;
  });

  const offeringOptions = offerings.map((o) => {
    const details = getOfferingDetails(o.id);
    return {
      value: o.id,
      label: `${details.courseTypeName} - ${details.courseName}`,
    };
  });

  // Calculate statistics
  const totalStudents = registrations.length;
  const uniqueOfferings = new Set(registrations.map(r => r.courseOfferingId)).size;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Registrations</h2>
          <p className="text-gray-600 text-sm mt-1">
            Register students for available course offerings
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="success"
          className="flex items-center space-x-2"
          disabled={offerings.length === 0}
        >
          <Plus size={20} />
          <span>Register Student</span>
        </Button>
      </div>

      {offerings.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            ⚠️ You need to create at least one course offering before registering students.
          </p>
        </div>
      ) : null}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Students</p>
              <p className="text-3xl font-bold mt-1">{totalStudents}</p>
            </div>
            <Users size={40} className="opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Offerings</p>
              <p className="text-3xl font-bold mt-1">{uniqueOfferings}</p>
            </div>
            <Users size={40} className="opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg per Offering</p>
              <p className="text-3xl font-bold mt-1">
                {uniqueOfferings > 0 ? (totalStudents / uniqueOfferings).toFixed(1) : 0}
              </p>
            </div>
            <Users size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          <select
            value={filterOffering}
            onChange={(e) => setFilterOffering(e.target.value)}
            className="input-field pl-10"
          >
            <option value="">All Course Offerings</option>
            {offeringOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchTerm || filterOffering 
              ? 'No student registrations found matching your filters.' 
              : 'No student registrations yet. Register students to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRegistrations.map((registration) => {
            const details = getOfferingDetails(registration.courseOfferingId);
            return (
              <StudentCard
                key={registration.id}
                registration={registration}
                courseName={details.courseName}
                courseTypeName={details.courseTypeName}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Student"
      >
        <StudentRegistrationForm
          offerings={offerings}
          courses={courses}
          courseTypes={courseTypes}
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default StudentRegistrationList;
