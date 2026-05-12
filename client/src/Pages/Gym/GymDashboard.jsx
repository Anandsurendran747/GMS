import React, { useState } from 'react'
// import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';
import styled, { css, createGlobalStyle } from "styled-components";


// ─── Breakpoints ──────────────────────────────────────────────────────────────
const bp = { sm: "480px", md: "768px", lg: "1024px" };

// NOTE: Only use these helpers for static CSS rules.
// Dynamic (prop-dependent) rules must use plain @media strings directly.
const media = {
  sm: (...args) => css`@media (max-width: ${bp.sm}) { ${css(...args)} }`,
  md: (...args) => css`@media (max-width: ${bp.md}) { ${css(...args)} }`,
  lg: (...args) => css`@media (max-width: ${bp.lg}) { ${css(...args)} }`,
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = {
  navy: "#1a2744",
  navyDark: "#0d1628",
  navyMid: "#111e36",
  navyLight: "#2d4278",
  orange: "#e05a1b",
  orangeDark: "#c94d14",
  white: "#ffffff",
  bg: "#f0f2f5",
  border: "#e8eaf0",
  text: "#555555",
  green: "#27ae60",
  greenBg: "#eafaf1",
  blue: "#3b5bdb",
  blueBg: "#f0f4ff",
  cardShadow: "0 2px 12px rgba(0,0,0,0.06)",
  radius: "14px",
};




const navItems = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Members", icon: "👥" },
  { label: "Trainers", icon: "👤" },
  { label: "Plans", icon: "💵" },
  { label: "Attendance", icon: "📅" },
  { label: "Billing", icon: "🧾" },
  { label: "Settings", icon: "⚙️" },
];





// ─── Global ───────────────────────────────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Barlow', 'Segoe UI', sans-serif; background: ${theme.bg}; }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────
const AppShell = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: ${theme.bg};
  position: relative;
`;

// ─── Overlay ─────────────────────────────────────────────────────────────────
// Dynamic props ($open) must NOT be inside the media helper — use plain @media
const Overlay = styled.div`
  display: none;
  @media (max-width: ${bp.md}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? "all" : "none")};
    transition: opacity 0.3s ease;
  }
`;

// ─── Sidebar ─────────────────────────────────────────────────────────────────
// transform uses $open so it MUST be at the top level of the template literal
const Sidebar = styled.aside`
  width: 220px;
  background: linear-gradient(180deg, ${theme.navyDark} 0%, ${theme.navyMid} 100%);
  display: flex;
  flex-direction: column;
  padding: 28px 0 20px;
  flex-shrink: 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  z-index: 50;

  /* Desktop: always visible, part of normal flow */
  /* Mobile: fixed drawer, slides in/out */
  @media (max-width: ${bp.md}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(-100%)")};
  }
`;

const LogoWrapper = styled.div`
  padding: 0 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const LogoInner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIcon = styled.div`
  background: rgba(224, 90, 27, 0.15);
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 20px;
`;

const LogoText = styled.div`
  color: ${theme.white};
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 1px;
  line-height: 1.1;
`;

const LogoAccent = styled.span`
  color: ${theme.orange};
`;

const LogoSub = styled.div`
  color: rgba(255, 255, 255, 0.35);
  font-size: 10px;
  letter-spacing: 2px;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 20px 12px 0;
  overflow-y: auto;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  margin-bottom: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  ${({ $active }) =>
    $active
      ? css`
          background: linear-gradient(90deg, ${theme.orange}, ${theme.orangeDark});
          color: ${theme.white};
          font-weight: 700;
        `
      : css`
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
          &:hover {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.8);
          }
        `}
`;

const NavIcon = styled.span`
  font-size: 16px;
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
`;

const UserCard = styled.div`
  margin: 0 16px;
  background: rgba(224, 90, 27, 0.1);
  border: 1px solid rgba(224, 90, 27, 0.3);
  border-radius: 10px;
  padding: 12px 14px;
`;

const UserLabel = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  margin-bottom: 4px;
`;

const UserName = styled.div`
  color: ${theme.white};
  font-weight: 600;
  font-size: 13px;
`;

const UserRole = styled.div`
  color: ${theme.orange};
  font-size: 11px;
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
const Main = styled.main`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = styled.header`
  background: ${theme.white};
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.border};
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  gap: 12px;

  ${media.sm`padding: 0 16px;`}
`;

const HamburgerBtn = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: ${theme.navy};
  padding: 4px 6px;
  flex-shrink: 0;
  line-height: 1;

  ${media.md`display: flex; align-items: center;`}
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f5f6fa;
  border-radius: 10px;
  padding: 8px 16px;
  gap: 8px;
  flex: 1;
  max-width: 320px;

  ${media.sm`max-width: 100%;`}
`;

const SearchIcon = styled.span`
  color: #aaa;
  font-size: 16px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: ${theme.text};
  width: 100%;
  min-width: 0;
  &::placeholder { color: #bbb; }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;


const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.white};
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
`;

const ProfileMeta = styled.div`
  ${media.sm`display: none;`}
`;

const ProfileRole = styled.div`
  font-size: 12px;
  color: #999;
`;

const ProfileName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${theme.navy};
`;
const Body = styled.div`
  padding: 28px;
  flex: 1;

  ${media.md`padding: 20px;`}
  ${media.sm`padding: 16px;`}
`;

const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${theme.navy};
  letter-spacing: -0.5px;

  ${media.sm`font-size: 20px;`}
`;

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
const BottomNav = styled.nav`
  display: none;

  ${media.md`
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: ${theme.navyDark};
    border-top: 1px solid rgba(255,255,255,0.08);
    z-index: 30;
    padding-bottom: env(safe-area-inset-bottom);
  `}
`;

const BottomNavItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px 8px;
  cursor: pointer;
  gap: 3px;
  transition: all 0.2s;
  border-top: 2px solid ${({ $active }) => ($active ? theme.orange : "transparent")};
  background: ${({ $active }) => ($active ? "rgba(224,90,27,0.08)" : "transparent")};
`;

const BottomNavIcon = styled.span`font-size: 18px;`;

const BottomNavLabel = styled.span`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: ${({ $active }) => ($active ? theme.orange : "rgba(255,255,255,0.4)")};
`;


// ─── Component ────────────────────────────────────────────────────────────────
const bottomNavItems = navItems.slice(0, 5);

export default function IronFitnessDashboard({ children }) {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (label) => {
    setActiveNav(label);
    setSidebarOpen(false);
    console.log(`Navigate to ${label}`);
    if (label === "Members") {
      navigate('/gym/dashboard/manage-members');
    } else if (label === "Trainers") {
      navigate('/gym/dashboard/manage-trainers');
    } else if (label === "Plans") {
      navigate('/gym/dashboard/manage-plans');
    }
    else if (label === "Dashboard") {
      navigate('/gym/dashboard');
    }



  };

  const navigate = useNavigate();
  


  return (
    <>
      <GlobalStyle />
      <AppShell>

        {/* Mobile backdrop */}
        <Overlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

        {/* ── Sidebar ── */}
        <Sidebar $open={sidebarOpen}>
          <LogoWrapper>
            <LogoInner>
              <LogoIcon>🏋️</LogoIcon>
              <div>
                <LogoText><LogoAccent>IRON</LogoAccent> FITNESS</LogoText>
                <LogoSub>MANAGEMENT</LogoSub>
              </div>
            </LogoInner>
          </LogoWrapper>

          <Nav>
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                $active={activeNav === item.label}
                onClick={() => handleNav(item.label)}
              >
                <NavIcon $active={activeNav === item.label}>{item.icon}</NavIcon>
                {item.label}
              </NavItem>
            ))}
          </Nav>

          <UserCard>
            <UserLabel>LOGGED IN AS</UserLabel>
            <UserName>Sarah Miller</UserName>
            <UserRole>Manager</UserRole>
          </UserCard>
        </Sidebar>

        {/* ── Main ── */}
        <Main>
          {/* Header */}
          <Header>
            <HamburgerBtn
              aria-label="Open menu"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              ☰
            </HamburgerBtn>

            <SearchBar>
              <SearchIcon>🔍</SearchIcon>
              <SearchInput placeholder="Search members, classes..." />
            </SearchBar>

            <HeaderRight>
              {/* <NotifWrapper>
                🔔<NotifBadge>5</NotifBadge>
              </NotifWrapper> */}
              <ProfileRow>
                <Avatar>SM</Avatar>
                <ProfileMeta>
                  <ProfileRole>Manager</ProfileRole>
                  <ProfileName>Sarah Miller</ProfileName>
                </ProfileMeta>
              </ProfileRow>
            </HeaderRight>
          </Header>





          {activeNav !== "Dashboard" && activeNav !== "Members" && activeNav !== "Trainers" && activeNav !== "Plans" && (
            <Body>
              <PageTitle>{activeNav}</PageTitle>
              <p style={{ marginTop: 12, color: "#666" }}>Content for {activeNav} will go here.</p>
            </Body>
          )}

          <Outlet />


        </Main>

        {/* ── Mobile Bottom Nav ── */}
        <BottomNav>
          {bottomNavItems.map((item) => (
            <BottomNavItem
              key={item.label}
              $active={activeNav === item.label}
              onClick={() => handleNav(item.label)}
            >
              <BottomNavIcon>{item.icon}</BottomNavIcon>
              <BottomNavLabel $active={activeNav === item.label}>{item.label}</BottomNavLabel>
            </BottomNavItem>
          ))}
        </BottomNav>

      </AppShell>
    </>
  );
}