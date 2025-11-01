import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import CourseCard from './CourseCard';
import CourseForm from './CourseForm';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { generateId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CourseList = ({ courses, setCourses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = (data) => {
    const newCourse = {
      id: generateId(),
      name: data.name,
      createdAt: Date.now(),
    };
    setCourses([...courses, newCourse]);
    setIsModalOpen(false);
    toast.success('Course created successfully!');
  };

  const handleUpdate = (data) => {
    const updatedCourses = courses.map((c) =>
      c.id === editingCourse.id
        ? { ...c, name: data.name, updatedAt: Date.now() }
        : c
    );
    setCourses(updatedCourses);
    setEditingCourse(null);
    setIsModalOpen(false);
    toast.success('Course updated successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter((c) => c.id !== id));
      toast.success('Course deleted successfully!');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage available courses (Hindi, English, Urdu, etc.)
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Course</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchTerm ? 'No courses found matching your search.' : 'No courses yet. Create one to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingCourse ? 'Edit Course' : 'Create Course'}
      >
        <CourseForm
          course={editingCourse}
          onSubmit={editingCourse ? handleUpdate : handleCreate}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default CourseList;
