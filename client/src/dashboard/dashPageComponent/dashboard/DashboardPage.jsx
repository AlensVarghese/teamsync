import React from "react";
import { useProjects } from "../../../utils/ProjectsContext";
import UserAvatar from "../commonComponents/UserAvatar";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { projects } = useProjects();
  const currentUserEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  // Filter projects for the current user that are not archived
  const userProjects = projects.filter(
    (project) =>
      project.members.some((member) => member.email === currentUserEmail) &&
      !project.archived
  );
  const totalProjects = userProjects.length;
  const inProgressProjects = userProjects.filter(
    (project) => project.progress < 100
  ).length;
  const completedProjects = userProjects.filter(
    (project) => project.progress === 100
  ).length;

  const handleNavigateProject = () => {
    navigate("/home/projects");
  };

  const handleNavigateTask = () => {
    navigate("/home/tasks");
  };

  // Collect all tasks for the current user from all projects
  const allTasks = projects.flatMap(
    (project) =>
      project.tasks?.filter((task) =>
        task.assignees?.some((assignee) => assignee.email === currentUserEmail)
      ) || []
  );
  const totalTasks = allTasks.length;
  const inProgressTasks = allTasks.filter((task) => !task.completed).length;
  const completedTasks = allTasks.filter((task) => task.completed).length;

  // Recent notifications (last 5 projects and tasks)
  const recentProjects = projects
    .filter(
      (project) =>
        new Date(project.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
        project.members.some((member) => member.email === currentUserEmail)
    )
    .slice(0, 5);

  const recentTasks = allTasks
    .filter(
      (task) =>
        new Date(task.createdAt) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )
    .slice(0, 5);

  return (
    <div className="flex gap-6">
      {/* Main Content - Left Side */}
      <div className="w-2/3 flex flex-col gap-6">
        {/* Top Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Projects Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Total Projects:
                  </h3>
                  <p className="text-3xl font-bold text-customBgBlue -mt-3">
                    {totalProjects}
                  </p>
                </div>
                <p
                  onClick={handleNavigateProject}
                  className="cursor-pointer text-customBgBlue text-sm pr-2 hover:text-customHeadingColor"
                >
                  View projects
                </p>
              </div>
              <div className="flex justify-between">
                <p className="py-1 px-4 rounded-3xl text-yellow-700 bg-orange-300 bg-opacity-50 text-sm">
                  In Progress: {inProgressProjects}
                </p>
                <p className="py-1 px-4 rounded-3xl text-green-700 bg-green-300 bg-opacity-50 text-sm">
                  Completed: {completedProjects}
                </p>
              </div>
            </div>
          </div>
          {/* Tasks Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <h3 className="text-lg font-semibold mb-2">Total Tasks:</h3>
                  <p className="text-3xl font-bold text-customBgBlue -mt-3">
                    {totalTasks}
                  </p>
                </div>
                <p
                  onClick={handleNavigateTask}
                  className="cursor-pointer text-customBgBlue text-sm pr-2 hover:text-customHeadingColor"
                >
                  View tasks
                </p>
              </div>
              <div className="flex justify-between">
                <p className="py-1 px-4 rounded-3xl text-yellow-700 bg-orange-300 bg-opacity-50 text-sm">
                  In Progress: {inProgressTasks}
                </p>
                <p className="py-1 px-4 rounded-3xl text-green-700 bg-green-300 bg-opacity-50 text-sm">
                  Completed: {completedTasks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Projects Overview</h3>
          <div className="space-y-4">
            {userProjects.map((project) => (
              <div
                key={project._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <p className="text-sm font-medium">{project.title}</p>
                <p
                  className={`text-sm font-semibold ${
                    project.progress < 100
                      ? "text-yellow-700"
                      : "text-green-700"
                  }`}
                >
                  {project.progress < 100 ? "In Progress" : "Completed"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Task Overview */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Task Overview</h3>
          <div className="space-y-4">
            {allTasks.map((task) => (
              <div
                key={task._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <p className="text-sm font-medium">{task.taskName}</p>
                <p
                  className={`text-sm font-semibold ${
                    !task.completed ? "text-yellow-700" : "text-green-700"
                  }`}
                >
                  {!task.completed ? "In Progress" : "Completed"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Sidebar - Right Side */}
      <div className="w-1/3">
        <div className="sticky top-0 max-h-[calc(100vh-100px)] overflow-y-auto">
          <div className="bg-customWhite p-4 rounded-2xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>

            {/* Project Notifications */}
            <div className="mb-6">
              <h4 className="font-medium mb-2 text-customBgBlue">
                New Projects
              </h4>
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div
                    key={project._id}
                    className="p-2 bg-customWhite rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        email={project.admin?.email || project.creatorEmail}
                        size={32}
                      />
                      <div>
                        <p className="text-xs text-gray-500">
                          Assigned new project on:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium">{project.title}</p>
                        {/* <p className="text-xs text-gray-500">
                          Added{" "}
                          
                        </p> */}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No new projects</p>
              )}
            </div>

            {/* Task Notifications */}
            <div>
              <h4 className="font-medium mb-2 text-customBgBlue">New Tasks</h4>
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-2 bg-customWhite rounded-lg w-full"
                  >
                      <div className="grid grid-cols-[100px_auto] items-start gap-2">
                        <p className="text-xs text-gray-500 mt-1">
                          Due {new Date(task.deadline).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium">{task.taskName}</p>
                      </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No new tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
