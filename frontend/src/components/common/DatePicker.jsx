import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Custom styles for the date picker to match our theme
const customStyles = `
  .react-datepicker {
    background-color: #1e293b !important;
    border: 1px solid #334155 !important;
    border-radius: 0.5rem !important;
    color: #f1f5f9 !important;
  }
  
  .react-datepicker__header {
    background-color: #1e293b !important;
    border-bottom: 1px solid #334155 !important;
  }
  
  .react-datepicker__day-names,
  .react-datepicker__week {
    color: #f1f5f9 !important;
  }
  
  .react-datepicker__day {
    color: #f1f5f9 !important;
    border-radius: 0.25rem !important;
  }
  
  .react-datepicker__day:hover {
    background-color: #334155 !important;
  }
  
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #8b5cf6 !important;
    border-radius: 0.25rem !important;
  }
  
  .react-datepicker__day--today {
    background-color: #3b82f6 !important;
    color: white !important;
  }
  
  .react-datepicker__navigation {
    color: #f1f5f9 !important;
  }
`;

// Create a style element and add it to the head
if (!document.querySelector('#datepicker-theme')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'datepicker-theme';
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

export const DatePicker = ({ selected, onChange, ...props }) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      className="bg-dark-secondary border-dark-card text-text-primary"
      {...props}
    />
  );
};

export default DatePicker;