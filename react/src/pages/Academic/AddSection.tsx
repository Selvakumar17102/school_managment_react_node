import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type ClassItem = {
  id: number;
  className: string;
};
type Teacher = {
  id: number;
  name: string;
};

export default function AddSection() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        sectionName: "",
        category: "",
        capacity: "",
        classId: "",
        classTeacher: "",
        notes: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [classes, setClass] = useState<ClassItem[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    // 🟡 Load class data in edit mode using the ID
    useEffect(() => {
        if (isEditMode) {
            fetch(`http://localhost:5000/api/section/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        sectionName: data.sectionName,
                        category: data.category,
                        capacity: data.capacity,
                        classId: data.classId,
                        classTeacher: data.classTeacher,
                        notes: data.notes,
                    });
                })
                .catch(err => console.error("Failed to fetch class", err));
        }
    }, [isEditMode, id]);

    // Load class list teacher list
    useEffect(() => {
        fetch("http://localhost:5000/api/classlist")
            .then(res => res.json())
            .then(data => setClass(data))
            .catch(err => console.error("Failed to load teachers", err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/teacherlist")
            .then(res => res.json())
            .then(data => setTeachers(data))
            .catch(err => console.error("Failed to load teachers", err));
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.sectionName.trim()) newErrors.section = "Section is required";
        if (!form.category.trim()) newErrors.category = "Category is required";
        if (!form.capacity) newErrors.capacity = "Capacity is required";
        if (!form.classId.trim()) newErrors.classId = "class Name are required";
        if (!form.classTeacher.trim()) newErrors.classTeacher = "class Teacher are required";
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
                ? `http://localhost:5000/api/section/${id}`
                : "http://localhost:5000/api/savesection";
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert(isEditMode ? "Section updated successfully!" : "Section added successfully!");
                navigate("/section", {
                    state: { success: isEditMode ? "Section updated" : "Section added" },
                });
            } else {
                alert("Failed to save Section.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Section" : "Add Section"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="sectionName" label="Section" onChange={handleChange} value={form.sectionName} errors={errors} />
                <Input name="category" label="Category" onChange={handleChange} value={form.category} errors={errors} />
                <Input name="capacity" type="number" label="Capacity" onChange={handleChange} value={form.capacity} errors={errors} />
                
                <div>
                    <label className="block mb-1 text-sm font-medium">Class</label>
                    <select
                        name="classId"
                        value={form.classId}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select a Class</option>
                        {classes.map((classs) => (
                            <option key={classs.id} value={classs.id}>
                                {classs.className}
                            </option>
                        ))}
                    </select>
                    {errors.classId && <p className="text-red-500 text-sm">{errors.classId}</p>}
                </div>
                
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
                        {isEditMode ? "Update Section" : "Add Section"}
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
