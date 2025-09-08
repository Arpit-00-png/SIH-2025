import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Users, Award, BookOpen } from 'lucide-react'
import './CourseDetails.css'

const slugify = (text) => (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const courseCatalog = {
  'b-tech-be-engineering': {
    name: 'B.Tech / BE (Engineering)',
    duration: '4 years',
    rating: 4.6,
    students: 2500,
    description: 'Undergraduate engineering program with multiple specializations like CSE, Mechanical, Civil, etc.',
    modules: ['Mathematics', 'Physics', 'Programming Basics', 'Mechanics / Circuits', 'Specialization Electives'],
    careerPaths: ['Software Engineer', 'Mechanical Engineer', 'Civil Engineer', 'Data Engineer']
  },
  'b-sc-physics-maths-data-science': {
    name: 'B.Sc. (Physics/Maths/Data Science)',
    duration: '3 years',
    rating: 4.4,
    students: 1200,
    description: 'Science-focused program covering core theoretical foundations and applied data disciplines.',
    modules: ['Calculus & Linear Algebra', 'Classical/Quantum Physics', 'Statistics', 'Intro to Data Science'],
    careerPaths: ['Data Analyst', 'Research Assistant', 'Actuarial Analyst']
  },
  'b-arch-architecture': {
    name: 'B.Arch. (Architecture)',
    duration: '5 years',
    rating: 4.5,
    students: 600,
    description: 'Professional program in architecture, design, structures, and urban planning.',
    modules: ['Design Studio', 'Building Materials', 'Structures', 'Urban Planning'],
    careerPaths: ['Architect', 'Urban Planner', 'Interior Designer']
  },
  'bca-computer-applications': {
    name: 'BCA (Computer Applications)',
    duration: '3 years',
    rating: 4.3,
    students: 1400,
    description: 'Application-oriented program focusing on software development and IT skills.',
    modules: ['Programming in C/Java', 'DBMS', 'Web Development', 'Operating Systems'],
    careerPaths: ['Software Developer', 'Web Developer', 'IT Support Engineer']
  },
  'merchant-navy-defence-nda-navy-tech': {
    name: 'Merchant Navy / Defence (NDA, Navy Tech)',
    duration: '3-4 years',
    rating: 4.7,
    students: 500,
    description: 'Entry pathways to Armed Forces and maritime careers with technical training.',
    modules: ['Physical Training', 'Navigation/Technical', 'Leadership', 'Military Studies'],
    careerPaths: ['Naval Officer', 'Deck Cadet', 'Technical Officer']
  },
  'mbbs-medicine': {
    name: 'MBBS (Medicine)',
    duration: '5.5 years',
    rating: 4.9,
    students: 1500,
    description: 'Professional medical degree covering human anatomy, diagnosis, and clinical practice.',
    modules: ['Anatomy', 'Physiology', 'Biochemistry', 'Clinical Rotations'],
    careerPaths: ['Doctor', 'Surgeon', 'General Physician']
  },
  'bds-dentistry': {
    name: 'BDS (Dentistry)',
    duration: '5 years',
    rating: 4.6,
    students: 700,
    description: 'Dental medicine degree focusing on oral health, surgery, and prosthodontics.',
    modules: ['Dental Anatomy', 'Oral Pathology', 'Orthodontics', 'Surgery'],
    careerPaths: ['Dentist', 'Orthodontist', 'Oral Surgeon']
  },
  'b-sc-nursing-bpt-physiotherapy': {
    name: 'B.Sc. Nursing / BPT (Physiotherapy)',
    duration: '4 years',
    rating: 4.5,
    students: 1100,
    description: 'Healthcare programs focused on patient care and physical rehabilitation.',
    modules: ['Nursing Fundamentals', 'Community Health', 'Anatomy', 'Physiotherapy Techniques'],
    careerPaths: ['Registered Nurse', 'Physiotherapist']
  },
  'b-pharm-pharmacy': {
    name: 'B.Pharm (Pharmacy)',
    duration: '4 years',
    rating: 4.4,
    students: 900,
    description: 'Pharmaceutical sciences degree focusing on drug development and pharmacology.',
    modules: ['Pharmacology', 'Pharmaceutics', 'Medicinal Chemistry', 'Pharmacy Practice'],
    careerPaths: ['Pharmacist', 'Clinical Research Associate']
  },
  'allied-medical-sciences-mlt-radiology-biotech': {
    name: 'Allied Medical Sciences (MLT, Radiology, Biotech)',
    duration: '3-4 years',
    rating: 4.2,
    students: 800,
    description: 'Applied medical programs supporting diagnostics and research.',
    modules: ['Medical Lab Technology', 'Imaging Techniques', 'Biotech Basics'],
    careerPaths: ['Lab Technologist', 'Radiology Technician', 'Biotech Associate']
  },
  'b-com-general-hons': {
    name: 'B.Com (General/Hons.)',
    duration: '3 years',
    rating: 4.1,
    students: 2000,
    description: 'Commerce degree covering accounting, finance, and business law.',
    modules: ['Financial Accounting', 'Business Law', 'Taxation', 'Cost Accounting'],
    careerPaths: ['Accountant', 'Financial Analyst']
  },
  'bba-bbm-management': {
    name: 'BBA / BBM (Management)',
    duration: '3 years',
    rating: 4.2,
    students: 1600,
    description: 'Management-focused programs preparing for business and leadership roles.',
    modules: ['Principles of Management', 'Marketing', 'HRM', 'Operations'],
    careerPaths: ['Business Analyst', 'Marketing Executive', 'Operations Coordinator']
  },
  'ca-chartered-accountancy': {
    name: 'CA (Chartered Accountancy)',
    duration: '3+ years',
    rating: 4.8,
    students: 300,
    description: 'Professional credential in accounting and auditing with rigorous exams.',
    modules: ['Accounting', 'Audit', 'Taxation', 'Corporate Laws'],
    careerPaths: ['Chartered Accountant', 'Auditor', 'Consultant']
  },
  'cs-company-secretary': {
    name: 'CS (Company Secretary)',
    duration: '3+ years',
    rating: 4.3,
    students: 250,
    description: 'Corporate governance and compliance specialization with professional certification.',
    modules: ['Company Law', 'Compliance', 'Corporate Governance'],
    careerPaths: ['Company Secretary', 'Compliance Officer']
  },
  'economics-b-a-b-sc-in-economics': {
    name: 'Economics (B.A. / B.Sc.)',
    duration: '3 years',
    rating: 4.2,
    students: 900,
    description: 'Degree focused on microeconomics, macroeconomics, and data analysis.',
    modules: ['Microeconomics', 'Macroeconomics', 'Econometrics', 'Statistics'],
    careerPaths: ['Economist', 'Policy Analyst', 'Data Analyst']
  },
  'b-a-history-political-science-sociology-etc': {
    name: 'B.A. (History, Political Science, Sociology, etc.)',
    duration: '3 years',
    rating: 4.0,
    students: 1800,
    description: 'Humanities disciplines focusing on society, politics, and culture.',
    modules: ['History', 'Political Science', 'Sociology Methods'],
    careerPaths: ['Civil Services Aspirant', 'Researcher', 'Teacher']
  },
  'b-a-english-literature-languages': {
    name: 'B.A. English / Literature / Languages',
    duration: '3 years',
    rating: 4.1,
    students: 1300,
    description: 'Literature and language-focused degree enhancing communication and analysis.',
    modules: ['Literary Studies', 'Linguistics', 'Communication'],
    careerPaths: ['Content Writer', 'Editor', 'Translator']
  },
  'bfa-performing-arts': {
    name: 'BFA (Fine Arts) / Performing Arts',
    duration: '3-4 years',
    rating: 4.2,
    students: 600,
    description: 'Creative arts programs in fine arts, music, dance, and theatre.',
    modules: ['Art/Design Studio', 'Performance', 'Art History'],
    careerPaths: ['Designer', 'Performer', 'Art Director']
  },
  'bjmc-journalism-mass-communication': {
    name: 'BJMC (Journalism & Mass Communication)',
    duration: '3 years',
    rating: 4.1,
    students: 700,
    description: 'Media program covering journalism, broadcasting, and digital content.',
    modules: ['Reporting & Editing', 'Media Laws', 'Digital Media'],
    careerPaths: ['Journalist', 'Content Producer', 'PR Executive']
  },
  'law-ba-llb-5-years': {
    name: 'Law (BA LLB, 5 years)',
    duration: '5 years',
    rating: 4.7,
    students: 500,
    description: 'Integrated law degree combining arts foundation with professional legal education.',
    modules: ['Constitutional Law', 'Contracts', 'Criminal Law', 'Moot Court'],
    careerPaths: ['Lawyer', 'Legal Associate', 'Corporate Counsel']
  }
}

const CourseDetails = () => {
  const { id: slug } = useParams()
  const course = courseCatalog[slug] || courseCatalog['b-tech-be-engineering']

  return (
    <div className="course-details-container">
      <div className="course-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <h1>{course.name}</h1>
        <p className="course-description">{course.description}</p>
      </div>

      <div className="course-stats">
        <div className="stat-card">
          <Clock size={24} />
          <div>
            <h3>Duration</h3>
            <p>{course.duration}</p>
          </div>
        </div>
        <div className="stat-card">
          <Users size={24} />
          <div>
            <h3>Students</h3>
            <p>{course.students.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <Award size={24} />
          <div>
            <h3>Rating</h3>
            <p>★ {course.rating}</p>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="course-modules">
          <h2>Course Modules</h2>
          <div className="modules-grid">
            {course.modules.map((module, index) => (
              <div key={index} className="module-card">
                <BookOpen size={20} />
                <span>{module}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="career-paths">
          <h2>Career Paths</h2>
          <div className="careers-grid">
            {course.careerPaths.map((career, index) => (
              <div key={index} className="career-card">
                <h3>{career}</h3>
                <p>Explore opportunities in this field</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails
