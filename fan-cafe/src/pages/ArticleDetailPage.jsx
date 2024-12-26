import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";

const ArticleDetailPage = () => {
  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  // Redux에서 현재 로그인한 사용자 정보 가져오기
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticle(res.data);
      console.log(res.data);
      setLoading(false);
      setError("");
    } catch (e) {
      setError("게시글을 불러오는 데 실패했습니다.");
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? article.imageUrls.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === article.imageUrls.length - 1 ? 0 : prev + 1));
  };

  const handleDelete = async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate("/articles");
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  console.log(user);
  const isAuthor = user?.email === article.authorEmail;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white">
      {/* 작성자 정보 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img src={article.authorProfile || "/api/placeholder/40/40"} alt="프로필" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-semibold">{article.authorName || "사용자"}</div>
          </div>
        </div>
        {/* 작성자일 경우에만 수정/삭제 메뉴 표시 */}
        {isAuthor && (
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-6 h-6 text-gray-500" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg hidden group-hover:block z-10">
              <button onClick={() => navigate(`/articles/${id}/edit`)} className="w-full px-4 py-2 text-left hover:bg-gray-100">
                수정
              </button>
              <button onClick={handleDelete} className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100">
                삭제
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 이미지 캐러셀 - imageUrls가 있고 비어있지 않을 때만 표시 */}
      {article.imageUrls && article.imageUrls.length > 0 && (
        <div className="relative pb-[100%] bg-gray-100 mb-4 rounded-md overflow-hidden">
          <img src={article.imageUrls[currentImageIndex]} alt={`게시글 이미지 ${currentImageIndex + 1}`} className="absolute w-full h-full object-cover" />
          {article.imageUrls.length > 1 && (
            <>
              <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70">
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {article.imageUrls.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button className="hover:text-red-500">
            <Heart className="w-6 h-6" />
          </button>
          <button className="hover:text-blue-500">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="hover:text-green-500">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <button className="hover:text-yellow-500">
          <Bookmark className="w-6 h-6" />
        </button>
      </div>

      {/* 좋아요 수 */}
      <div className="font-semibold mb-2">좋아요 {article.likes || 0}개</div>

      {/* 게시글 내용 */}
      <div className="mb-4">
        <span className="font-semibold mr-2">{article.authorName || "사용자"}</span>
        <span>{article.content}</span>
      </div>

      {/* 해시태그 */}
      {article.hashtags && article.hashtags.length > 0 && (
        <div className="text-blue-500 mb-4">
          {article.hashtags.map((tag, index) => (
            <span key={index} className="mr-2">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 게시 시간 */}
      <div className="text-sm text-gray-500 mb-4">{article.createdAt && new Date(article.createdAt).toLocaleDateString()}</div>

      {/* 댓글 입력창 */}
      <div className="flex items-center border-t pt-4">
        <input type="text" placeholder="댓글 달기..." className="flex-1 outline-none" />
        <button className="text-blue-500 font-semibold ml-2">게시</button>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
