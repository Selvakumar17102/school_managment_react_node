import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function EditParent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
        guardianName: "",
        fatherName: "",
        motherName: "",
        fatherProfession: "",
        motherProfession: "",
        email: "",
        phone: "",
        address: "",
        photo: null as File | null,
    });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.guardianName.trim()) newErrors.guardianName = "Guardian Name is required";
        if (!form.fatherName.trim()) newErrors.fatherName = "Father's Name is required";
        if (!form.motherName.trim()) newErrors.motherName = "Mother's Name is required";
        if (!form.fatherProfession.trim()) newErrors.fatherProfession = "Father's Profession is required";
        if (!form.motherProfession.trim()) newErrors.motherProfession = "Mother's Profession is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
        if (!form.phone.trim()) newErrors.phone = "Phone is required";
        if (!form.address.trim()) newErrors.address = "Address is required";

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (files) {
            setForm(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
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

      await axios.put(`http://localhost:5000/api/updateparents/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // alert("Parent updated successfully!");
      navigate("/parent", { state: { success: "Parent updated successfully!" } });
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/parents/${id}`)
      .then(res => setForm(prev => ({
        ...prev,
        ...res.data,
        className: res.data.class,
      })))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Edit Parent</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="guardianName" label="Guardian Name" onChange={handleChange} value={form.guardianName} errors={errors} />
        <Input name="fatherName" label="Father's Name" onChange={handleChange} value={form.fatherName} errors={errors} />
        <Input name="motherName" label="Mother's Name" onChange={handleChange} value={form.motherName} errors={errors} />
        <Input name="fatherProfession" label="Father's Profession" onChange={handleChange} value={form.fatherProfession} errors={errors} />
        <Input name="motherProfession" label="Mother's Profession" onChange={handleChange} value={form.motherProfession} errors={errors} />
        <Input name="email" label="Email" type="email" onChange={handleChange} value={form.email} errors={errors} />
        <Input name="phone" label="Phone" onChange={handleChange} value={form.phone} errors={errors} />
        <Input name="address" label="Address" onChange={handleChange} value={form.address} errors={errors} />
        <Input name="photo" label="Photo" type="file" onChange={handleChange} errors={errors} />
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

