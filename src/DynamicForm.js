import React, { useEffect, useState } from "react";

function DynamicForm({
  schema,
  onSubmit,
  currentStep,
  setCurrentStep,
  errors,
  setErrors,
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateStep = () => {
    const stepErrors = {};
    schema.steps[currentStep].fields.forEach((field) => {
      const value = formData[field.name];
      if (field.required) {
        if (
          (field.type === "text" ||
            field.type === "email" ||
            field.type === "number" ||
            field.type === "date") &&
          !value
        ) {
          stepErrors[field.name] = `${field.label} is required`;
        }
        if (field.type === "checkbox" && !value) {
          stepErrors[field.name] = `${field.label} is required`;
        }
        if (field.type === "dropdown" && (!value || value === "")) {
          stepErrors[field.name] = `Please select a ${field.label}`;
        }
        if (field.type === "radio" && !value) {
          stepErrors[field.name] = `Please select a ${field.label}`;
        }
      }
    });
    return stepErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      setErrors(stepErrors);
    }
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length === 0) {
      onSubmit(formData);
      localStorage.removeItem("formData");
      setFormData({});
    } else {
      setErrors(stepErrors);
    }
  };

  const renderField = (field) => {
    const { name, label, type, options } = field;

    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={name} className="defalts__inputs">
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={(e) => handleInputChange(e, field)}
            />
            {errors[name] && <p style={{ color: "red" }}>{errors[name]}</p>}
          </div>
        );
      case "date":
        return (
          <div key={name} className="defalts__inputs">
            <label>{label}</label>
            <input
              type="date"
              name={name}
              value={formData[name] || ""}
              onChange={(e) => handleInputChange(e, field)}
            />
            {errors[name] && <p style={{ color: "red" }}>{errors[name]}</p>}
          </div>
        );
      case "dropdown":
        return (
          <div key={name} className="defalts__inputs">
            <label>{label}</label>
            <select
              name={name}
              value={formData[name] || ""}
              onChange={(e) => handleInputChange(e, field)}
            >
              <option value="" disabled>
                Select {label}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[name] && <p style={{ color: "red" }}>{errors[name]}</p>}
          </div>
        );
      case "radio":
        return (
          <div key={name} className="radio__input">
            <label>{label}</label>
            {options.map((option) => (
              <div key={option.value}>
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={(e) => handleInputChange(e, field)}
                />
                {option.label}
              </div>
            ))}
            {errors[name] && <p style={{ color: "red" }}>{errors[name]}</p>}
          </div>
        );
      case "checkbox":
        return (
          <div key={name} className="defalts__inputs">
            <label>
              <input
                type="checkbox"
                name={name}
                checked={!!formData[name]}
                onChange={(e) => handleInputChange(e, field)}
              />
              {label}
            </label>
            {errors[name] && <p style={{ color: "red" }}>{errors[name]}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h2>{schema.steps[currentStep].title}</h2>
        {schema.steps[currentStep].fields.map(renderField)}
        <div className="form__buttons">
          {currentStep > 0 && (
            <button type="button" onClick={handleBack}>
              Back
            </button>
          )}
          {currentStep < schema.steps.length - 1 && (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          )}
          {currentStep === schema.steps.length - 1 && (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default DynamicForm;
