import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Button from '../Common/Button';

const CourseTypeCard = ({ courseType, onEdit, onDelete }) => {
  return (
    <div className="card group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {courseType.name}
          </h3>
          <p className="text-sm text-gray-500">
            Created: {new Date(courseType.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            onClick={() => onEdit(courseType)}
            className="flex items-center space-x-1"
          >
            <Edit2 size={16} />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(courseType.id)}
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

export default CourseTypeCard;
