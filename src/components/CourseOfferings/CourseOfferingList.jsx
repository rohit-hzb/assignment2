import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import CourseOfferingCard from './CourseOfferingCard';
import CourseOfferingForm from './CourseOfferingForm';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Select from '../Common/Select';
import { generateId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CourseOfferingList = ({ 
  offerings, 
  setOfferings, 
  courses, 
  courseTypes,
  registrations 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourseType, setFilterCourseType] = useState('');

  const handleCreate = (data) => {
    // Check for duplicate
    const duplicate = offerings.find(
      o => o.courseId === data.courseId && o.courseTypeId === data.courseTypeId
    );
    
    if (duplicate) {
      toast.error('This course offering already exists!');
      return;
    }

    const newOffering = {
      id: generateId(),
      courseId: data.courseId,
      courseTypeId: data.courseTypeId,
      createdAt: Date.now(),
    };
    setOfferings([...offerings, newOffering]);
    setIsModalOpen(false);
    toast.success('Course offering created successfully!');
  };

  const handleUpdate = (data) => {
    const updatedOfferings = offerings.map((o) =>
      o.id === editingOffering.id
        ? { ...o, courseId: data.courseId, courseTypeId: data.courseTypeId, updatedAt: Date.now() }
        : o
    );
    setOfferings(updatedOfferings);
    setEditingOffering(null);
    setIsModalOpen(false);
    toast.success('Course offering updated successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course offering?')) {
      setOfferings(offerings.filter((o) => o.id !== id));
      toast.success('Course offering deleted successfully!');
    }
  };

  const handleEdit = (offering) => {
    setEditingOffering(offering);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingOffering(null);
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : 'Unknown';
  };

  const getCourseTypeName = (courseTypeId) => {
    const courseType = courseTypes.find((ct) => ct.id === courseTypeId);
    return courseType ? courseType.name : 'Unknown';
  };

  const getStudentCount = (offeringId) => {
    return registrations.filter((r) => r.courseOfferingId === offeringId).length;
  };

  const filteredOfferings = offerings.filter((offering) => {
    const courseName = getCourseName(offering.courseId);
    const courseTypeName = getCourseTypeName(offering.courseTypeId);
    const matchesSearch = 
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterCourseType || offering.courseTypeId === filterCourseType;
    
    return matchesSearch && matchesFilter;
  });

  const courseTypeOptions = courseTypes.map((ct) => ({
    value: ct.id,
    label: ct.name,
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Offerings</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage course and course type combinations
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="flex items-center space-x-2"
          disabled={courses.length === 0 || courseTypes.length === 0}
        >
          <Plus size={20} />
          <span>Add Course Offering</span>
        </Button>
      </div>

      {courses.length === 0 || courseTypes.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            ⚠️ You need to create at least one course and one course type before creating course offerings.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search course offerings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          <select
            value={filterCourseType}
            onChange={(e) => setFilterCourseType(e.target.value)}
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
      </div>

      {filteredOfferings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchTerm || filterCourseType 
              ? 'No course offerings found matching your filters.' 
              : 'No course offerings yet. Create one to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOfferings.map((offering) => (
            <CourseOfferingCard
              key={offering.id}
              offering={offering}
              courseName={getCourseName(offering.courseId)}
              courseTypeName={getCourseTypeName(offering.courseTypeId)}
              studentCount={getStudentCount(offering.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingOffering ? 'Edit Course Offering' : 'Create Course Offering'}
      >
        <CourseOfferingForm
          offering={editingOffering}
          courses={courses}
          courseTypes={courseTypes}
          onSubmit={editingOffering ? handleUpdate : handleCreate}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default CourseOfferingList;
