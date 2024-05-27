import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState({ name: "", value: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [apiBaseUrl, setApiBaseUrl] = useState("");

    useEffect(() => {
        const apiUrl = window.__ENV__
            ? window.__ENV__.BACKEND_URL
            : "http://localhost:3000";
        setApiBaseUrl(apiUrl);
        if (!apiBaseUrl) return;
        axios
            .get(`${apiBaseUrl}/data`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

        // Fetch the list of uploaded images
        axios
            .get(`${apiBaseUrl}/imagelist`)
            .then((response) => {
                setUploadedImages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching images:", error);
            });
    }, [apiBaseUrl]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(`${apiBaseUrl}/data`, newItem)
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
            .post(`${apiBaseUrl}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("File uploaded successfully:", response.data);
                window.alert("File uploaded successfully!");
                setSelectedFile(null);
                document.querySelector('input[type="file"]').value = "";
                setUploadedImages((prevImages) => [
                    ...prevImages,
                    response.data.filename,
                ]);
            })
            .catch((error) => {
                console.error("There was an error uploading the file!", error);
                window.alert("There was an error uploading the file!");
            });
    };

    const handleDelete = (filename) => {
        // confirm before deleting the file
        if (!window.confirm("Are you sure you want to delete this file?")) {
            return;
        }
        axios
            .delete(`${apiBaseUrl}/image/${filename}`)
            .then((response) => {
                console.log("File deleted successfully:", response.data);
                setUploadedImages((prevImages) =>
                    prevImages.filter((image) => image !== filename)
                );
                window.alert("File deleted successfully!");
            })
            .catch((error) => {
                console.error("There was an error deleting the file!", error);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <div className="container">
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
            </div>
            <div>
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
                <h2>Uploaded Images</h2>
                <div className="image-gallery">
                    {uploadedImages.map((filename, index) => (
                        <div key={index} className="image-item">
                            <img
                                src={`${apiBaseUrl}/images/${filename}`}
                                alt={`Uploaded ${filename}`}
                            />
                            <button onClick={() => handleDelete(filename)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
