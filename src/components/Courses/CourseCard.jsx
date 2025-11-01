import React from 'react';
import { Edit2, Trash2, BookOpen } from 'lucide-react';
import Button from '../Common/Button';

const CourseCard = ({ course, onEdit, onDelete }) => {
  return (
    <div className="card group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="bg-primary-100 p-2 rounded-lg">
            <BookOpen className="text-primary-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {course.name}
            </h3>
            <p className="text-sm text-gray-500">
              Created: {new Date(course.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            onClick={() => onEdit(course)}
            className="flex items-center space-x-1"
          >
            <Edit2 size={16} />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(course.id)}
            className="flex items-center space-x-1"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
