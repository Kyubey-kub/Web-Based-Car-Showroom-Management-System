// src/components/Common/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>(location.pathname);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? 'hidden' : 'auto';
      return newState;
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMenuOpen) toggleMenu();
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const handleLinkClick = (href: string, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveLink(href);
    if (href !== location.pathname) {
      setTimeout(() => navigate(href), 0);
      if (isMenuOpen) toggleMenu();
      if (isDropdownOpen) setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navbarStyle: React.CSSProperties = {
    backdropFilter: 'blur(12px)',
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    ...(isScrolled && { padding: '0.8rem 0', background: 'rgba(10, 10, 10, 0.95)' }),
  };

  const logoStyle: React.CSSProperties = {
    background: 'linear-gradient(45deg, #ff3366, #ff6b6b, #4834d4, #686de0)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'gradient 8s linear infinite',
    backgroundSize: '300%',
    letterSpacing: '-0.5px',
  };

  const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    color: 'white',
    background: isActive ? 'linear-gradient(45deg, #ff3366, #ff6b6b, #4834d4, #686de0)' : 'none',
    backgroundSize: '300%',
    animation: isActive ? 'gradient 8s linear infinite' : 'none',
    borderRadius: '8px',
    textShadow: isActive ? '0 0 8px rgba(255, 51, 102, 0.5)' : 'none',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
    letterSpacing: '0.2px',
    position: 'relative' as const,
    whiteSpace: 'nowrap' as const,
    lineHeight: '1.5',
    display: 'inline-flex',
    alignItems: 'center',
  });

  const allLinks = [
    { path: '/client/home', label: 'Home' },
    { path: '/client/home/our-cars', label: 'Our Cars' },
    { path: '/client/home/filter-cars', label: 'Cars Filter' },
    { path: '/client/home/car-list', label: 'Car List' },
    { path: '/client/home/reviews', label: 'Reviews' },
    { path: '/client/home/contact-us', label: 'Contact Us' },
    { path: '/client/home/my-bookings', label: 'My Bookings' },
  ];

  const mainLinks = allLinks.slice(0, 4);
  const dropdownLinks = allLinks.slice(4);

  return (
    <>
      <nav className="navbar fixed top-0 left-0 w-full py-3 z-[1010]" style={navbarStyle}>
        <div className="navbar-container max-w-[1400px] mx-auto flex justify-between items-center relative px-5">
          <div className="flex items-center gap-4">
            <div className="logo text-2xl font-bold" style={logoStyle}>
              Super Car Showroom
            </div>
            {user ? (
              <button
                onClick={handleLogout}
                style={navLinkStyle(activeLink === '/logout')}
                className="logout-button"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                style={navLinkStyle(activeLink === '/login')}
                className="text-white hover:text-gray-300 transition-transform duration-300 hover:scale-105"
                onClick={(e) => handleLinkClick('/login', e as any)}
              >
                Login
              </a>
            )}
          </div>

          {/* Desktop Menu - ไม่มี scroll */}
          <div className="nav-wrapper hidden md:flex items-center">
            <ul className="nav-links flex gap-4 list-none">
              {mainLinks.map((link, index) => (
                <li key={index} onClick={(e) => handleLinkClick(link.path, e)}>
                  <span
                    className="pointer-events-none cursor-pointer"
                    style={navLinkStyle(activeLink === link.path)}
                  >
                    {link.label}
                  </span>
                </li>
              ))}
              <li className="relative">
                <div ref={dropdownRef}>
                  <button
                    style={navLinkStyle(isDropdownOpen)}
                    className="text-white hover:text-gray-300 transition-transform duration-300 hover:scale-105"
                    onClick={toggleDropdown}
                  >
                    More
                  </button>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu absolute flex-col bg-[rgba(10,10,10,0.95)] shadow-lg rounded-lg mt-2 p-2 w-48 right-0 z-[1003]">
                      {dropdownLinks.map((link, index) => (
                        <li key={index} onClick={(e) => handleLinkClick(link.path, e)}>
                          <span
                            className="pointer-events-none block px-4 py-2 cursor-pointer"
                            style={navLinkStyle(activeLink === link.path)}
                          >
                            {link.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-nav-toggle md:hidden bg-transparent border-none cursor-pointer w-10 h-10 relative z-[1021] rounded-full transition-colors hover:bg-[rgba(255,255,255,0.1)]"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className="bar absolute left-1/2 transform -translate-x-1/2 w-5 h-[2px] bg-white transition-all duration-300"
              style={{ top: '14px', ...(isMenuOpen && { transform: 'translate(-50%, 5px) rotate(45deg)', width: '24px' }) }}
            />
            <span
              className="bar absolute left-1/2 transform -translate-x-1/2 w-5 h-[2px] bg-white transition-opacity duration-300"
              style={{ top: '19px', ...(isMenuOpen && { opacity: 0 }) }}
            />
            <span
              className="bar absolute left-1/2 transform -translate-x-1/2 w-5 h-[2px] bg-white transition-all duration-300"
              style={{ top: '24px', ...(isMenuOpen && { transform: 'translate(-50%, -5px) rotate(-45deg)', width: '24px' }) }}
            />
          </button>
        </div>

        {/* Mobile Menu Overlay and Sidebar */}
        <div
          className={`overlay fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] transition-all duration-300 z-[1000] backdrop-blur-sm md:hidden ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
          onClick={toggleMenu}
        />

        {/* Mobile Sidebar Menu */}
        <ul
          className={`nav-links-mobile fixed top-0 right-0 h-screen w-[85%] max-w-[400px] flex-col justify-start items-start gap-6 pt-24 px-8 transition-all duration-300 ease-in-out z-[1020] bg-gradient-to-b from-[rgba(10,10,10,0.98)] via-[rgba(20,20,30,0.98)] to-[rgba(30,20,40,0.98)] backdrop-blur-xl shadow-[-5px_0_30px_rgba(0,0,0,0.5)] border-l border-l-[rgba(255,255,255,0.1)] md:hidden ${
            isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          {allLinks.map((link, index) => (
            <li key={index} onClick={(e) => handleLinkClick(link.path, e)} className="w-full">
              <span
                className="pointer-events-none block w-full text-left cursor-pointer"
                style={navLinkStyle(activeLink === link.path)}
              >
                {link.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Spacer */}
      <div className="navbar-spacer h-[80px]" />

      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          html {
            scroll-behavior: smooth;
          }

          /* ลบ scrollbar ทั้งหมดออกจาก desktop */
          .nav-links::-webkit-scrollbar {
            display: none;
          }

          .nav-links {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;