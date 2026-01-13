import React, { useContext, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  RiDashboardHorizontalFill,
  RiProjectorFill,
  RiTaskFill,
} from "react-icons/ri";
import { FaInfoCircle, FaUserShield, FaRegBell } from "react-icons/fa";
import UserAvatar from "../dashboard/dashPageComponent/commonComponents/UserAvatar";
import { UserContext } from "../utils/UserContext";
import { useProjects } from "../utils/ProjectsContext";
import LogoutComp from "../dashboard/dashPageComponent/logout/LogoutComp";

// Helper function to get the username from email
const getUsernameFromEmail = (email) => (email ? email.split("@")[0] : "");

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { projects } = useProjects();
  const isAboutPage = location.pathname.includes("about");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Opens/closes logout modal
  const handleAvatarClick = () => setLogoutModalOpen(true);
  const handleCloseModal = () => setLogoutModalOpen(false);

  // Define navigation links (top and bottom) as before
  const topNavLinks = [
    {
      navTitle: "Dashboard",
      navIcon: <RiDashboardHorizontalFill className="text-lg" />,
      path: "dashboard",
    },
    {
      navTitle: "Projects",
      navIcon: <RiProjectorFill className="text-lg" />,
      path: "projects",
    },
    {
      navTitle: "Tasks",
      navIcon: <RiTaskFill className="text-lg" />,
      path: "tasks",
    },
    {
      navTitle: "About",
      navIcon: <FaInfoCircle className="text-lg" />,
      path: "about",
    },
  ];
  const bottomNavLinks = [
    {
      navTitle: "Admin",
      navIcon: <FaUserShield className="text-lg" />,
      path: "admin",
    },
  ];

  // --- Notification Logic ---
  // Retrieve the last time notifications were viewed; default to 0 if none exists.
  const lastViewedStr = localStorage.getItem("lastNotificationViewTime");
  const lastViewed = lastViewedStr ? new Date(lastViewedStr) : new Date(0);
  const currentUserEmail = user?.email;

  // Filter projects/tasks with createdAt after the last viewed time
  const newProjectNotifications = projects.filter(
    (project) =>
      new Date(project.createdAt) > lastViewed &&
      project.members.some((member) => member.email === currentUserEmail)
  );
  const newTaskNotifications = projects.flatMap(
    (project) =>
      project.tasks?.filter(
        (task) =>
          new Date(task.createdAt) > lastViewed &&
          task.assignees?.some(
            (assignee) => assignee.email === currentUserEmail
          )
      ) || []
  );
  const notificationCount =
    newProjectNotifications.length + newTaskNotifications.length;
  // Show badge only if not on Dashboard
  const showBadge = location.pathname !== "/home/dashboard";

  // When the bell icon is clicked, update the last viewed time and navigate to Dashboard.
  const handleBellClick = () => {
    localStorage.setItem("lastNotificationViewTime", new Date().toISOString());
    navigate("/home/dashboard");
  };
  // --- End Notification Logic ---

  // Reload the page when the "Tasks" link is clicked
  const handleTasksClick = () => {
    navigate("/home/tasks");
    window.location.reload();
  };

  return (
    <div className="w-screen">
      <div className="flex w-full relative">
        {/* Sidebar Navigation */}
        <div className="relative">
          <div className="fixed left-nav w-[15%] h-full bg-customBgBlueOpacity text-customBlack px-5 py-10 flex flex-col">
            <h2 className="text-customBlack text-2xl font-bold mb-10 px-5">
              TeamSync
            </h2>
            <nav className="flex flex-col flex-grow justify-between">
              {/* Top Navigation Links */}
              <ul className="space-y-5">
                {topNavLinks.map((link, index) => (
                  <li key={index}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-6 py-2 rounded-3xl transition-colors duration-300 ${
                          isActive
                            ? "bg-activeBg text-customWhite hover:text-customWhite"
                            : "text-customBlack hover:text-customWhite"
                        }`
                      }
                      onClick={link.navTitle === "Tasks" ? handleTasksClick : undefined}
                    >
                      {link.navIcon}
                      <span className="text-base">{link.navTitle}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
              {/* Bottom Navigation Link */}
              <ul className="space-y-5 mb-5">
                {bottomNavLinks.map((link, index) => {
                  if (
                    link.navTitle === "Admin" &&
                    user?.email !== "teamsyncadmin@gmail.com"
                  ) {
                    // Render as a disabled red danger button with a tooltip.
                    return (
                      <li key={index}>
                        <div
                          title="Only for admin"
                          className="flex items-center space-x-2 px-8 py-2 rounded-3xl bg-red-500 text-white cursor-not-allowed"
                        >
                          {link.navIcon}
                          <span className="text-lg">{link.navTitle}</span>
                        </div>
                      </li>
                    );
                  } else {
                    // Otherwise, render the normal NavLink.
                    return (
                      <li key={index}>
                        <NavLink
                          to={link.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-8 py-2 rounded-3xl transition-colors duration-300 ${
                              isActive
                                ? "bg-activeBg text-customWhite hover:text-customWhite"
                                : "text-customBlack hover:text-customWhite"
                            }`
                          }
                        >
                          {link.navIcon}
                          <span className="text-lg">{link.navTitle}</span>
                        </NavLink>
                      </li>
                    );
                  }
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-[15%] right-part w-[85%] bg-customBgWhite text-customBlack">
          {/* Header */}
          <div className="sticky top-0 bg-customBgWhite z-10 p-8">
            <div className="flex items-center justify-between">
              {isAboutPage ? (
                <span className="bg-customBgLightBlue py-2 px-8 rounded-3xl">
                  Welcome, {getUsernameFromEmail(user?.email)}!
                </span>
              ) : (
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full max-w-2xl bg-transparent px-4 py-2 outline-none border border-gray-300 rounded-3xl"
                />
              )}
              <div className="flex space-x-4 justify-center items-center">
                {/* Bell Icon with Notification Badge */}
                <div className="relative -mr-4">
                  <FaRegBell
                    onClick={handleBellClick}
                    className="text-xl text-gray-500 cursor-pointer"
                  />
                  {showBadge && notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  className="flex items-center space-x-2 focus:outline-none bg-transparent border-none pr-2"
                >
                  <UserAvatar email={user?.email} size={40} />
                  <p>
                    {getUsernameFromEmail(user?.email) || "example@gmail.com"}
                  </p>
                </button>
              </div>
            </div>
          </div>
          {/* Content Area */}
          <div
            className="overflow-y-auto px-10 py-4"
            style={{ height: "calc(100vh - 80px)" }}
          >
            <Outlet />
          </div>
        </div>
      </div>
      <LogoutComp open={logoutModalOpen} handleClose={handleCloseModal} />
    </div>
  );
};

export default Home;
