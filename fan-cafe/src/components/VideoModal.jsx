import React from "react";
import { X } from "lucide-react";
const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-4xl w-full">
        <div className="w-full">
          <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-xl font-semibold">{video.snippet.title}</h2>
            <button onClick={onClose} className="hover:text-gray-300">
              <X size={24} />
            </button>
          </div>
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title={`${video.snippet.title}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-white; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
