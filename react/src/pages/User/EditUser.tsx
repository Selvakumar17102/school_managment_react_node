import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import BASE_URL from "../../config";
export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        dob: "",
        gender: "",
        religion: "",
        email: "",
        phone: "",
        address: "",
        joiningDate: "",
        photo: null as File | null,
        role: "",
    });

    interface Role {
        id: number;
        role_name: string;
    }

    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
    const fetchRoles = async () => {
        try {
        const res = await axios.get<Role[]>(`${BASE_URL}/roles`);
        setRoles(res.data);
        } catch (err) {
        console.error("Failed to load roles", err);
        }
    };

    fetchRoles();
    }, []);


    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.role.trim()) newErrors.role = "Designation is required";
        if (!form.dob.trim()) newErrors.dob = "Date of Birth is required";
        if (!form.gender.trim()) newErrors.gender = "Gender is required";
        if (!form.religion.trim()) newErrors.religion = "Religion is required";

        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";

        if (!form.phone.trim()) newErrors.phone = "Phone is required";
        if (!form.address.trim()) newErrors.address = "Address is required";
        if (!form.joiningDate.trim()) newErrors.joiningDate = "Joining Date is required";

        if (!form.photo) newErrors.photo = "Photo is required";

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

      await axios.put(`${BASE_URL}/updateusers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // alert("user updated successfully!");
      navigate("/user", { state: { success: "User updated successfully!" } });
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/users/${id}`)
      .then(res => setForm(prev => ({
        ...prev,
        ...res.data,
        className: res.data.class,
      })))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="name" label="Name" onChange={handleChange} value={form.name} errors={errors} />
        <Input name="dob" label="Date of Birth" type="date" onChange={handleChange} value={form.dob} errors={errors} />

        <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        >
        <option value="" disabled>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

        <Input name="religion" label="Religion" onChange={handleChange} value={form.religion} errors={errors} />
        <Input name="email" label="Email" type="email" onChange={handleChange} value={form.email} errors={errors} />
        <Input name="phone" label="Phone" onChange={handleChange} value={form.phone} errors={errors} />
        <Input name="address" label="Address" onChange={handleChange} value={form.address} errors={errors} />
        <Input name="joiningDate" label="Joining Date" type="date" onChange={handleChange} value={form.joiningDate} errors={errors} />
        <Input name="photo" label="Photo" type="file" onChange={handleChange} errors={errors} />

        <div>
            <label className="block mb-1 text-sm font-medium">Role</label>
            <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
            >
                <option value="" disabled>Select Role</option>
                {roles.map(role => (
                <option key={role.role_name} value={role.role_name}>
                    {role.role_name}
                </option>
                ))}
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        <div className="col-span-full">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Save User
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

