import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    fetchArticles();
  }, []);

  const hanldeCreateClick = () => {
    navigate("/articles/create");
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/articles");
      console.log("Success :", response.data);
      setArticles(response.data);
      console.log(isAuthenticated);
      setLoading(false);
    } catch (error) {
      setError("게시글을 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 글쓰기 버튼 */}
      <div className="mb-6 flex justify-end">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors" onClick={hanldeCreateClick}>
          {isAuthenticated ? "글쓰기" : "비회원 글쓰기"}
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 게시글 헤더 */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={article.authorProfile || "/default-profile.png"} alt="Profile" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{article.authorName || article.guestName}</p>
                    <p className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {/* 더보기 메뉴 (수정/삭제) */}
                <button className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>

            {/* 게시글 내용 */}
            <div className="p-4">
              <Link to={`/articles/${article.id}`}>
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              </Link>
              <p className="text-gray-700">{article.content}</p>
            </div>

            {/* 이미지가 있는 경우 */}
            {article.imageUrls?.length > 0 && (
              <div className="border-t">
                <div className="grid grid-cols-1 gap-1">
                  {article.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Article image ${index + 1}`} className="w-full h-auto" />
                  ))}
                </div>
              </div>
            )}

            {/* 게시글 하단 (좋아요, 댓글) */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                  <i className="far fa-heart"></i>
                  <span>{article.likeCount || 0}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                  <i className="far fa-comment"></i>
                  <span>{article.commentCount || 0}</span>
                </button>
                <div className="flex-grow text-right text-gray-500">
                  <i className="far fa-eye"></i>
                  <span className="ml-1">{article.viewCount || 0}</span>
                </div>
              </div>
            </div>

            {/* 댓글 영역 (토글 가능) */}
            {/* 추후 구현 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
