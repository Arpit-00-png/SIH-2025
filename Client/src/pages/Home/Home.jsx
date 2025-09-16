// Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, TrendingUp, Users, Award, UserCircle, Edit3 } from "lucide-react";
import PieChart from "../../components/charts/PieChart";
import { useUser } from "../../contexts/UserContext";
import { getTopSkillsForStream, scoreCoursesForUser } from "../../services/geminiService";
import "./Home.css";

const streamToCourses = {
  "Science (PCM)": [
    "B.Tech / BE (Engineering)",
    "B.Sc. (Physics/Maths/Data Science)",
    "B.Arch. (Architecture)",
    "BCA (Computer Applications)",
    "Merchant Navy / Defence (NDA, Navy Tech)",
  ],
  "Science (PCB)": [
    "MBBS (Medicine)",
    "BDS (Dentistry)",
    "B.Sc. Nursing / BPT (Physiotherapy)",
    "B.Pharm (Pharmacy)",
    "Allied Medical Sciences (MLT, Radiology, Biotech)",
  ],
  Commerce: [
    "B.Com (General/Hons.)",
    "BBA / BBM (Management)",
    "CA (Chartered Accountancy)",
    "CS (Company Secretary)",
    "Economics (B.A./B.Sc.)",
  ],
  "Arts / Humanities": [
    "B.A. (History, Pol. Science, Sociology, etc.)",
    "B.A. English / Languages",
    "BFA / Performing Arts",
    "BJMC (Journalism & Mass Communication)",
    "Law (BA LLB, 5 years)",
  ],
};

const streamToSkills = {
  "Science (PCM)": ["Problem Solving", "Mathematics", "Analytical Thinking", "Programming Basics", "Physics Fundamentals"],
  "Science (PCB)": ["Biology Concepts", "Critical Thinking", "Empathy & Care", "Lab Skills", "Chemistry Basics"],
  Commerce: ["Accounting Basics", "Business Communication", "Quantitative Aptitude", "Economics", "Excel/Spreadsheets"],
  "Arts / Humanities": ["Writing & Communication", "Research", "Creativity", "Public Speaking", "Critical Analysis"],
};

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Home = () => {
  const { user, aiSkills, setAiSkills, aiCourses, setAiCourses } = useUser();
  const navigate = useNavigate();

  const userStream = user?.stream || null;
  const [loadingAI, setLoadingAI] = useState(false);

  const stats = [
    { icon: BookOpen, label: "Courses Available", value: "50+" },
    { icon: Users, label: "Students Helped", value: "1000+" },
    { icon: TrendingUp, label: "Success Rate", value: "95%" },
    { icon: Award, label: "Colleges Listed", value: "200+" },
  ];

  // 🔹 Load cached data OR fetch AI only once
  useEffect(() => {
    if (!userStream) return;

    const cacheKeySkills = `ai_skills_${userStream}`;
    const cacheKeyCourses = `ai_course_scores_${userStream}`;

    const cachedSkills = localStorage.getItem(cacheKeySkills);
    const cachedCourses = localStorage.getItem(cacheKeyCourses);

    // If cache exists → load and skip API
    if (cachedSkills || cachedCourses) {
      if (cachedSkills) setAiSkills(JSON.parse(cachedSkills));
      if (cachedCourses) setAiCourses(JSON.parse(cachedCourses));
      return;
    }

    // Else → fetch AI data once
    const fetchAIData = async () => {
      setLoadingAI(true);
      try {
        const [skills, scored] = await Promise.all([
          getTopSkillsForStream(user || {}, userStream),
          scoreCoursesForUser(user || {}, userStream, streamToCourses[userStream] || []),
        ]);

        if (Array.isArray(skills) && skills.length) {
          setAiSkills(skills);
          localStorage.setItem(cacheKeySkills, JSON.stringify(skills));
        }

        if (Array.isArray(scored) && scored.length) {
          setAiCourses(scored);
          localStorage.setItem(cacheKeyCourses, JSON.stringify(scored));
        }
      } catch (e) {
        console.error("AI fetch failed", e);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAIData();
  }, [userStream, user, setAiSkills, setAiCourses]);

  // Base + AI Data
  const baseCourses = useMemo(() => (userStream ? streamToCourses[userStream] || [] : []), [userStream]);
  const topSkills = aiSkills || (userStream ? streamToSkills[userStream] : []);
  const scoredCourses = useMemo(() => {
    if (aiCourses && aiCourses.length) return aiCourses;
    return baseCourses.map((c, i) => ({
      course: c,
      score: 60 - i * 8 >= 20 ? 60 - i * 8 : 35,
      reason: "Relevant to your selected stream.",
    }));
  }, [aiCourses, baseCourses]);

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to CareerGuide</h1>
        <p>Discover your perfect career path with AI-powered guidance</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/quiz" className="btn btn-primary">
            Take Career Quiz
          </Link>
          <button className="btn btn-secondary" onClick={() => navigate("/chatbot")}>
            Ask the AI Counselor
          </button>
        </div>
      </div>

      {/* Stream + Profile Card */}
      <div className="card" style={{ margin: "1.5rem 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <UserCircle size={36} />
            <div>
              <h3 style={{ marginBottom: 4 }}>{user?.name ? `Hi, ${user.name}!` : "Welcome, Student!"}</h3>
              <p style={{ color: "#718096" }}>
                {userStream ? `Your stream: ${userStream}` : "Take a quiz to personalize recommendations"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-secondary" onClick={() => navigate("/quiz")}>
              <Edit3 size={18} /> Update Stream via Quiz
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/login")}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {userStream ? (
        <>
          <div className="stats-section">
            <h2 style={{ marginBottom: "1rem" }}>Top Skills for {userStream}</h2>
            <div className="stats-grid">
              {topSkills.map((skill, idx) => (
                <div key={idx} className="stat-card">
                  <div
                    className="stat-icon"
                    style={{ color: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#2b6cb0"][idx % 5] }}
                  >
                    •
                  </div>
                  <div className="stat-content">
                    <h3>{skill}</h3>
                    <p>Recommended focus</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="courses-section">
            <h2>Recommended for {userStream}</h2>
            {loadingAI && <p>Generating insights...</p>}

            <div className="courses-grid" style={{ marginTop: "1rem" }}>
              {scoredCourses.map(({ course, score, reason }, idx) => {
                const slug = slugify(course);
                const color = ["#667eea", "#764ba2", "#f093fb", "#f5576c"][idx % 4];
                return (
                  <Link key={slug} to={`/course/${slug}`} className="course-card" title={reason}>
                    <div className="course-header">
                      <h3>{course}</h3>
                      <span className="course-students">Relevance {Math.max(0, Math.min(100, Math.round(score)))}%</span>
                    </div>
                    <div className="course-chart" style={{ marginBottom: "0.5rem" }}>
                      <PieChart
                        data={[
                          {
                            name: course,
                            value: Math.max(0, Math.min(100, Number(score) || 0)),
                            color,
                          },
                        ]}
                      />
                    </div>
                    <div style={{ color: "#718096", fontSize: 14 }}>{reason}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        // Default Stats if no stream
        <div className="stats-section">
          <div className="stats-grid">
            {stats.map(({ icon: Icon, label, value }, index) => (
              <div key={index} className="stat-card">
                <Icon size={32} className="stat-icon" />
                <div className="stat-content">
                  <h3>{value}</h3>
                  <p>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
