import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import BASE_URL from "../../config";

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    guardian: "",
    admissionDate: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "",
    className: "",
    section: "",
    optionalSubject: "",
    registerNo: "",
    roll: "",
    photo: null as File | null,
    activities: "",
    remarks: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.admissionDate.trim()) newErrors.admissionDate = "Admission Date is required";
    if (!form.dob.trim()) newErrors.dob = "Date of Birth is required";
    if (!form.className) newErrors.className = "Class is required";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;
    if ("files" in target && target.files) {
      setForm((prev) => ({
        ...prev,
        [name]: target.files![0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value as any);
      });

      await axios.put(`${BASE_URL}/updatestudents/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // alert("Student updated successfully!");
      navigate("/student", { state: { success: "Student updated successfully!" } });
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/students/${id}`)
      .then(res => setForm(prev => ({
        ...prev,
        ...res.data,
        className: res.data.class,
      })))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="name" label="Name" onChange={handleChange} value={form.name} errors={errors} />
        <Select name="guardian" label="Guardian" value={form.guardian} onChange={handleChange} options={["Father", "Mother", "Guardian"]} errors={errors} />
        <Input name="admissionDate" label="Admission Date" type="date" onChange={handleChange} value={form.admissionDate} errors={errors} />
        <Input name="dob" label="Date of Birth" type="date" onChange={handleChange} value={form.dob} errors={errors} />
        <Select name="gender" label="Gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Other"]} errors={errors} />
        <Select name="bloodGroup" label="Blood Group" value={form.bloodGroup} onChange={handleChange} options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} errors={errors} />
        <Input name="religion" label="Religion" onChange={handleChange} value={form.religion} errors={errors} />
        <Input name="email" label="Email" type="email" onChange={handleChange} value={form.email} errors={errors} />
        <Input name="phone" label="Phone" onChange={handleChange} value={form.phone} errors={errors} />
        <Input name="address" label="Address" onChange={handleChange} value={form.address} errors={errors} />
        <Input name="state" label="State" onChange={handleChange} value={form.state} errors={errors} />
        <Select name="country" label="Country" value={form.country} onChange={handleChange} options={["India", "USA", "UK", "Canada"]} errors={errors} />
        <Select name="className" label="Class" value={form.className} onChange={handleChange} options={["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]} errors={errors} />
        <Select name="section" label="Section" value={form.section} onChange={handleChange} options={["A", "B", "C"]} errors={errors} />
        <Select name="optionalSubject" label="Optional Subject" value={form.optionalSubject} onChange={handleChange} options={["Maths", "Computer", "French"]} errors={errors} />
        <Input name="registerNo" label="Register No" onChange={handleChange} value={form.registerNo} errors={errors} />
        <Input name="roll" label="Roll" onChange={handleChange} value={form.roll} errors={errors} />
        <Input name="photo" label="Photo" type="file" onChange={handleChange} errors={errors} />
        <Input name="activities" label="Extra Curricular Activities" onChange={handleChange} value={form.activities} errors={errors} />
        <Input name="remarks" label="Remarks" onChange={handleChange} value={form.remarks} errors={errors} />
        <Input name="username" label="Username" onChange={handleChange} value={form.username} errors={errors} />
        <Input name="password" label="Password" type="password" onChange={handleChange} value={form.password} errors={errors} />
        <div className="col-span-full">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update Student</button>
        </div>
      </form>
    </div>
  );
}

type InputProps = {
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: { [key: string]: string };
};

const Input = ({ label, name, type = "text", value, onChange, errors = {} }: InputProps) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium" htmlFor={name}>{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={type === "file" ? undefined : value ?? ""}
      onChange={onChange}
      className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? "border-red-500" : "border-gray-300"}`}
      {...(type === "date" && { placeholder: "YYYY-MM-DD", inputMode: "numeric", pattern: "\\d{4}-\\d{2}-\\d{2}" })}
    />
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1" role="alert">{errors[name]}</p>
    )}
  </div>
);


type SelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  errors?: { [key: string]: string };
};

const Select = ({ label, name, value, onChange, options, errors = {} }: SelectProps) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium" htmlFor={name}>{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? "border-red-500" : "border-gray-300"}`}
    >
      <option value="" disabled>Select</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1" role="alert">{errors[name]}</p>
    )}
  </div>
);
