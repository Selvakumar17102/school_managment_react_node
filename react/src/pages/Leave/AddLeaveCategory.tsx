import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../config";
export default function AddLeaveCategory() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        category: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isEditMode) {
            fetch(`${BASE_URL}/leavecategory/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        category: data.category,
                    });
                })
                .catch(err => console.error("Failed to fetch Leave Category", err));
        }
    }, [isEditMode, id]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.category.trim()) newErrors.category = "category is required";
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
                ? `${BASE_URL}/leavecategory/${id}`
                : `${BASE_URL}/saveleavecategory`;
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert(isEditMode ? "Leave Category updated successfully!" : "Leave Category added successfully!");
                navigate("/leave-category", {
                    state: { success: isEditMode ? "Leave Category updated" : "Leave Category added" },
                });
            } else {
                alert("Failed to save Leave Category.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Leave Category" : "Add Leave Category"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="category" label="Category" onChange={handleChange} value={form.category} errors={errors} />
                <div className="pt-2 col-span-full">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {isEditMode ? "Update Leave Category" : "Add Leave Category"}
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