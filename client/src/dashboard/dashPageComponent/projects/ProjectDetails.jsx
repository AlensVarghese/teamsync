import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "../../../utils/ProjectsContext";
import Button from "../../../components/Button";
import TooltipButton from "../../../components/TooltipButton";
import UserAvatar from "../commonComponents/UserAvatar";
import axios from "axios";
import { MdArchive, MdDelete, MdOutlineEditNote } from "react-icons/md";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import CommentsSection from "./comments/CommentsSection";
import ConfirmationModal from "../../../dashboard/adminDashboard/ConfirmationModal";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, setProjects } = useProjects();
  const currentUserEmail = localStorage.getItem("userEmail");

  const currentUser = { _id: "currentUserId", email: currentUserEmail };

  const contextProject = projects.find((p) => p._id === projectId);
  const [project, setProject] = useState(contextProject);
  const [loading, setLoading] = useState(!contextProject);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [managedTitle, setManagedTitle] = useState(contextProject?.title || "");
  const [managedDescription, setManagedDescription] = useState(
    contextProject?.description || ""
  );
  const [managedProgress, setManagedProgress] = useState(
    contextProject?.progress || 0
  );
  const [managedMembers, setManagedMembers] = useState(
    contextProject?.members || []
  );
  const [availableMembers, setAvailableMembers] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTitle, setFileTitle] = useState("");
  const [sharedFiles, setSharedFiles] = useState([]);
  const [showSharedFiles, setShowSharedFiles] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState([]);

  // Modal states for confirmation and feedback
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: "",
    action: null,
  });
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    message: "",
  });

  // Utility function to open confirmation modal
  const openConfirmModal = (message, action) => {
    setConfirmModal({ open: true, message, action });
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal({ open: false, message: "", action: null });
  };

  // Close feedback modal
  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, message: "" });
  };

  useEffect(() => {
    if (!contextProject) {
      axios
        .get(`http://localhost:5000/api/projects/${projectId}`)
        .then((response) => {
          setProject(response.data.project);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch project details:", error);
          setLoading(false);
        });
    }
  }, [projectId, contextProject]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/users");
        const filteredUsers = response.data.filter(
          (user) => user.email !== "teamsyncadmin@gmail.com"
        );
        setAvailableMembers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (project) {
      setManagedTitle(project.title);
      setManagedDescription(project.description);
      setManagedProgress(project.progress);
      setManagedMembers(project.members);
      setSharedFiles(project.files || []);

      axios
        .get(`http://localhost:5000/api/projects/${project._id}/comments`)
        .then((response) => {
          setComments(response.data.comments);
        })
        .catch((error) => {
          console.error("Failed to fetch comments", error);
        });
    }
  }, [project]);

  if (loading) {
    return <div>Loading project details...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  const isAdmin = project.admin && project.admin.email === currentUserEmail;

  const toggleManagedMember = (member) => {
    if (managedMembers.find((m) => m.email === member.email)) {
      setManagedMembers(managedMembers.filter((m) => m.email !== member.email));
    } else {
      setManagedMembers([...managedMembers, member]);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = {
      title: managedTitle,
      description: managedDescription,
      progress: Number(managedProgress),
      members: managedMembers.map((m) => m._id),
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/projects/${project._id}`,
        updatedProject
      );
      const updatedData = response.data.project;
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p._id === project._id ? updatedData : p))
      );
      setProject(updatedData);
      setOpenEditModal(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleArchiveClick = () => {
    openConfirmModal("Are you sure you want to archive this project?", async () => {
      try {
        await axios.patch(
          `http://localhost:5000/api/projects/${project._id}/archive`
        );
        setFeedbackModal({ open: true, message: "Project archived successfully!" });
        setProject({ ...project, archived: true });
      } catch (error) {
        console.error("Failed to archive project:", error);
      } finally {
        closeConfirmModal();
      }
    });
  };

  const handleDeleteClick = () => {
    openConfirmModal("Are you sure you want to delete this project?", async () => {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${project._id}`);
        setFeedbackModal({ open: true, message: "Project deleted successfully!" });
        navigate("/home/projects");
      } catch (error) {
        console.error("Failed to delete project:", error);
      } finally {
        closeConfirmModal();
      }
    });
  };

  const handleToggleSharedFiles = () => {
    setShowSharedFiles((prev) => !prev);
    setShowComments(false);
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
    setShowSharedFiles(false);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !fileTitle) {
      setFeedbackModal({ open: true, message: "Please select a file and enter a title" });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", fileTitle);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${project._id}/files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedProject = response.data.project;
      setProject(updatedProject);
      setSharedFiles(updatedProject.files);
      setSelectedFile(null);
      setFileTitle("");
      setOpenUploadModal(false);
      setFeedbackModal({ open: true, message: "File uploaded successfully!" });
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const handleViewFile = async (file) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/projects/files/${file._id}`
      );
      window.open(response.data.fileUrl, "_blank");
    } catch (error) {
      console.error("Failed to view file:", error);
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/projects/files/${file._id}/download`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleDeleteFile = (file) => {
    openConfirmModal("Are you sure you want to delete this file?", async () => {
      try {
        await axios.delete(`http://localhost:5000/api/projects/files/${file._id}`);
        setFeedbackModal({ open: true, message: "File deleted successfully!" });
        setSharedFiles((prevFiles) =>
          prevFiles.filter((f) => f._id !== file._id)
        );
      } catch (error) {
        console.error("Failed to delete file:", error);
        setFeedbackModal({ open: true, message: "Failed to delete file." });
      } finally {
        closeConfirmModal();
      }
    });
  };

  const handlePostComment = async (message) => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        throw new Error("User email not found in local storage");
      }
      const payload = { message, userEmail };
      const response = await axios.post(
        `http://localhost:5000/api/projects/${project._id}/comments`,
        payload
      );
      const newComment = response.data.comment;
      setComments((prevComments) => [newComment, ...prevComments]);
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <div className="w-full relative">
      <div className="w-full flex gap-6 ">
        <div className="flex flex-col gap-4 p-6 rounded-2xl w-2/3 bg-white border border-gray-200 text-customBlack">
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <h2 className="text-2xl font-semibold leading-none">
                {project.title}
              </h2>
              <div className="inline-flex gap-4 justify-end">
                <button
                  onClick={() => setOpenEditModal(true)}
                  className="border-none bg-transparent p-0 focus:outline-none self-end gap-1 transition text-customBgBlue hover:text-customHeadingColor text-2xl"
                >
                  <MdOutlineEditNote />
                </button>
              </div>
            </div>
            <div className="flex gap-2 text-base">
              <button
                tooltip={
                  project.archived ? "Project already archived" : "Archive"
                }
                onClick={!project.archived ? handleArchiveClick : undefined}
                className="bg-transparent border-none focus:outline-none flex items-center gap-1 transition text-customBgBlue hover:text-customHeadingColor hover:bg-customWhite"
                disabled={project.archived}
              >
                <MdArchive />
                {project.archived ? "Archived" : "Archive"}
              </button>
              <button
                tooltip="Delete"
                onClick={handleDeleteClick}
                className="bg-red-500 text-white border-none focus:outline-none flex items-center gap-1 transition hover:bg-red-600"
              >
                <MdDelete />
                <span>Delete</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-customBlack">Created by: </p>
            {project.admin ? (
              <>
                <UserAvatar email={project.admin.email} size={32} />
                <p className="text-sm">
                  {project.admin.userId || project.admin.email.split("@")[0]}
                </p>
              </>
            ) : (
              project.creatorEmail && (
                <>
                  <UserAvatar email={project.creatorEmail} size={32} />
                  <p className="text-sm">
                    {project.creatorEmail.split("@")[0]}
                  </p>
                </>
              )
            )}
          </div>
          <p className="text-sm">{project.description}</p>
          <div className="Tasks p-4 bg-customWhite mt-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Project Tasks</h3>
            {project.tasks && project.tasks.length > 0 ? (
              <div className="space-y-2">
                {project.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-semibold text-sm">{task.taskName}</p>
                      <p className="text-xs text-gray-600">
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {task.assignees && task.assignees.length > 0 ? (
                        task.assignees.map((assignee) => (
                          <UserAvatar
                            key={assignee.email}
                            email={assignee.email}
                            size={28}
                          />
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No assignees</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No tasks available for this project.
              </p>
            )}
          </div>
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={handleToggleSharedFiles}
              className={`border-none p-2 text-customBgBlue focus:outline-none transition  ${
                showSharedFiles
                  ? "bg-customBgBlue text-white"
                  : "bg-transparent text-customBgBlue"
              }`}
            >
              Shared files
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleToggleComments}
                className={`border-none p-2 text-customBgBlue focus:outline-none transition ${
                  showComments
                    ? "bg-customBgBlue text-white"
                    : "bg-transparent text-customBgBlue"
                }`}
              >
                Comments
              </button>
              <button
                onClick={() => setOpenUploadModal(true)}
                className="bg-transparent border-none text-customBgBlue p-2 focus:outline-none"
              >
                Upload
              </button>
            </div>
          </div>
          {showSharedFiles && (
            <div className="border-t mt-4 max-h-64 overflow-y-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">S.No.</th>
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sharedFiles.length > 0 ? (
                    sharedFiles.map((file, index) => (
                      <tr key={file._id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{file.title}</td>
                        <td className="border px-4 py-2">
                          <Button
                            className="mr-2 text-blue-500"
                            onClick={() => handleViewFile(file)}
                          >
                            View
                          </Button>
                          <Button
                            className="text-green-500 mr-2"
                            onClick={() => handleDownloadFile(file)}
                          >
                            Download
                          </Button>
                          <Button
                            className="text-red-500"
                            onClick={() => handleDeleteFile(file)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="border px-4 py-2 text-center">
                        No shared files
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {showComments && (
            <CommentsSection
              comments={comments}
              onPostComment={handlePostComment}
              currentUser={currentUser}
              projectId={project._id}
              setComments={setComments}
            />
          )}
        </div>
        <div className="relative w-1/3">
          <div className="sticky top-0">
            <div className=" flex flex-col">
              <div className=" max-h-[80vh] overflow-y-scroll gap-4 p-6 rounded-2xl bg-customWhite border border-gray-200 text-customBlack">
                <p className="mb-4 font-semibold">Assigned Members</p>
                <div className="flex flex-col">
                  {project.members.map((member) => (
                    <div
                      key={member.email}
                      className="flex gap-4 items-center py-3 border-b"
                    >
                      <UserAvatar email={member.email} size={32} />
                      <p className="text-sm">{member.email.split("@")[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-[40%] relative">
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-2 right-2 text-2xl text-gray-600 bg-transparent border-none focus:outline-none"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit Project</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={managedTitle}
                  onChange={(e) => setManagedTitle(e.target.value)}
                  placeholder="Project Title"
                  className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={managedDescription}
                  onChange={(e) => setManagedDescription(e.target.value)}
                  placeholder="Project Description"
                  className="w-full p-2 border border-gray-300 bg-white text-black rounded text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Progress (%)
                </label>
                <input
                  type="number"
                  value={managedProgress}
                  onChange={(e) => setManagedProgress(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 bg-white text-black rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Assign Members
                </label>
                <MultiSelectDropdown
                  options={availableMembers}
                  selectedOptions={managedMembers}
                  onChange={setManagedMembers}
                  placeholder="Select members..."
                />
              </div>
              <Button type="submit" className="py-1 text-sm !bg-customBgBlue hover:!bg-customHeadingColor text-white">
                Save Changes
              </Button>
            </form>
          </div>
        </div>
      )}

      {openUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-[40%] relative">
            <button
              onClick={() => setOpenUploadModal(false)}
              className="absolute top-2 right-2 text-2xl text-gray-600 bg-transparent border-none focus:outline-none"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Upload File</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter file title"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                className="w-full p-2 border bg-white text-black border-gray-300 rounded mb-2"
              />
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              {selectedFile && (
                <div className="flex items-center mt-2">
                  <span>{selectedFile.name}</span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="ml-2 text-red-500"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
            <Button onClick={handleFileUpload}>Upload</Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmModal.open}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={closeConfirmModal}
      />

      {/* Feedback Modal */}
      <ConfirmationModal
        open={feedbackModal.open}
        message={feedbackModal.message}
        onConfirm={closeFeedbackModal}
        onCancel={closeFeedbackModal}
        confirmButtonText="OK"
      />
    </div>
  );
};

export default ProjectDetails;
