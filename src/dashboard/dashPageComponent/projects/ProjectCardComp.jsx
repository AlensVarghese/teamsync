import React from "react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../commonComponents/UserAvatar";
import Button from "../../../components/Button";

const ProjectCardComp = ({ project }) => {
  const navigate = useNavigate();

  // Calculate total tasks and members
  const totalTasks = project.tasks ? project.tasks.length : 0;
  const totalMembers = project.members ? project.members.length : 0;

  // Determine project status
  const isInProgress = project.progress < 100;
  const statusText = isInProgress ? "In-Progress" : "Completed";
  const statusColor = isInProgress ? "text-yellow-700" : "text-green-700";

  return (
    <div className="bg-white shadow p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-customWhite">
      <div className="flex flex-col gap-4">
        {/* Project Title */}
        <div className="flex gap-2 items-center">
          <h2 className="font-semibold">{project.title}</h2>
          {/* Project Status */}
          <p className={`text-sm font-semibold ${statusColor}`}>{"• "}{statusText}</p>
        </div>
        {/* Tasks and Members Count */}
        <div className="flex justify-between gap-6 text-xs">
          <p>
            Total Tasks:{" "}
            <span className="text-base font-semibold">{totalTasks}</span>
          </p>
          <p>
            Total Members:{" "}
            <span className="text-base font-semibold">{totalMembers}</span>
          </p>
        </div>
        {/* Admin Info and Manage Button */}
        <div className="flex justify-between gap-4">
          <div className="flex gap-2 items-center">
            {project.admin ? (
              <>
                <UserAvatar email={project.admin.email} size={32} />
                <p className="text-sm">
                  {project.admin.userId || project.admin.email.split("@")[0]}
                </p>
              </>
            ) : (
              <>
                <UserAvatar email={project.creatorEmail} size={32} />
                <p className="text-sm">
                  {project.creatorEmail && project.creatorEmail.split("@")[0]}
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => navigate(`/home/projects/${project._id}`)}
            className="bg-transparent border-none focus:outline-none p-0 text-customBgBlue text-sm hover:text-customHeadingColor hover:border-b-2 hover:border-customHeadingColor"
          >
            Manage & Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardComp;
