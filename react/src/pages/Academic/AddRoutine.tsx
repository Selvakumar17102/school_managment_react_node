import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddRoutine() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const getDefaultSchoolYearValue = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const startYear = month >= 3 ? year : year - 1;
    const endYear = startYear + 1;
    return `${startYear}-${endYear}`;
    };

    const schoolYears = [
    { id: "2023-2024", name: "2023-2024" },
    { id: "2024-2025", name: "2024-2025" },
    { id: "2025-2026", name: "2025-2026" },
    { id: "2026-2027", name: "2026-2027" },
    ];

    const displaySchoolYears = schoolYears.map((sy) => ({
        id: sy.id,
        name: sy.id === getDefaultSchoolYearValue() ? `${sy.name} (Default)` : sy.name,
    }));


    const [form, setForm] = useState({
        schoolYear: getDefaultSchoolYearValue(),
        classId: "",
        sectionId: "",
        subjectId: "",
        teacherId: "",
        day: "",
        startTime: "",
        endTime: "",
        room: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [classes, setClass] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    useEffect(() => {
        if (isEditMode) {
            // fetch(`http://localhost:5000/api/syllabus/${id}`)
            //     .then(res => res.json())
            //     .then(data => {
            //         setForm({
            //             classId: data.classId,
            //             title: data.title,
            //             description: data.description,
            //             files: data.files,
            //         });
            //     })
            //     .catch(err => console.error("Failed to fetch syllabus", err));
        }
    }, [isEditMode, id]);

    


    useEffect(() => {
        fetch("http://localhost:5000/api/classlist")
            .then((res) => res.json())
            .then((data) => {
            const formatted = data.map((item: any) => ({
                id: item.id,
                name: item.className,
            }));
            setClass(formatted);
            })
            .catch((err) => console.error("Failed to load classes", err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/subjectlist")
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((item: any) => ({
                    id: String(item.id),          // Convert to string
                    name: item.subjectName || item.name, // Match your DB field
                }));
                setSubjects(formatted);
            });

        fetch("http://localhost:5000/api/sectionlist")
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((item: any) => ({
                    id: String(item.id),
                    name: item.sectionName || item.name,
                }));
                setSections(formatted);
            });

        fetch("http://localhost:5000/api/teacherlist")
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((item: any) => ({
                    id: String(item.id),
                    name: item.name,
                }));
                setTeachers(formatted);
            });
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.schoolYear) newErrors.schoolYear = "School year is required";
        if (!form.classId) newErrors.classId = "Class is required";
        if (!form.sectionId) newErrors.sectionId = "Section is required";
        if (!form.subjectId) newErrors.subjectId = "Subject is required";
        if (!form.teacherId) newErrors.teacherId = "Teacher is required";
        if (!form.day) newErrors.day = "Day is required";
        if (!form.startTime) newErrors.startTime = "Start time is required";
        if (!form.endTime) newErrors.endTime = "End time is required";
        if (!form.room.trim()) newErrors.room = "Room is required";
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
            ? `http://localhost:5000/api/routines/${id}`
            : "http://localhost:5000/api/saveroutines";
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
            });

            if (res.ok) {
            alert(isEditMode ? "Routine updated successfully!" : "Routine added successfully!");
            navigate("/routine", {
                state: { success: isEditMode ? "Routine updated" : "Routine added" },
            });
            } else {
            alert("Failed to save routine.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Routine" : "Add Routine"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput label="School Year" name="schoolYear" options={displaySchoolYears} value={form.schoolYear} onChange={handleChange} errors={errors}/>
            <SelectInput label="Class" name="classId" options={classes} value={form.classId} onChange={handleChange} errors={errors} />
            <SelectInput label="Section" name="sectionId" options={sections} value={form.sectionId} onChange={handleChange} errors={errors} />
            <SelectInput label="Subject" name="subjectId" options={subjects} value={form.subjectId} onChange={handleChange} errors={errors} />
            <SelectInput label="Day" name="day" options={days.map((d) => ({ id: d, name: d }))} value={form.day} onChange={handleChange} errors={errors} />
            <SelectInput label="Teacher" name="teacherId" options={teachers} value={form.teacherId} onChange={handleChange} errors={errors} />
            <Input type="time" name="startTime" label="Starting Time" value={form.startTime} onChange={handleChange} errors={errors} />
            <Input type="time" name="endTime" label="Ending Time" value={form.endTime} onChange={handleChange} errors={errors} />
            <Input name="room" label="Room" value={form.room} onChange={handleChange} errors={errors} />
            <div className="pt-2 col-span-full">
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition">
                {isEditMode ? "Update Routine" : "Add Routine"}
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

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  errors = {},
}: InputProps) => (
  <div>
    <label className="block mb-1 text-sm font-medium" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value ?? ""}
      onChange={onChange}
      className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[name] ? "border-red-500" : "border-gray-300"
      }`}
    />
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
    )}
  </div>
);

type SelectInputProps = {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string | number; name: string }[];
  errors?: { [key: string]: string };
};

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  errors = {},
}: SelectInputProps) => (
  <div>
    <label className="block mb-1 text-sm font-medium" htmlFor={name}>
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[name] ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
    )}
  </div>
);

