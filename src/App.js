import React, { useState } from "react";
import "./App.css";
import DynamicForm from "./DynamicForm";

const formSchema = {
  steps: [
    {
      title: "Step 1: Personal Information",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        {
          name: "birthdate",
          label: "Birth Date",
          type: "date",
          required: true,
        },
        {
          name: "agree",
          label: "Agree to Terms",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      title: "Step 2: Preferences",
      fields: [
        {
          name: "theme",
          label: "Theme",
          type: "dropdown",
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ],
          required: true,
        },
        {
          name: "gender",
          label: "Gender",
          type: "radio",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
          required: true,
        },
      ],
    },
  ],
};

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (formData) => {
    console.log("Form Data Submitted:", formData);
    setIsSubmitted(true);
  };

  const handleClosePopup = () => {
    setIsSubmitted(false);
    setCurrentStep(0);
    setErrors({});
  };

  return (
    <div className="app">
      <h1>Dynamic Multi-Step Form</h1>
      <DynamicForm
        schema={formSchema}
        onSubmit={handleSubmit}
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        setErrors={setErrors}
        errors={errors}
      />

      {isSubmitted && (
        <div className="popup">
          <div className="popup-content form__buttons">
            <p>Form submitted successfully!</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
