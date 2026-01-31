import React, { useState, useContext, useEffect } from "react";
import { useProjects } from "../../../utils/ProjectsContext";
import Button from "../../../components/Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTaskForm from "./EditTaskForm";
import GlobalAddTaskForm from "./GlobalAddTaskForm";
import TooltipButton from "../../../components/TooltipButton";
import { UserContext } from "../../../utils/UserContext";
import UserAvatar from "../commonComponents/UserAvatar";
import { addTask, updateTask, deleteTask, getUserTasks } from "../../../utils/api";

const getUsernameFromEmail = (email) => (email ? email.split("@")[0] : "");

const TaskPage = () => {
  const { projects, setProjects } = useProjects();
  const { user } = useContext(UserContext);
  const currentUser = { email: localStorage.getItem("userEmail") };

  const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState("deadline");
  
  // New state to manage the delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    projectId: null,
    taskId: null,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getUserTasks(currentUser.email);
        console.log("Fetched tasks:", tasks);
        setProjects((prevProjects) => {
          const updatedProjects = prevProjects.map((proj) => ({
            ...proj,
            tasks: tasks.filter((task) => task.projectId === proj._id),
          }));
          console.log("Updated projects:", updatedProjects);
          return updatedProjects;
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [currentUser.email, setProjects]);

  const handleAddTask = async (newTask) => {
    try {
      const addedTask = await addTask(newTask);
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj._id === addedTask.projectId
            ? {
                ...proj,
                tasks: proj.tasks ? [addedTask, ...proj.tasks] : [addedTask],
              }
            : proj
        )
      );
      setOpenAddTaskModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = async (updatedTask) => {
    if (!updatedTask._id) {
      console.error("Task ID is undefined:", updatedTask);
      return;
    }

    try {
      const editedTask = await updateTask(updatedTask._id, updatedTask);
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj._id === editedTask.projectId
            ? {
                ...proj,
                tasks: proj.tasks.map((task) =>
                  task._id === editedTask._id ? editedTask : task
                ),
              }
            : proj
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Instead of calling window.confirm, we open the delete modal.
  const handleDeleteTask = (projectId, taskId) => {
    setDeleteModal({ open: true, projectId, taskId });
  };

  // Confirm deletion from within the modal
  const confirmDelete = async () => {
    const { projectId, taskId } = deleteModal;
    try {
      await deleteTask(taskId, projectId);
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj._id === projectId
            ? {
                ...proj,
                tasks: proj.tasks.filter((task) => task._id !== taskId),
              }
            : proj
        )
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleteModal({ open: false, projectId: null, taskId: null });
    }
  };

  const handleToggleCompleted = (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    handleEditTask(updatedTask);
  };

  const getProjectById = (projectId) => {
    return projects.find((project) => project._id === projectId);
  };

  const userProjects = projects.filter((project) =>
    project.members.some((member) => member.email === currentUser.email)
  );

  const tasks = userProjects.flatMap((proj) =>
    (proj.tasks || []).map((task) => ({
      ...task,
      projectTitle: proj.title,
      projectId: proj._id,
      completed: task.completed || false,
    }))
  );

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (sortBy === "title") {
      return a.taskName.localeCompare(b.taskName);
    } else if (sortBy === "project") {
      return a.projectTitle.localeCompare(b.projectTitle);
    }
    return 0;
  });

  console.log("Rendering TaskPage with tasks:", sortedTasks);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-1 rounded focus:outline-1 bg-white focus:outline-customBgBlue"
          >
            <option value="deadline">Deadline</option>
            <option value="title">Task Title</option>
            <option value="project">Project</option>
          </select>
        </div>
        {user?.role === 'Admin' && (
          <Button
            onClick={() => setOpenAddTaskModal(true)}
            className="!bg-customBgBlue hover:!bg-customHeadingColor text-white"
          >
            + Add Task
          </Button>
        )}
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Task Title</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Project</th>
            <th className="border p-2 text-left">Deadline</th>
            <th className="border p-2 text-left">Completed</th>
            <th className="border p-2 text-left">Assignees</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <tr key={task._id}>
                <td className="border p-2 text-sm">{task.taskName}</td>
                <td className="border p-2 text-sm">{task.description}</td>
                <td className="border p-2 text-sm">{task.projectTitle}</td>
                <td className={`border p-2 text-xs`}>{task.deadline}</td>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task)}
                  />
                </td>
                <td className="border p-2">
                  {task.assignees && task.assignees.length > 0 ? (
                    <div className="flex -space-x-3">
                      {task.assignees.map((assignee) => (
                        <div
                          key={assignee.email}
                          title={getUsernameFromEmail(assignee.email)}
                        >
                          <UserAvatar email={assignee.email} size={32} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    "No assignees"
                  )}
                </td>
                <td className="border p-2">
                  <div className="flex items-center justify-center gap-2 h-full">
                    {user?.role === 'Admin' && ( // Add this check
                    <>
                        <TooltipButton
                          className="!px-2 !py-2 !text-base hover:text-white"
                          onClick={() => setEditingTask(task)}
                        >
                          <FaEdit />
                        </TooltipButton>
                        <TooltipButton
                          className="!px-2 !py-2 !text-base !bg-red-200 text-red-500 hover:!text-red-500"
                          onClick={() => handleDeleteTask(task.projectId, task._id)}
                        >
                          <FaTrash />
                        </TooltipButton>
                      </>
                    )}
                    {user?.role !== 'Admin' && <span className="text-gray-400">View Only</span>}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2" colSpan="7">
                No tasks available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {openAddTaskModal && user?.role === 'Admin' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setOpenAddTaskModal(false)}
          ></div>
          <div className="bg-white p-6 rounded z-10 w-10/12 md:w-[40%] overflow-y-scroll">
            <GlobalAddTaskForm
              projects={userProjects}
              addTask={handleAddTask}
              closeForm={() => setOpenAddTaskModal(false)}
            />
          </div>
        </div>
      )}

      {editingTask && user?.role === 'Admin' &&(
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setEditingTask(null)}
          ></div>
          <div className="bg-white p-6 rounded z-10 w-10/12 md:w-[40%] overflow-y-scroll">
            <EditTaskForm
              projectId={editingTask.projectId}
              task={editingTask}
              updateTask={handleEditTask}
              closeForm={() => setEditingTask(null)}
              availableAssignees={getProjectById(editingTask.projectId)?.members || []}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setDeleteModal({ open: false, projectId: null, taskId: null })}
          ></div>
          <div className="bg-white p-6 rounded z-10 w-11/12 md:w-1/3">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="mt-4 flex justify-end gap-4">
              <Button onClick={() => setDeleteModal({ open: false, projectId: null, taskId: null })} className="!bg-gray-200 hover:!bg-gray-300 hover:!border-customBgBlue hover:!text-customBlack">
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="!bg-red-500 hover:!bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
