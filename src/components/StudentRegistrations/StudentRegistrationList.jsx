import React, { useState } from 'react';
import { Plus, Search, Filter, Users, Download, Mail, Phone, BookOpen, Award, Calendar } from 'lucide-react';
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOffering, setFilterOffering] = useState('');
  const [filterCourseType, setFilterCourseType] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, name-asc, name-desc

  const handleCreate = (data) => {
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
      phone: data.phone || '',
      address: data.address || '',
      dateOfBirth: data.dateOfBirth || '',
      courseOfferingId: data.courseOfferingId,
      registeredAt: Date.now(),
      status: 'active',
      paymentStatus: data.paymentStatus || 'pending',
      notes: data.notes || '',
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

  const handleViewDetails = (registration) => {
    setSelectedStudent(registration);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setRegistrations(registrations.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));
    toast.success(`Status updated to ${newStatus}!`);
  };

  const handleUpdatePaymentStatus = (id, newPaymentStatus) => {
    setRegistrations(registrations.map(r => 
      r.id === id ? { ...r, paymentStatus: newPaymentStatus } : r
    ));
    toast.success(`Payment status updated to ${newPaymentStatus}!`);
  };

  const handleExportToCSV = () => {
    if (registrations.length === 0) {
      toast.error('No data to export!');
      return;
    }

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Course', 'Course Type', 'Registration Date', 'Status', 'Payment Status'];
    const csvData = filteredAndSortedRegistrations.map(reg => {
      const details = getOfferingDetails(reg.courseOfferingId);
      return [
        reg.firstName,
        reg.lastName,
        reg.email,
        reg.phone || 'N/A',
        details.courseName,
        details.courseTypeName,
        new Date(reg.registeredAt).toLocaleDateString(),
        reg.status || 'active',
        reg.paymentStatus || 'pending'
      ];
    });

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-registrations-${Date.now()}.csv`;
    a.click();
    toast.success('CSV file downloaded!');
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
    if (!offering) return { courseName: 'Unknown', courseTypeName: 'Unknown', offering: null };
    
    return {
      courseName: getCourseName(offering.courseId),
      courseTypeName: getCourseTypeName(offering.courseTypeId),
      offering: offering
    };
  };

  // Advanced filtering
  const filteredRegistrations = registrations.filter((reg) => {
    const details = getOfferingDetails(reg.courseOfferingId);
    const fullName = `${reg.firstName} ${reg.lastName}`.toLowerCase();
    
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.phone && reg.phone.includes(searchTerm)) ||
      details.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.courseTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOffering = !filterOffering || reg.courseOfferingId === filterOffering;
    const matchesCourseType = !filterCourseType || 
      (details.offering && details.offering.courseTypeId === filterCourseType);
    
    return matchesSearch && matchesOffering && matchesCourseType;
  });

  // Sorting
  const filteredAndSortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return b.registeredAt - a.registeredAt;
      case 'date-asc':
        return a.registeredAt - b.registeredAt;
      case 'name-asc':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case 'name-desc':
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
      default:
        return 0;
    }
  });

  const offeringOptions = offerings.map((o) => {
    const details = getOfferingDetails(o.id);
    return {
      value: o.id,
      label: `${details.courseTypeName} - ${details.courseName}`,
    };
  });

  const courseTypeOptions = courseTypes.map((ct) => ({
    value: ct.id,
    label: ct.name,
  }));

  // Statistics
  const totalStudents = registrations.length;
  const uniqueOfferings = new Set(registrations.map(r => r.courseOfferingId)).size;
  const activeStudents = registrations.filter(r => r.status === 'active').length;
  const paidStudents = registrations.filter(r => r.paymentStatus === 'paid').length;
  const pendingPayments = registrations.filter(r => r.paymentStatus === 'pending').length;

  // Course-wise breakdown
  const courseBreakdown = {};
  registrations.forEach(reg => {
    const details = getOfferingDetails(reg.courseOfferingId);
    const key = `${details.courseTypeName} - ${details.courseName}`;
    courseBreakdown[key] = (courseBreakdown[key] || 0) + 1;
  });

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Registrations</h2>
          <p className="text-gray-600 text-sm mt-1">
            Comprehensive student management and enrollment tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleExportToCSV}
            variant="secondary"
            className="flex items-center space-x-2"
            disabled={registrations.length === 0}
          >
            <Download size={20} />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
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
      </div>

      {offerings.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            ⚠️ You need to create at least one course offering before registering students.
          </p>
        </div>
      ) : null}

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
              <p className="text-sm opacity-90">Active Students</p>
              <p className="text-3xl font-bold mt-1">{activeStudents}</p>
            </div>
            <Award size={40} className="opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Offerings</p>
              <p className="text-3xl font-bold mt-1">{uniqueOfferings}</p>
            </div>
            <BookOpen size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Paid</p>
              <p className="text-3xl font-bold mt-1">{paidStudents}</p>
            </div>
            <Award size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Payments</p>
              <p className="text-3xl font-bold mt-1">{pendingPayments}</p>
            </div>
            <Calendar size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Course-wise Breakdown */}
      {Object.keys(courseBreakdown).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="mr-2" size={20} />
            Enrollment by Course Offering
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(courseBreakdown).map(([course, count]) => (
              <div key={course} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">{course}</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">{count} students</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              value={filterCourseType}
              onChange={(e) => {
                setFilterCourseType(e.target.value);
                setFilterOffering('');
              }}
              className="input-field pl-10"
            >
              <option value="">All Course Types</option>
              {courseTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <BookOpen className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={filterOffering}
              onChange={(e) => setFilterOffering(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">All Course Offerings</option>
              {offeringOptions
                .filter(opt => !filterCourseType || 
                  offerings.find(o => o.id === opt.value)?.courseTypeId === filterCourseType)
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {(searchTerm || filterOffering || filterCourseType) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedRegistrations.length} of {totalStudents} students
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterOffering('');
                setFilterCourseType('');
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Student Cards Grid */}
      {filteredAndSortedRegistrations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {searchTerm || filterOffering || filterCourseType
              ? 'No students found matching your filters.' 
              : 'No student registrations yet.'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {!searchTerm && !filterOffering && !filterCourseType && 'Register students to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedRegistrations.map((registration) => {
            const details = getOfferingDetails(registration.courseOfferingId);
            return (
              <StudentCard
                key={registration.id}
                registration={registration}
                courseName={details.courseName}
                courseTypeName={details.courseTypeName}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
              />
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
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

      {/* Student Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-3">Personal Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{selectedStudent.email}</span>
                </div>
                {selectedStudent.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedStudent.phone}</span>
                  </div>
                )}
                {selectedStudent.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="font-medium">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedStudent.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{selectedStudent.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-3">Course Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Offering:</span>
                  <span className="font-medium">
                    {getOfferingDetails(selectedStudent.courseOfferingId).courseTypeName} - {getOfferingDetails(selectedStudent.courseOfferingId).courseName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Date:</span>
                  <span className="font-medium">{new Date(selectedStudent.registeredAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium px-2 py-1 rounded ${
                    selectedStudent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedStudent.status || 'active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-medium px-2 py-1 rounded ${
                    selectedStudent.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedStudent.paymentStatus === 'partial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedStudent.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>
            </div>

            {selectedStudent.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Notes</h4>
                <p className="text-sm text-gray-700">{selectedStudent.notes}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={() => setIsDetailsModalOpen(false)}
                variant="secondary"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentRegistrationList;
