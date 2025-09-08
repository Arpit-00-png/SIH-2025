import React, { useState, useMemo } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import './Colleges.css'

const colleges = [
  {
    name: "University of Jammu",
    location: "Jammu, J&K",
    courses: ["B.A", "B.Sc", "B.Com", "MBA", "MCA"],
  },
  {
    name: "University of Kashmir",
    location: "Srinagar, J&K",
    courses: ["B.A", "B.Sc", "B.Com", "LLB", "Engineering"],
  },
  {
    name: "National Institute of Technology Srinagar",
    location: "Srinagar, J&K",
    courses: ["B.Tech", "M.Tech", "PhD"],
  },
  {
    name: "Sher-e-Kashmir University of Agricultural Sciences and Technology",
    location: "Jammu, J&K",
    courses: ["B.Sc Agriculture", "M.Sc Agriculture", "Veterinary Sciences"],
  },
  {
    name: "Government Medical College Jammu",
    location: "Jammu, J&K",
    courses: ["MBBS", "MD", "MS"],
  },
  {
    name: "Government Medical College Srinagar",
    location: "Srinagar, J&K",
    courses: ["MBBS", "MD", "MS"],
  },
  {
    name: "Cluster University of Jammu",
    location: "Jammu, J&K",
    courses: ["B.A", "B.Sc", "B.Com", "BBA", "BCA"],
  },
  {
    name: "Cluster University of Srinagar",
    location: "Srinagar, J&K",
    courses: ["B.A", "B.Sc", "B.Com", "BBA", "BCA"],
  },
  {
    name: "Islamic University of Science & Technology",
    location: "Awantipora, J&K",
    courses: ["Engineering", "Management", "Humanities"],
  },
  {
    name: "Central University of Jammu",
    location: "Jammu, J&K",
    courses: ["B.Sc", "M.Sc", "PhD", "MBA"],
  },
];

export default function CollegeList() {
  const [filters, setFilters] = useState({
    location: "",
    course: "",
    search: "",
  });

  // ✅ Unique states
  const uniqueLocations = useMemo(() => {
    return [...new Set(
      colleges.map(college => {
        const parts = college.location.split(",");
        return parts[parts.length - 1].trim();
      })
    )];
  }, []);

  // ✅ Unique courses
  const uniqueCourses = useMemo(() => {
    return [...new Set(colleges.flatMap(college =>
      college.courses.map(course => course.toLowerCase())
    ))];
  }, []);

  // ✅ Filtering logic
  const filteredColleges = colleges.filter(college => {
    const state = college.location.split(",").pop().trim().toLowerCase();
    const matchesLocation = !filters.location || state.includes(filters.location);

    const matchesCourse = !filters.course || college.courses.some(course =>
      course.toLowerCase().includes(filters.course)
    );

    const matchesSearch = !filters.search || college.name.toLowerCase().includes(filters.search.toLowerCase());

    return matchesLocation && matchesCourse && matchesSearch;
  });

  return (
    <div className="colleges-container">
      <div className="colleges-header">
        <h1>Colleges in Jammu & Kashmir</h1>
        <p>Browse through popular institutions and their courses</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search colleges..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <MapPin size={18} />
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc, idx) => (
                <option key={idx} value={loc.toLowerCase()}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Filter size={18} />
            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((course, idx) => (
                <option key={idx} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* College cards */}
      <div className="colleges-grid">
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college, idx) => (
            <div key={idx} className="college-card">
              <div className="college-image">
                <div className="placeholder-image" />
              </div>
              <div className="college-content">
                <h3>{college.name}</h3>
                <div className="college-location">
                  <MapPin size={16} />
                  <span>{college.location}</span>
                </div>
                <div className="college-courses">
                  {college.courses.map((course, i) => (
                    <span key={i} className="course-tag">{course}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No colleges match your filters.</p>
        )}
      </div>
    </div>
  );
}
