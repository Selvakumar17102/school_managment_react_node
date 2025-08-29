import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../config";

type Role = {
  id: number;
  role_name: string;
};

type Category = {
  id: number;
  category: string;
};


export default function AddLeaveAssign() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        roleId: "",
        categoryId: "",
        noOfDays:""
    });


    const [roles, setRoles] = useState<Role[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        // Fetch Roles
        fetch(`${BASE_URL}/roles`)
            .then((res) => res.json())
            .then((data) => setRoles(data))
            .catch((err) => console.error("Role fetch error:", err));

        // Fetch Leave Categories
        fetch(`${BASE_URL}/leavecategorylist`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Category fetch error:", err));
    }, []);



    useEffect(() => {
        if (isEditMode) {
            fetch(`${BASE_URL}/leaveassign/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        roleId: data.roleId,
                        categoryId: data.categoryId,
                        noOfDays: data.noOfDays,
                    });
                })
                .catch(err => console.error("Failed to fetch Leave Assign", err));
        }
    }, [isEditMode, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const url = isEditMode
                ? `${BASE_URL}/leaveassign/${id}`
                : `${BASE_URL}/saveleaveassign`;
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert(isEditMode ? "Leave Assign updated successfully!" : "Leave Assign added successfully!");
                navigate("/leaveassign", {
                    state: { success: isEditMode ? "Leave Assign updated" : "Leave Assign added" },
                });
            } else {
                alert("Failed to save Leave Assign.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">
            {isEditMode ? "Edit Leave Assign" : "Add Leave Assign"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Select */}
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                Role <span className="text-red-500">*</span>
                </label>
                <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                >
                <option value="">Select Role</option>
                {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                    {role.role_name}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                Category <span className="text-red-500">*</span>
                </label>
                <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                    {cat.category}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                NO of Day <span className="text-red-500">*</span>
                </label>
                <input
                type="number"
                name="noOfDays"
                value={form.noOfDays}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded">
                {isEditMode ? "Update Leave Assign" : "Add Leave Assign"}
                </button>
            </div>
            </form>
        </div>
    );

}
