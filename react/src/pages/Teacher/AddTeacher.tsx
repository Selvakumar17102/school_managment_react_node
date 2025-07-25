import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTeacher() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        designation: "",
        dob: "",
        gender: "",
        religion: "",
        email: "",
        phone: "",
        address: "",
        joiningDate: "",
        photo: null,
        username: "",
        password: ""
    });


    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.designation.trim()) newErrors.designation = "Designation is required";
        if (!form.dob) newErrors.dob = "Date of Birth is required";
        if (!form.gender.trim()) newErrors.gender = "Gender is required";
        if (!form.religion.trim()) newErrors.religion = "Religion is required";
        
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";

        if (!form.phone.trim()) newErrors.phone = "Phone is required";
        if (!form.address.trim()) newErrors.address = "Address is required";
        if (!form.joiningDate) newErrors.joiningDate = "Joining Date is required";
        if (!form.photo) newErrors.photo = "Photo is required";

        if (!form.username.trim()) newErrors.username = "Username is required";
        if (!form.password.trim()) newErrors.password = "Password is required";

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

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, (form as any)[key]);
        }
        try {
            const res = await fetch("http://localhost:5000/api/teacher", {
            method: "POST",
            body: formData,
            });

            if (res.ok) {
                alert("Teacher added successfully!");
            navigate("/teacher", { state: { success: "Teacher added successfully!" } });
            } else {
                alert("Failed to save Teacher.");
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Add Teacher</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" label="Name" onChange={handleChange} value={form.name} errors={errors} />
                <Input name="designation" label="Designation" onChange={handleChange} value={form.designation} errors={errors} />
                <Input name="dob" label="Date of Birth" type="date" onChange={handleChange} value={form.dob} errors={errors} />

                <div>
                    <label className="block mb-1 text-sm font-medium">Gender</label>
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="" disabled>Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>

                <Input name="religion" label="Religion" onChange={handleChange} value={form.religion} errors={errors} />
                <Input name="email" label="Email" type="email" onChange={handleChange} value={form.email} errors={errors} />
                <Input name="phone" label="Phone" onChange={handleChange} value={form.phone} errors={errors} />
                <Input name="address" label="Address" onChange={handleChange} value={form.address} errors={errors} />
                <Input name="joiningDate" label="Joining Date" type="date" onChange={handleChange} value={form.joiningDate} errors={errors} />

                <Input name="photo" label="Photo" type="file" onChange={handleChange} errors={errors} />
                <Input name="username" label="Username" onChange={handleChange} value={form.username} errors={errors} />
                <Input name="password" label="Password" type="password" onChange={handleChange} value={form.password} errors={errors} />

                <div className="pt-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Add Teacher
                    </button>
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
  errors?: { [key: string]: string }; // Add this
};
const Input = ({ label, name, type = "text", value, onChange, errors = {} }: InputProps) => (
  <div className="mb-4"> {/* Add margin bottom to separate form groups */}
    <label className="block mb-1 text-sm font-medium" htmlFor={name}>{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={type === "file" ? undefined : value ?? ""}
      onChange={onChange}
      className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
        ${errors[name] ? "border-red-500" : "border-gray-300"}`}
      {...(type === "date" && {
        placeholder: "YYYY-MM-DD",
        inputMode: "numeric",
        pattern: "\\d{4}-\\d{2}-\\d{2}",
      })}
    />
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1" role="alert" aria-live="assertive">
        {errors[name]}
      </p>
    )}
  </div>
);


