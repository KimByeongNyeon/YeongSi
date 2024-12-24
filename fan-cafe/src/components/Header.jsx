import { Bell, ChevronDown, Menu, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";

const Header = () => {
  const [isScrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const fetchUserInfo = async () => {
    try {
      // 토큰 가져오기
      const token = localStorage.getItem("token");
      console.log("Current token:", token); // 토큰이 있는지 확인

      // 요청 헤더에 토큰 포함
      const response = await axios.get("http://127.0.0.1:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User info response:", response.data); // 응답 데이터 확인
      setUserInfo(response.data);
    } catch (error) {
      console.error("가져오기 실패", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // 실제로 로그아웃 할 때만 로그아웃
  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <header className="fixed top-0 w-full z-50 ...">
      <nav className={`fixed w-full z-40 transition-all duration-500 ${isScrolled ? "bg-white shadow-md" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">YeongSi</span>
              </Link>
            </div>

            {/* 중앙 네비게이션 */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <div className="flex space-x-4">
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "black" }}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${isActive("/") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  홈
                </Link>
                <Link to="/article" className={`px-4 py-2 text-sm font-medium transition-colors ${isActive("/article") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                  게시글
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className={`px-4 py-2 text-sm font-medium transition-colors ${isActive("/profile") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                      프로필
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            {/* 우측 인증 메뉴 */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    로그인
                  </Link>
                  <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                    회원가입
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        {userInfo?.profileImageUrl ? (
                          <img src={userInfo.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{userInfo?.username ? userInfo.username.substring(0, 2).toUpperCase() : "YS"}</span>
                          </div>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                          {userInfo?.username ? userInfo.username : "YS"}
                        </Link>
                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                          설정
                        </Link>
                        <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          로그아웃
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 모바일 메뉴 버튼 */}
              <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        <hr />
      </nav>

      {/* 오프캔버스 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              {isAuthenticated && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {userInfo?.profileImageUrl ? (
                      <img src={userInfo.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{userInfo?.username ? userInfo.username.substring(0, 2).toUpperCase() : "YS"}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{userInfo?.username || "사용자"}</p>
                    <p className="text-xs text-gray-500">{userInfo?.email || ""}</p>
                  </div>
                </div>
              )}
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* 메뉴 항목들 */}
            <div className="px-2 py-4">
              <Link
                to="/"
                className={`block px-4 py-3 text-base font-medium rounded-md ${isActive("/") ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                홈
              </Link>

              {isAuthenticated ? (
                <>
                  {/* 알림 섹션 */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">알림</span>
                      <Bell className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="text-sm text-gray-500">새로운 알림이 없습니다</p>
                    </div>
                  </div>

                  <div className="border-t my-2" />

                  <Link
                    to="/dashboard"
                    className={`block px-4 py-3 text-base font-medium rounded-md ${isActive("/dashboard") ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-50"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    대시보드
                  </Link>
                  <Link
                    to="/profile"
                    className={`block px-4 py-3 text-base font-medium rounded-md ${isActive("/profile") ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-50"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    프로필
                  </Link>
                  <Link
                    to="/settings"
                    className={`block px-4 py-3 text-base font-medium rounded-md ${isActive("/settings") ? "text-blue-600 bg-blue-50" : "text-gray-900 hover:bg-gray-50"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    설정
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-gray-50 rounded-md"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    로그인
                  </Link>
                  <Link to="/signup" className="block px-4 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    회원가입
                  </Link>
                </>
              )}
            </div>

            {/* 하단 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <p className="text-sm text-gray-500 text-center">© 2024 YeongSi. All rights reserved.</p>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
