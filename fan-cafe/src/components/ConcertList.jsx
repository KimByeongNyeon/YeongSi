import React, { useEffect, useMemo, useState } from "react";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import { youtubeApi } from "../api/axios";

const ConcertList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const API_URL = "https://www.googleapis.com/youtube/v3";
  const API_KEY = "AIzaSyANvthbCIvkd64ZPzRJZl4rRDlAgSWRFxM";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 검색 으로 동영상 데이터 뽑기
        const response = await youtubeApi.get(`${API_URL}/search`, {
          params: {
            part: "snippet",
            maxResults: 25,
            q: "임영웅 콘서트",
            type: "video",
            key: API_KEY,
          },
        });
        console.log(response);

        const videoIds = response.data.items.map((item) => item.id.videoId);

        const detailResponse = await youtubeApi.get(`${API_URL}/videos`, {
          params: {
            part: "statistics,snippet",
            id: videoIds.join(","),
            key: API_KEY,
          },
        });

        setVideos(detailResponse.data.items);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.error?.message || "데이터를 불러오는 데 실패했습니다. 다시 하던가 말던가 ㅋㅋ");
      } finally {
        setLoading(false);
      }
    };
    // const mockData = [
    //   {
    //     id: "1",
    //     title: "임영웅 콘서트 하이라이트",
    //     viewCount: "1500000",
    //     thumbnail: "/api/placeholder/320/180",
    //   },
    //   {
    //     id: "2",
    //     title: "임영웅 2024 전국투어",
    //     viewCount: "1200000",
    //     thumbnail: "/api/placeholder/320/180",
    //   },
    //   {
    //     id: "3",
    //     title: "임영웅 콘서트 스페셜",
    //     viewCount: "1000000",
    //     thumbnail: "/api/placeholder/320/180",
    //   },
    // ];
    fetchData();
  }, []);

  const rankedVideos = useMemo(() => {
    return videos
      .map((video) => ({
        ...video,
        viewCount: parseInt(video.statistics?.viewCount || 0),
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .map((video, index) => ({
        ...video,
        rank: index,
      }))
      .slice(0, 3);
  }, [videos]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = "unset";
  };
  if (loading) {
    return <div className="text-center p-4">로딩 중 ...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>에러가 발생했습니다</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">인기 콘서트 영상</h2>
      <div className="space-y-4">
        {rankedVideos.map((video) => (
          <VideoCard key={video.id} video={video} rank={video.rank} onVideoClick={handleVideoClick} />
        ))}
      </div>
      <VideoModal video={selectedVideo} onClose={handleCloseModal} />
    </div>
  );
};

export default ConcertList;
