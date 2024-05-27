import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState({ name: "", value: "" });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // Fetch data from the backend
        axios
            .get("http://localhost:3000/data")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:3000/data", newItem)
            .then((response) => {
                setData((prevData) => [...prevData, response.data]);
                setNewItem({ name: "", value: "" });
                window.alert("Item added successfully!");
            })
            .catch((error) => {
                console.error("There was an error inserting the data!", error);
                window.alert("There was an error inserting the data!");
            });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", selectedFile);

        axios
            .post("http://localhost:3000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("File uploaded successfully:", response.data);
                window.alert("File uploaded successfully!");
                setSelectedFile(null);
                document.querySelector('input[type="file"]').value = "";
            })
            .catch((error) => {
                console.error("There was an error uploading the file!", error);
                window.alert("There was an error uploading the file!");
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <div>
            <h1>Data Table</h1>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                />
                <input
                    type="number"
                    name="value"
                    value={newItem.value}
                    onChange={handleInputChange}
                    placeholder="Value"
                    required
                />
                <button type="submit">Add Item</button>
            </form>
            <h2>Upload Image</h2>
            <form onSubmit={handleFileUpload}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept="image/png, image/jpeg"
                />
                <button type="submit">Upload Image</button>
            </form>
        </div>
    );
}

export default App;
