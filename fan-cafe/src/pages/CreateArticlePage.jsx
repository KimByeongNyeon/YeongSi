import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateArticlePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    guestName: "",
    guestPassword: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            title: formData.title,
            content: formData.content,
            ...(!isAuthenticated && {
              guestName: formData.guestName,
              guestPassword: formData.guestPassword,
            }),
          }),
        ],
        { type: "application/json" }
      )
    );

    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(isAuthenticated && { Authorization: `Bearer ${token}` }),
        },
      };

      const endPoint = isAuthenticated ? "http://localhost:8080/api/articles" : "http://localhost:8080/api/articles/guest";

      await axios.post(endPoint, formDataToSend, config);
      navigate("/article");
    } catch (error) {
      setError(error.response?.data?.message || "게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">게시글 작성</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 비회원일 경우 */}
        {!isAuthenticated && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">이름</label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                type="text"
                name="guestPassword"
                value={formData.guestPassword}
                onChange={(e) => setFormData({ ...formData, guestPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus: border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">내용</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이미지 첨부</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })} className="mt-1 block w-full" />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate("/article")} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            취소
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg blue-600 disabled:bg-blue-300">
            {loading ? "저장 중 ..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePage;
