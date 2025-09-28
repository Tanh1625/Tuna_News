import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";

export default function CustomDropdown({
  name,
  control,
  errors,
  label,
  options,
  isMulti = false,
  required = false,
  placeholder = "Chọn...",
  _className = "",
}) {
  const errorForField = errors?.[name];

  return (
    <div className={`custom__dropdown ${_className}`}>
      {label && (
        <label className="custom__dropdown--label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Select
            {...field}
            className={`dropdown__input ${
              errorForField ? "dropdown__input--error" : ""
            }`}
            isInvalid={!!errorForField}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        )}
      />
      {errorForField && (
        <div className="text-danger mt-1">{errorForField.message}</div>
      )}
    </div>
  );
}
