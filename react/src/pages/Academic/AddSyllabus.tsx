import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type ClassItem = {
  id: number;
  className: string;
};

export default function AddSyllabus() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        classId: "",
        title: "",
        description: "",
        files: [], // <-- store multiple files
    });


    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [classes, setClass] = useState<ClassItem[]>([]);

    // 🟡 Load class data in edit mode using the ID
    useEffect(() => {
        if (isEditMode) {
            fetch(`http://localhost:5000/api/syllabus/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        classId: data.classId,
                        title: data.title,
                        description: data.description,
                        files: data.files,
                    });
                })
                .catch(err => console.error("Failed to fetch syllabus", err));
        }
    }, [isEditMode, id]);

    useEffect(() => {
        fetch("http://localhost:5000/api/classlist")
            .then(res => res.json())
            .then(data => setClass(data))
            .catch(err => console.error("Failed to load classes", err));
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.classId.trim()) newErrors.classId = "class Name are required";
        if (!form.title.trim()) newErrors.title = "title are required";
        if (!form.description.trim()) newErrors.description = "description are required";
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files, type } = e.target as HTMLInputElement;
        if (type === "file") {
            setForm({ ...form, [name]: files });
        } else {
            setForm({ ...form, [name]: value });
        }
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
                ? `http://localhost:5000/api/syllabus/${id}`
                : "http://localhost:5000/api/savesyllabus";
            const method = isEditMode ? "PUT" : "POST";

            const formData = new FormData();
            formData.append("classId", form.classId);
            formData.append("title", form.title);
            formData.append("description", form.description);

            if (form.files && form.files.length > 0) {
                Array.from(form.files).forEach((f: File) => {
                    formData.append("file", f);
                });
            }

            const res = await fetch(url, {
                method,
                body: formData,
            });

            if (res.ok) {
                alert(isEditMode ? "syllabus updated successfully!" : "syllabus added successfully!");
                navigate("/syllabus", {
                    state: { success: isEditMode ? "syllabus updated" : "syllabus added" },
                });
            } else {
                alert("Failed to save syllabus.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Syllabus" : "Add Syllabus"}
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
                <Input name="title" label="Title " onChange={handleChange} value={form.title} errors={errors} />
                <Input name="description" label="Description " onChange={handleChange} value={form.description} errors={errors} />
                <Input type="file" name="files" label="File" onChange={handleChange} multiple accept="application/pdf"/>
                <div className="pt-2 col-span-full">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {isEditMode ? "Update Syllabus" : "Add Syllabus"}
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
  multiple?: boolean; // ✅ Added to support multiple file uploads
  accept?: string;
};

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  errors = {},
  multiple = false, // ✅ Default false
  accept,
}: InputProps) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium" htmlFor={name}>
      {label}
    </label>

    <input
      id={name}
      type={type}
      name={name}
      value={type === "file" ? undefined : value ?? ""}
      onChange={onChange}
      multiple={type === "file" ? multiple : undefined} // ✅ only use multiple if type="file"
      accept={type === "file" ? accept : undefined}
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
