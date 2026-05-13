import React, { useState, useEffect } from 'react'
import styled, { css } from "styled-components";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import { useAuth } from '../Contexts/AuthContext';
import api from '../api';

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

// ─── Data ─────────────────────────────────────────────────────────────────────
const attendanceData = [
    { day: "Mon", current: 65, prev: 30 },
    { day: "Tue", current: 35, prev: 48 },
    { day: "Wed", current: 62, prev: 58 },
    { day: "Thu", current: 48, prev: 52 },
    { day: "Fri", current: 72, prev: 60 },
    { day: "Sat", current: 78, prev: 68 },
    { day: "Sun", current: 42, prev: 38 },
];



const PIE_COLORS = [theme.navy, theme.orange, "#f5a623"];

const classes = [
    { name: "Spinning", time: "9AM", instructor: "Sarah J.", booked: 22, total: 25 },
    { name: "CrossFit", time: "11AM", instructor: "Mike T.", booked: 18, total: 20 },
    { name: "Yoga Flow", time: "5PM", instructor: "Emma L.", booked: 24, total: 25 },
];

const checkIns = [
    { time: "06:00", name: "John Doe", status: "Active", initials: "JD" },
    { time: "08:00", name: "Lisa Ray", status: "Membership", initials: "LR" },
    { time: "23:30", name: "David Kim", status: "Membership", initials: "DK" },
];



// ─── Body ─────────────────────────────────────────────────────────────────────
const Body = styled.div`
  padding: 28px;
  flex: 1;

  ${media.md`padding: 20px;`}
  ${media.sm`padding: 16px;`}
`;
const BottomNavSpacer = styled.div`
  display: none;
  ${media.md`display: block; height: 68px;`}
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;

  ${media.lg`flex-direction: column; gap: 12px;`}
`;

const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${theme.navy};
  letter-spacing: -0.5px;

  ${media.sm`font-size: 20px;`}
`;

const PageDate = styled.div`
  color: #888;
  font-size: 13px;
  margin-top: 4px;
`;



// ─── Stat Cards ───────────────────────────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  ${media.lg`grid-template-columns: repeat(2, 1fr);`}
  ${media.sm`grid-template-columns: 1fr; gap: 12px;`}
`;

const StatCard = styled.div`
  background: ${theme.white};
  border-radius: ${theme.radius};
  padding: 20px 22px;
  box-shadow: ${theme.cardShadow};
  border-top: 3px solid ${({ $accent }) => ($accent ? theme.orange : theme.border)};
  position: relative;
  overflow: hidden;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #888;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const StatValueRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 6px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: ${theme.navy};
  line-height: 1;
`;

const StatBadge = styled.div`
  background: #eafaf1;
  color: ${theme.green};
  font-size: 11px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 6px;
  margin-bottom: 4px;
`;

const StatSub = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
`;

const StatusDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => ($color === "green" ? theme.green : theme.orange)};
`;

const TrendArrow = styled.span`color: ${theme.green};`;

const StatIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
`;

// ─── Shared Card ─────────────────────────────────────────────────────────────
const Card = styled.div`
  background: ${theme.white};
  border-radius: ${theme.radius};
  padding: 22px 24px;
  box-shadow: ${theme.cardShadow};

  ${media.sm`padding: 16px;`}
`;

const CardTitle = styled.div`
  font-weight: 800;
  font-size: 15px;
  color: ${theme.navy};
  margin-bottom: ${({ $mb }) => $mb || "18px"};
`;

const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const ActivityLink = styled.div`
  font-size: 12px;
  color: ${theme.orange};
  font-weight: 600;
  cursor: pointer;
`;

// ─── Middle Grid ─────────────────────────────────────────────────────────────
const MidGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
  margin-bottom: 20px;

  ${media.lg`grid-template-columns: 1fr;`}
`;

// ─── Classes Table ────────────────────────────────────────────────────────────
const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 400px;
`;

const Th = styled.th`
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 0.5px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const Tr = styled.tr`
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid #f8f8f8")};
`;

const Td = styled.td`
  padding: 14px 0;
  font-size: 14px;
  color: ${({ $bold }) => ($bold ? theme.navy : theme.text)};
  font-weight: ${({ $bold }) => ($bold ? 700 : 400)};
`;

const TimeBadge = styled.span`
  background: #f5f6fa;
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 600;
`;

const BookingCell = styled.td`
  min-width: 130px;
  padding: 14px 0;
`;

const BookingLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${theme.navy};
  margin-bottom: 4px;
`;

const ProgressTrack = styled.div`
  height: 5px;
  background: #f0f0f0;
  border-radius: 99px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $high }) => ($high ? theme.orange : theme.navy)};
  border-radius: 99px;
  transition: width 1s ease;
`;

// ─── Check-ins ────────────────────────────────────────────────────────────────
const CheckInGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 0 16px;
  align-items: center;
`;

const CheckInHeader = styled.div`
  font-size: 11px;
  color: #aaa;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
`;

const CheckInCell = styled.div`
  padding: 13px 0;
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid #f8f8f8")};
`;

const CheckInTime = styled(CheckInCell)`
  font-size: 13px;
  font-weight: 700;
  color: ${theme.text};
`;

const CheckInName = styled(CheckInCell)`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.navy};
`;

const MemberAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $first }) =>
        $first
            ? `linear-gradient(135deg, ${theme.navy}, ${theme.navyLight})`
            : `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`};
  color: ${theme.white};
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  white-space: nowrap;
  background: ${({ $status }) => ($status === "Active" ? theme.greenBg : theme.blueBg)};
  color: ${({ $status }) => ($status === "Active" ? theme.green : theme.blue)};
`;

// ─── Bottom Charts ────────────────────────────────────────────────────────────
const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;

  ${media.lg`grid-template-columns: 1fr;`}
`;

const LegendRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
`;

const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;

const PieSummary = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const PieStat = styled.div`text-align: center;`;

const PieValue = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: ${({ $color }) => $color};
`;

const PieName = styled.div`
  font-size: 11px;
  color: #aaa;
`;
const CheckInRow = styled.div`
  display: contents;
`;



const DashBoardMain = () => {

    const { logout, gymData } = useAuth();
    useEffect(() => {
        setStatCards(prev => {
            const updated = [...prev];
            updated[0] = { ...updated[0], value: gymData.memberCount };
            return updated;
        });
        const activePercent = gymData.activeMemberCount / gymData.memberCount * 100;
        const inactivePercent = gymData.inactiveMemberCount / gymData.memberCount * 100;
        setMembershipData([
            { name: "Active", value: activePercent },
            { name: "Inactive", value: inactivePercent }
        ]);

        api.get('/gym/monthly-revenue', {
            params: {
                gymId: JSON.parse(localStorage.getItem("user"))?.gymId
            }
        }).then((response) => {
            setStatCards(prev => {
                const updated = [...prev];
                updated[3] = { ...updated[3], value: `₹${response.data.monthlyRevenue.toFixed(2)}` };
                return updated;
            });
        }).catch(error => {
            console.error('Error fetching monthly revenue:', error);
        }
        );
    }, []);

    const [membershipData, setMembershipData] = useState([
        { name: "Active", value: 0 },
        { name: "Inactive", value: 0 }
    ]);

    const [statCards, setStatCards] = useState([
        { label: "Total Members", value: 0, accent: true, icon: "👥" },
        { label: "Today's Check-ins", value: 0, icon: "📅" },
        { label: "Active Classes", value: 0, icon: "🏋️" },
        { label: "Monthly Revenue", value: `₹0.00`, icon: "💵" },
        { label: "New Signups", value: 0, badge: "+12%", dot: "green", icon: "✨" },
    ]);
    return (
        <div>
            <Body>
                {/* Title row */}
                <TitleRow>
                    <div>
                        <PageTitle>Dashboard Overview</PageTitle>
                        <PageDate>Tuesday, May 12, 2026</PageDate>
                    </div>
                    {/* <ActionButtons>
                  <ActionBtn $primary onClick={() =>{
                    console.log("Navigate to Add New Member page");
                    navigate('/gym/dashboard/manage-members');
                  }}>+ Add New Member</ActionBtn>
                  <ActionBtn>⏱ Log Attendance</ActionBtn>
                  <ActionBtn>📅 Manage Schedule</ActionBtn>
                </ActionButtons> */}
                </TitleRow>

                {/* Stat Cards */}
                <StatsGrid>
                    {statCards.map((card, i) => (
                        <StatCard key={i} $accent={card.accent}>
                            <StatLabel>{card.label}</StatLabel>
                            <StatValueRow>
                                <StatValue>{card.value}</StatValue>
                                {card.badge && <StatBadge>{card.badge}</StatBadge>}
                            </StatValueRow>
                            <StatSub>
                                {card.dot && <StatusDot $color={card.dot} />}
                                {card.trend && <TrendArrow>↗</TrendArrow>}
                                {card.sub}
                            </StatSub>
                            <StatIcon>{card.icon}</StatIcon>
                        </StatCard>
                    ))}
                </StatsGrid>
                    
                {/* Middle row */}
                
                
                <MidGrid>
                    {/* Classes */}
                    <Card>
                        <CardTitle>Today's Classes & Bookings</CardTitle>
                        <TableWrapper>
                            <Table>
                                <thead>
                                    <tr>
                                        {["Class", "Time", "Instructor", "Booking"].map((h) => (
                                            <Th key={h}>{h}</Th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.map((cls, i) => {
                                        const pct = Math.round((cls.booked / cls.total) * 100);
                                        return (
                                            <Tr key={i} $last={i === classes.length - 1}>
                                                <Td $bold>{cls.name}</Td>
                                                <Td><TimeBadge>{cls.time}</TimeBadge></Td>
                                                <Td>{cls.instructor}</Td>
                                                <BookingCell>
                                                    <BookingLabel>{cls.booked}/{cls.total} Booked</BookingLabel>
                                                    <ProgressTrack>
                                                        <ProgressFill $pct={pct} $high={pct >= 90} />
                                                    </ProgressTrack>
                                                </BookingCell>
                                            </Tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </TableWrapper>
                    </Card>

                    {/* Check-ins */}
                    <Card>
                        <CardTitleRow>
                            <CardTitle $mb="0">Recent Member Check-ins</CardTitle>
                            <ActivityLink>Activity Feed</ActivityLink>
                        </CardTitleRow>
                        <CheckInGrid>
                            {["Time", "Member", "", "Status"].map((h, i) => (
                                <CheckInHeader key={i}>{h}</CheckInHeader>
                            ))}
                            {checkIns.map((c, i) => {
                                const isLast = i === checkIns.length - 1;
                                return (
                                    <CheckInRow key={i}>
                                        <CheckInTime key={`t${i}`} $last={isLast}>{c.time}</CheckInTime>
                                        <CheckInCell key={`av${i}`} $last={isLast}>
                                            <MemberAvatar $first={i === 0}>{c.initials}</MemberAvatar>
                                        </CheckInCell>
                                        <CheckInName key={`n${i}`} $last={isLast}>{c.name}</CheckInName>
                                        <CheckInCell key={`s${i}`} $last={isLast}>
                                            <StatusBadge $status={c.status}>{c.status}</StatusBadge>
                                        </CheckInCell>
                                    </CheckInRow>
                                );
                            })}
                        </CheckInGrid>
                    </Card>
                </MidGrid>

                {/* Charts */}
                <BottomGrid>
                    <Card>
                        <CardTitle $mb="20px">Member Attendance This Week</CardTitle>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={attendanceData} barCategoryGap="30%" barGap={4}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#aaa" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#aaa" }} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13 }}
                                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                                />
                                <Bar dataKey="current" fill={theme.navy} radius={[5, 5, 0, 0]} name="This Week" />
                                <Bar dataKey="prev" fill={theme.orange} radius={[5, 5, 0, 0]} name="Last Week" />
                            </BarChart>
                        </ResponsiveContainer>
                        <LegendRow>
                            <LegendItem><LegendDot $color={theme.navy} /> This Week</LegendItem>
                            <LegendItem><LegendDot $color={theme.orange} /> Last Week</LegendItem>
                        </LegendRow>
                    </Card>

                    <Card>
                        <CardTitle>Membership Status Breakdown</CardTitle>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={membershipData}
                                    cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={85}
                                    paddingAngle={3} dataKey="value"
                                    startAngle={90} endAngle={-270}
                                >
                                    {membershipData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(v) => `${v}%`}
                                    contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13 }}
                                />
                                <Legend
                                    iconType="circle" iconSize={8}
                                    formatter={(v) => <span style={{ fontSize: 12, color: "#555" }}>{v}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <PieSummary>
                            {membershipData.map((d, i) => (
                                <PieStat key={i}>
                                    <PieValue $color={PIE_COLORS[i]}>{d.value}%</PieValue>
                                    <PieName>{d.name}</PieName>
                                </PieStat>
                            ))}
                        </PieSummary>
                    </Card>
                </BottomGrid>

                <BottomNavSpacer />
            </Body>
        </div>
    )
}

export default DashBoardMain
