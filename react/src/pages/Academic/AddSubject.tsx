import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddSubject() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        classId: "",
        teacherId: "",
        type: "",
        passmark: "",
        finalmark: "",
        subjectName: "",
        subjectAuthor: "",
        subjectCode: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [classes, setClass] = useState([]);
    const [teachers, setTeachers] = useState([]);

    // 🟡 Load class data in edit mode using the ID
    useEffect(() => {
        if (isEditMode) {
            fetch(`http://localhost:5000/api/subject/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        classId: data.classId,
                        teacherId: data.teacherId,
                        type: data.type,
                        passmark: data.passmark,
                        finalmark: data.finalmark,
                        subjectName: data.subjectName,
                        subjectAuthor: data.subjectAuthor,
                        subjectCode: data.subjectCode,
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
        if (!form.classId.trim()) newErrors.classId = "class Name are required";
        if (!form.teacherId.trim()) newErrors.teacherId = "class Teacher are required";
        if (!form.type.trim()) newErrors.type = "type are required";
        if (!form.passmark.trim()) newErrors.passmark = "pass mark is required";
        if (!form.finalmark.trim()) newErrors.finalmark = "Final mark is required";
        if (!form.subjectName.trim()) newErrors.subjectName = "subject Name is required";
        if (!form.subjectCode) newErrors.subjectCode = "subject Code is required";
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
                ? `http://localhost:5000/api/subject/${id}`
                : "http://localhost:5000/api/savesubject";
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert(isEditMode ? "Subject updated successfully!" : "Subject added successfully!");
                navigate("/subject", {
                    state: { success: isEditMode ? "subject updated" : "subject added" },
                });
            } else {
                alert("Failed to save subject.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Class" : "Add subject"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        name="teacherId"
                        value={form.teacherId}
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
                    {errors.teacherId && <p className="text-red-500 text-sm">{errors.teacherId}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select a type</option>
                        <option value="Optional">Optional</option>
                        <option value="Mandatory">Mandatory</option>
                        
                    </select>
                    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                </div>
                <Input type="number" name="passmark" label="Pass Mark" onChange={handleChange} value={form.passmark} errors={errors} />
                <Input type="number" name="finalmark" label="Final Mark " onChange={handleChange} value={form.finalmark} errors={errors} />
                <Input name="subjectName" label="Subject Name" onChange={handleChange} value={form.subjectName} errors={errors} />
                <Input name="subjectAuthor" label="Subject Author" onChange={handleChange} value={form.subjectAuthor} />
                <Input name="subjectCode" label="Subject Code" onChange={handleChange} value={form.subjectCode} errors={errors} />
                <div className="pt-2 col-span-full">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {isEditMode ? "Update Subject" : "Add Subject"}
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
