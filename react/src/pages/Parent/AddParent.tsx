import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
export default function AddParent() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        guardianName: "",
        fatherName: "",
        motherName: "",
        fatherProfession: "",
        motherProfession: "",
        email: "",
        phone: "",
        address: "",
        photo: null,
        username: "",
        password: ""
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
            const res = await fetch(`${BASE_URL}/parents`, {
            method: "POST",
            body: formData,
            });

            if (res.ok) {
            // alert("Student added successfully!");
            navigate("/parent", { state: { success: "Parent added successfully!" } });
            } else {
            alert("Failed to save Parent.");
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Add Parent</h2>
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
                <Input name="username" label="Username" onChange={handleChange} value={form.username} errors={errors} />
                <Input name="password" label="Password" type="password" onChange={handleChange} value={form.password} errors={errors} />
                <div className="col-span-full">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Save Parent
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


