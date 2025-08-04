import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Teacher = {
  id: number;
  name: string;
};

export default function AddClasses() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        className: "",
        classNumeric: "",
        classTeacher: "",
        notes: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [teachers, setTeachers] = useState<Teacher[]>([]);


    // 🟡 Load class data in edit mode using the ID
    useEffect(() => {
        if (isEditMode) {
            fetch(`http://localhost:5000/api/class/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        className: data.className,
                        classNumeric: data.classNumeric,
                        classTeacher: data.classTeacher,
                        notes: data.notes,
                    });
                })
                .catch(err => console.error("Failed to fetch class", err));
        }
    }, [isEditMode, id]);

    // Load teacher list
    useEffect(() => {
        fetch("http://localhost:5000/api/teacherlist")
            .then(res => res.json())
            .then(data => setTeachers(data))
            .catch(err => console.error("Failed to load teachers", err));
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.className.trim()) newErrors.className = "Class Name is required";
        if (!form.classNumeric.trim()) newErrors.classNumeric = "Class Number is required";
        if (!form.classTeacher) newErrors.classTeacher = "Class Teacher is required";
        if (!form.notes.trim()) newErrors.notes = "Notes are required";
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const url = isEditMode
                ? `http://localhost:5000/api/class/${id}`
                : "http://localhost:5000/api/saveclass";
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert(isEditMode ? "Class updated successfully!" : "Class added successfully!");
                navigate("/classes", {
                    state: { success: isEditMode ? "Class updated" : "Class added" },
                });
            } else {
                alert("Failed to save class.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Class" : "Add Class"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="className" label="Class Name" onChange={handleChange} value={form.className} errors={errors} />
                <Input name="classNumeric" label="Class Number" onChange={handleChange} value={form.classNumeric} errors={errors} />
                <div>
                    <label className="block mb-1 text-sm font-medium">Class Teacher</label>
                    <select
                        name="classTeacher"
                        value={form.classTeacher}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select a teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                    {errors.classTeacher && <p className="text-red-500 text-sm">{errors.classTeacher}</p>}
                </div>
                <Input name="notes" label="Notes" onChange={handleChange} value={form.notes} errors={errors} />
                <div className="pt-2 col-span-full">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {isEditMode ? "Update Class" : "Add Class"}
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
        <label className="block mb-1 text-sm font-medium" htmlFor={name}>
            {label}
        </label>
        <input
            id={name}
            type={type}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors[name] ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors[name] && (
            <p className="text-red-500 text-xs mt-1" role="alert">
                {errors[name]}
            </p>
        )}
    </div>
);
