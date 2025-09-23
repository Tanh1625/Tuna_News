import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Eye, EyeSlash } from 'react-bootstrap-icons'
import { Controller } from 'react-hook-form'

// type Props = {
//   name: string
//   control: any
//   errors: any
//   type: 'text' | 'email' | 'password'
//   placeholder?: string
//   label?: string
//   required?: boolean
//   className?: string
//   icon?: React.ReactNode
//   rules?: any // Thêm prop này
// }

export default function CustomTextField({
  name,
  control,
  errors,
  type = 'text',
  placeholder = 'Nhập ...',
  label,
  required = false,
  className = '',
  icon,
  rules, // Thêm rules
}) {
  const errorForField = errors?.[name]
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <Form.Group className={`text__field ${className}`}>
      <Form.Label className='text__field--label'>
        {label && (
          <label className='fw-semibold'>
            {label} {required && <span className='text-danger'>*</span>}
          </label>
        )}
      </Form.Label>
      <Controller
        name={name}
        control={control}
        rules={rules} // Sử dụng rules prop
        render={({ field }) => (
          <div className='input__wrapper'>
            {icon && <span className='input-icon-start'>{icon}</span>}

            <Form.Control
              {...field}
              type={isPassword ? (showPassword ? 'text' : 'password') : type}
              placeholder={placeholder}
              isInvalid={!!errorForField}
              className={`${icon ? 'have-icon' : ''} pe-${isPassword ? '5' : '3'}`}
            />

            {isPassword && (
              <span
                className='input-icon-end'
                role='button'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </span>
            )}
          </div>
        )}
      />
      {errorForField && <div className='text-danger fw-semibold mt-1 error-field'>{errorForField.message}</div>}
    </Form.Group>
  )
}
