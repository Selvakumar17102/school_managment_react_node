import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../config";
export default function AddMarkDistribution() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        markDistributionType: "",
        markValue: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // 🟡 Load class data in edit mode using the ID
    useEffect(() => {
        if (isEditMode) {
            fetch(`${BASE_URL}/markdistribution/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        markDistributionType: data.markDistributionType,
                        markValue: data.markValue,
                    });
                })
                .catch(err => console.error("Failed to fetch mark distribution", err));
        }
    }, [isEditMode, id]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.markDistributionType.trim()) newErrors.markDistributionType = "mark Distribution Type is required";
        if (!form.markValue.trim()) newErrors.markValue = "mark Value is required";
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
                ? `${BASE_URL}/markdistribution/${id}`
                : `${BASE_URL}/savemarkdistribution`;
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert(isEditMode ? "mark distribution updated successfully!" : "mark distribution added successfully!");
                navigate("/markdistribution", {
                    state: { success: isEditMode ? "mark distribution updated" : "mark distribution added" },
                });
            } else {
                alert("Failed to save mark distribution.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit mark distribution" : "Add mark distribution"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="markDistributionType" label="mark Distribution Type" onChange={handleChange} value={form.markDistributionType} errors={errors} />
                <Input type="number" name="markValue" label="mark Value" onChange={handleChange} value={form.markValue} errors={errors} />
                <div className="pt-2 col-span-full">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {isEditMode ? "Update mark Distribution" : "Add mark Distribution"}
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
