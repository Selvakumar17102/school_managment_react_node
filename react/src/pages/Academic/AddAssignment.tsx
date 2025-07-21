import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "../date-picker.tsx";

export default function AddAssignment() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        title: "",
        description: "",
        deadline: "",
        classId: "",
        sectionId: "",
        subjectId: "",
        files: [],
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [classes, setClass] = useState([]);
    const [sections, setSection] = useState([]);
    const [subjects, setSubject] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            fetch(`http://localhost:5000/api/assignment/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        title: data.title,
                        description: data.description,
                        deadline: data.deadline,
                        classId: data.classId,
                        sectionId: data.sectionId,
                        subjectId: data.subjectId,
                        files: data.files,
                    });
                })
                .catch(err => console.error("Failed to fetch assignment", err));
        }
    }, [isEditMode, id]);

    useEffect(() => {
        fetch("http://localhost:5000/api/classlist")
            .then(res => res.json())
            .then(data => setClass(data))
            .catch(err => console.error("Failed to load classes", err));
    }, []);
    useEffect(() => {
        fetch("http://localhost:5000/api/sectionlist")
            .then(res => res.json())
            .then(data => setSection(data))
            .catch(err => console.error("Failed to load section", err));
    }, []);
    useEffect(() => {
        fetch("http://localhost:5000/api/subjectlist")
            .then(res => res.json())
            .then(data => setSubject(data))
            .catch(err => console.error("Failed to load section", err));
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.title.trim()) newErrors.title = "title are required";
        if (!form.description.trim()) newErrors.description = "description are required";
        if (!form.deadline.trim()) errors.deadline = "Deadline is required";
        if (!form.classId.trim()) newErrors.classId = "class Name are required";
        if (!form.sectionId.trim()) newErrors.sectionId = "Section Name are required";
        if (!form.subjectId.trim()) newErrors.subjectId = "Subject Name are required";
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
                ? `http://localhost:5000/api/assignment/${id}`
                : "http://localhost:5000/api/saveAssignment";
            const method = isEditMode ? "PUT" : "POST";

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("deadline", form.deadline);
            formData.append("classId", form.classId);
            formData.append("sectionId", form.sectionId);
            formData.append("subjectId", form.subjectId);

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
                alert(isEditMode ? "assignment updated successfully!" : "assignment added successfully!");
                navigate("/assignment", {
                    state: { success: isEditMode ? "assignment updated" : "assignment added" },
                });
            } else {
                alert("Failed to save assignment.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Assignment" : "Add Assignment"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="title" label="Title " onChange={handleChange} value={form.title} errors={errors} />
                <Input name="description" label="Description " onChange={handleChange} value={form.description} errors={errors} />
                <DatePicker
                    id="deadline"
                    label="Deadline"
                    defaultDate={form.deadline}
                    onChange={([selectedDate]) =>
                        setForm((prevForm) => ({
                        ...prevForm,
                        deadline: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                        }))
                    }
                />
                {errors.deadline && (
                    <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
                )}
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
                    <label className="block mb-1 text-sm font-medium">Section</label>
                    <select
                        name="sectionId"
                        value={form.sectionId}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select a Section</option>
                        {sections.map((sectionss) => (
                            <option key={sectionss.id} value={sectionss.id}>
                                {sectionss.sectionName}
                            </option>
                        ))}
                    </select>
                    {errors.sectionId && <p className="text-red-500 text-sm">{errors.sectionId}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Subject</label>
                    <select
                        name="subjectId"
                        value={form.subjectId}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select a Subject</option>
                        {subjects.map((subejctss) => (
                            <option key={subejctss.id} value={subejctss.id}>
                                {subejctss.subjectName}
                            </option>
                        ))}
                    </select>
                    {errors.subjectId && <p className="text-red-500 text-sm">{errors.subjectId}</p>}
                </div>

                <Input type="file" name="files" label="File" onChange={handleChange} multiple accept="application/pdf"/>
                <div className="pt-2 col-span-full">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        {isEditMode ? "Update Assignment" : "Add Assignment"}
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
  multiple?: boolean;
  accept?: string;
};

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  errors = {},
  multiple = false,
  accept,
}: InputProps) => {
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    id: name,
    name,
    type,
    onChange,
    className: `w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`,
  };

  if (type !== "file") {
    inputProps.value = value ?? "";
  }

  if (type === "file") {
    inputProps.multiple = multiple;
    if (accept) inputProps.accept = accept;
  }

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 text-sm font-medium">
        {label}
      </label>
      <input {...inputProps} />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );
};
