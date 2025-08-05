import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../config";
export default function AddGrade() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        gradeName: "",
        gradePoint: "",
        markFrom: "",
        markUpto: "",
        notes: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // 🟡 Load class data in edit mode using the ID
    useEffect(() => {
        if (isEditMode) {
            fetch(`${BASE_URL}/grade/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        gradeName: data.gradeName,
                        gradePoint: data.gradePoint,
                        markFrom: data.markFrom,
                        markUpto: data.markUpto,
                        notes: data.notes,
                    });
                })
                .catch(err => console.error("Failed to fetch grade", err));
        }
    }, [isEditMode, id]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.gradeName.trim()) newErrors.gradeName = "grade Name is required";
        if (!form.gradePoint.trim()) newErrors.gradePoint = "grade Point is required";
        if (!form.markFrom.trim()) newErrors.markFrom = "mark From are required";
        if (!form.markUpto.trim()) newErrors.markUpto = "mark Upto are required";
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
                ? `${BASE_URL}/grade/${id}`
                : `${BASE_URL}/savegrade`;
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert(isEditMode ? "grade updated successfully!" : "grade added successfully!");
                navigate("/grade", {
                    state: { success: isEditMode ? "grade updated" : "grade added" },
                });
            } else {
                alert("Failed to save grade.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit grade" : "Add grade"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="gradeName" label="Grade Name" onChange={handleChange} value={form.gradeName} errors={errors} />
                <Input name="gradePoint" label="Grade Point" onChange={handleChange} value={form.gradePoint} errors={errors} />
                <Input name="markFrom" label="mark From" onChange={handleChange} value={form.markFrom} errors={errors} />
                <Input name="markUpto" label="mark Upto" onChange={handleChange} value={form.markUpto} errors={errors} />
                <Input name="notes" label="Notes" onChange={handleChange} value={form.notes} errors={errors} />
                <div className="pt-2 col-span-full">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {isEditMode ? "Update Grade" : "Add Grade"}
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
            {label} { <span className="text-red-500">*</span>}
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
