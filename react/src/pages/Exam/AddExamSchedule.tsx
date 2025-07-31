import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";



type Option = {
  id: string | number;
  name: string;
};

type ExamForm = {
  classId: string;
  examId: string;
  sectionId: string;
  subjectId: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  room: string;
};

const initialForm: ExamForm = {
  classId: "",
  examId: "",
  sectionId: "",
  subjectId: "",
  date: "",
  timeFrom: "",
  timeTo: "",
  room: "",
};

type Props = {
  isEditMode?: boolean;
};

const AddExamSchedule: React.FC<Props> = ({ isEditMode = false }) => {

  const { id } = useParams();

    const navigate = useNavigate();

    const [form, setForm] = useState<ExamForm>(initialForm);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [classOptions, setClassOptions] = useState<Option[]>([]);
    const [examOptions, setExamOptions] = useState<Option[]>([]);
    const [sectionOptions, setSectionOptions] = useState<Option[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);

    useEffect(() => {
      if (isEditMode && id) {
        fetch(`http://localhost:5000/api/editexamschedule/${id}`)
          .then((res) => res.json())
          .then((data) => {
            setForm({
              classId: data.classId,
              examId: data.examId,
              sectionId: data.sectionId,
              subjectId: data.subjectId,
              date: data.date,
              timeFrom: data.timeFrom,
              timeTo: data.timeTo,
              room: data.room || "",
            });
          })
          .catch(err => {
            console.error("Failed to fetch exam schedule:", err);
            alert("Failed to load exam schedule.");
          });
      }
    }, [id, isEditMode]);


    useEffect(() => {
        fetch("http://localhost:5000/api/classlist")
        .then((res) => res.json())
        .then((data) => setClassOptions(data));

        fetch("http://localhost:5000/api/examlist")
        .then((res) => res.json())
        .then((data) => setExamOptions(data));

        fetch("http://localhost:5000/api/sectionlist")
        .then((res) => res.json())
        .then((data) => setSectionOptions(data));

        fetch("http://localhost:5000/api/subjectlist")
        .then((res) => res.json())
        .then((data) => setSubjectOptions(data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.classId) newErrors.classId = "Class is required";
        if (!form.examId) newErrors.examId = "Exam is required";
        if (!form.sectionId) newErrors.sectionId = "Section is required";
        if (!form.subjectId) newErrors.subjectId = "Subject is required";
        if (!form.date) newErrors.date = "Date is required";
        if (!form.timeFrom) newErrors.timeFrom = "Start time is required";
        if (!form.timeTo) newErrors.timeTo = "End time is required";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        const url = isEditMode
          ? `http://localhost:5000/api/updateexamschedule/${id}`
          : "http://localhost:5000/api/saveexamschedule";

        const method = isEditMode ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const result = await response.json();

        if (response.ok) {
          alert(`Exam schedule ${isEditMode ? "updated" : "added"} successfully!`);
          navigate("/examschedule", {
            state: { success: isEditMode ? "updated" : "added" },
          });
        } else {
          alert(result.message || "Something went wrong");
        }
      } catch (err) {
        console.error("Submit error:", err);
        alert("Submission failed");
      }
    };



  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Exam Schedule" : "Add Exam Schedule"}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
            name="classId"
            label="Class"
            value={form.classId}
            onChange={handleChange}
            options={classOptions}
            optionLabelKey="className"
            errors={errors}
        />

        <Select
          name="examId"
          label="Exam Name"
          options={examOptions}
          value={form.examId}
          onChange={handleChange}
          optionLabelKey="examName"
          errors={errors}
        />

        <Select
          name="sectionId"
          label="Section"
          options={sectionOptions}
          value={form.sectionId}
          onChange={handleChange}
          optionLabelKey="sectionName"
          errors={errors}
        />

        <Select
          name="subjectId"
          label="Subject"
          options={subjectOptions}
          value={form.subjectId}
          onChange={handleChange}
          optionLabelKey="subjectName"
          errors={errors}
        />

        <Input
          type="date"
          name="date"
          label="Date"
          value={form.date}
          onChange={handleChange}
          errors={errors}
        />

        <Input
          type="time"
          name="timeFrom"
          label="Time From"
          value={form.timeFrom}
          onChange={handleChange}
          errors={errors}
        />

        <Input
          type="time"
          name="timeTo"
          label="Time To"
          value={form.timeTo}
          onChange={handleChange}
          errors={errors}
        />

        <Input
          type="text"
          name="room"
          label="Room (Optional)"
          value={form.room}
          onChange={handleChange}
          errors={errors}
        />

        <div className="col-span-full mt-4 text-right">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {isEditMode ? "Update Exam Schedule" : "Add Exam Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExamSchedule;


type SelectProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { [key: string]: any }[];
  optionLabelKey: string; 
  errors?: { [key: string]: string };
};

const Select: React.FC<SelectProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  optionLabelKey,
  errors,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm ${
          errors?.[name] ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option[optionLabelKey]}
          </option>
        ))}
      </select>
      {errors?.[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );
};



type InputProps = {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: { [key: string]: string };
};

const Input: React.FC<InputProps> = ({ name, label, type = "text", value, onChange, errors }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {type !== "text" && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm ${
        errors?.[name] ? "border-red-500" : "border-gray-300"
      }`}
    />
    {errors?.[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
  </div>
);
