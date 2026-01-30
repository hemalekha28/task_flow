import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ 
  label, 
  error, 
  helperText,
  required,
  className = '',
  labelClassName = '',
  inputClassName = '',
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={props.id || props.name}
          className={clsx(
            'block text-sm font-medium text-gray-400 mb-2',
            { 'after:content-["*"] after:text-red-500 after:ml-0.5': required },
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <div className="input-group">
        {Icon && (
          <div className="input-icon left-3">
            <Icon className="h-5 w-5 text-gray-500" />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'input',
            { 
              'input-error': error,
              'input-icon-left': Icon
            },
            inputClassName,
            className
          )}
          {...props}
        />
      </div>
      {helperText && (
        <p className="mt-1 text-sm text-gray-400">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

export default Input;