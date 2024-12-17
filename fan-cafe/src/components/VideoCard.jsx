import { Trophy } from "lucide-react";
import React from "react";

const VideoCard = ({ video, rank, onVideoClick }) => {
  const getBadgeColor = (rank) => {
    switch (rank) {
      case 0:
        return "bg-yellow-400";
      case 1:
        return "bg-gray-400";
      case 2:
        return "bg-amber-600";
      default:
        return "bg-gray-200";
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-start space-x4">
        <img src={video.snippet.thumbnails.default.url} alt={video.snippet.thumbnails.default.url} className="w-40 h-24 object-cover rounded mr-3" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`${getBadgeColor(rank)} text-white px-2 py-1 rounded-full flex items-center text-sm font-medium`}>
              <Trophy className="w-4 h-4 mr-1" />
              {rank + 1}위
            </span>
            <h3 className="font-semibold hover:text-blue-600 cursor-pointer" onClick={() => onVideoClick(video)}>
              {video.snippet.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">조회수 : {parseInt(video.viewCount).toLocaleString()}회</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
