import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import CourseTypeCard from './CourseTypeCard';
import CourseTypeForm from './CourseTypeForm';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { generateId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CourseTypeList = ({ courseTypes, setCourseTypes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseType, setEditingCourseType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = (data) => {
    const newCourseType = {
      id: generateId(),
      name: data.name,
      createdAt: Date.now(),
    };
    setCourseTypes([...courseTypes, newCourseType]);
    setIsModalOpen(false);
    toast.success('Course type created successfully!');
  };

  const handleUpdate = (data) => {
    const updatedCourseTypes = courseTypes.map((ct) =>
      ct.id === editingCourseType.id
        ? { ...ct, name: data.name, updatedAt: Date.now() }
        : ct
    );
    setCourseTypes(updatedCourseTypes);
    setEditingCourseType(null);
    setIsModalOpen(false);
    toast.success('Course type updated successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course type?')) {
      setCourseTypes(courseTypes.filter((ct) => ct.id !== id));
      toast.success('Course type deleted successfully!');
    }
  };

  const handleEdit = (courseType) => {
    setEditingCourseType(courseType);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCourseType(null);
  };

  const filteredCourseTypes = courseTypes.filter((ct) =>
    ct.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Types</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage different types of courses (Individual, Group, etc.)
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Course Type</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search course types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filteredCourseTypes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchTerm ? 'No course types found matching your search.' : 'No course types yet. Create one to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourseTypes.map((courseType) => (
            <CourseTypeCard
              key={courseType.id}
              courseType={courseType}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingCourseType ? 'Edit Course Type' : 'Create Course Type'}
      >
        <CourseTypeForm
          courseType={editingCourseType}
          onSubmit={editingCourseType ? handleUpdate : handleCreate}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default CourseTypeList;
