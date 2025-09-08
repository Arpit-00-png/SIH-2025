import { GoogleGenerativeAI } from '@google/generative-ai';

// Debug: Check if API key is loaded
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
console.log('API Key (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'Not found');

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not defined in environment variables');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Helper: parse JSON from model output that might include code fences or extra text
const parseJsonSafe = (text) => {
  if (!text || typeof text !== 'string') return null
  // strip code fences like ```json ... ``` or ``` ... ```
  let cleaned = text.replace(/```json\s*|```\s*/gi, '')
  // quick direct parse
  try { return JSON.parse(cleaned) } catch {}
  // try to extract the first JSON array
  const arrayMatch = cleaned.match(/\[([\s\S]*?)\]/)
  if (arrayMatch) {
    try { return JSON.parse(arrayMatch[0]) } catch {}
  }
  // try to extract the first JSON object
  const objectMatch = cleaned.match(/\{([\s\S]*?)\}/)
  if (objectMatch) {
    try { return JSON.parse(objectMatch[0]) } catch {}
  }
  return null
}

// Chatbot Service - Prompt-based call (no history to avoid role ordering issues)
export const chatWithAI = async (message, userProfile = null) => {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const profileContext = userProfile ? `\nUser Profile:\n- Name: ${userProfile.name || 'Not specified'}\n- Age: ${userProfile.age || 'Not specified'}\n- Current Education: ${userProfile.education || 'Not specified'}\n- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}\n- Career Goals: ${userProfile.careerGoals || 'Not specified'}\n- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}\n- Location: ${userProfile.location || 'Not specified'}\n- Quiz Results: ${userProfile.quizResults ? JSON.stringify(userProfile.quizResults) : 'Not completed'}\n` : '';

    const prompt = `You are an AI career counselor. Provide helpful, personalized career guidance based on the user's question and their profile. Be friendly, informative, and specific to the Indian education and job market context.\n${profileContext}\nUser's question: ${message}\n\nPlease provide a comprehensive response that includes:\n1. Direct answer to their question\n2. Relevant career insights based on their profile\n3. Personalized advice considering their background\n4. Next steps they can take\n\nKeep your response conversational and under 300 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chatWithAI:', error);
    if (error.message?.includes('API key')) {
      return "I'm sorry, there's a configuration issue. Please check the API key setup.";
    }
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return "I'm sorry, I've reached my usage limit. Please try again later.";
    }
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};

// Quiz Analysis Service (profile-aware)
export const analyzeQuizResults = async (quizAnswers, userProfile = null) => {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const profileContext = userProfile ? `\nUser Profile Context:\n- Current Education: ${userProfile.education || 'Not specified'}\n- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}\n- Location: ${userProfile.location || 'Not specified'}\n` : '';

    const prompt = `Analyze these quiz answers and provide personalized career recommendations:\n${profileContext}\nQuiz Answers: ${JSON.stringify(quizAnswers)}\n\nPlease provide:\n1. Top 3 career recommendations based on their profile and quiz results\n2. Suggested courses/streams that align with their background\n3. Key skills to develop considering their current level\n4. Personality insights from quiz responses\n5. Personalized study plan\n6. Recommended colleges/universities based on their location and interests\n\nFormat as JSON with this structure:\n{\n  "careers": ["career1", "career2", "career3"],\n  "courses": ["course1", "course2"],\n  "skills": ["skill1", "skill2", "skill3"],\n  "personality": "description",\n  "recommendations": "detailed explanation",\n  "studyPlan": ["step1", "step2", "step3"],\n  "colleges": ["college1", "college2", "college3"]\n}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = parseJsonSafe(response.text())
    if (parsed) return parsed
    return {
      careers: ["Software Engineer", "Data Analyst", "Product Manager"],
      courses: ["Computer Science", "Business Analytics"],
      skills: ["Problem Solving", "Communication", "Technical Skills"],
      personality: "Analytical and detail-oriented",
      recommendations: "Based on your responses, you show strong analytical thinking and problem-solving abilities.",
      studyPlan: ["Complete relevant coursework", "Build practical projects", "Gain industry experience"],
      colleges: ["IIT Delhi", "IIT Bombay", "IIM Bangalore"]
    };
  } catch (error) {
    console.error('Error in analyzeQuizResults:', error);
    return {
      careers: ["Software Engineer", "Data Analyst", "Product Manager"],
      courses: ["Computer Science", "Business Analytics"],
      skills: ["Problem Solving", "Communication", "Technical Skills"],
      personality: "Analytical and detail-oriented",
      recommendations: "Based on your responses, you show strong analytical thinking and problem-solving abilities.",
      studyPlan: ["Complete relevant coursework", "Build practical projects", "Gain industry experience"],
      colleges: ["IIT Delhi", "IIT Bombay", "IIM Bangalore"]
    };
  }
};

// College Recommendation Service (profile-aware)
export const getCollegeRecommendations = async (userProfile) => {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const prompt = `Based on this comprehensive user profile, recommend colleges and courses:\n\nProfile: ${JSON.stringify(userProfile)}\n\nConsider:\n- Their location preferences\n- Academic background\n- Career goals\n- Financial situation\n- Interests and skills\n- Quiz results\n\nProvide recommendations in this JSON format:\n{\n  "colleges": [\n    {\n      "name": "College Name",\n      "location": "City, State",\n      "courses": ["Course1", "Course2"],\n      "reason": "Why this college fits their profile",\n      "rating": 4.5,\n      "admissionDifficulty": "Easy|Medium|Hard",\n      "fees": "₹X-Y LPA",\n      "placementRate": "X%",\n      "topRecruiters": ["Company1", "Company2"]\n    }\n  ],\n  "courses": ["Recommended Course 1", "Recommended Course 2"],\n  "insights": "Personalized insights about the recommendations",\n  "applicationTips": ["tip1", "tip2", "tip3"],\n  "scholarships": ["scholarship1", "scholarship2"]\n}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = parseJsonSafe(response.text())
    if (parsed) return parsed
    return {
      colleges: [
        {
          name: "Indian Institute of Technology Delhi",
          location: "Delhi",
          courses: ["Computer Science", "Engineering"],
          reason: "Excellent for technical education",
          rating: 4.8,
          admissionDifficulty: "Hard",
          fees: "₹2-3 LPA",
          placementRate: "95%",
          topRecruiters: ["Google", "Microsoft", "Amazon"]
        }
      ],
      courses: ["Computer Science", "Engineering"],
      insights: "Based on your profile, technical education would be a great fit.",
      applicationTips: ["Focus on JEE preparation", "Build strong foundation in mathematics", "Participate in coding competitions"],
      scholarships: ["Merit-based scholarships", "Need-based financial aid"]
    };
  } catch (error) {
    console.error('Error in getCollegeRecommendations:', error);
    return {
      colleges: [
        {
          name: "Indian Institute of Technology Delhi",
          location: "Delhi",
          courses: ["Computer Science", "Engineering"],
          reason: "Excellent for technical education",
          rating: 4.8,
          admissionDifficulty: "Hard",
          fees: "₹2-3 LPA",
          placementRate: "95%",
          topRecruiters: ["Google", "Microsoft", "Amazon"]
        }
      ],
      courses: ["Computer Science", "Engineering"],
      insights: "Based on your profile, technical education would be a great fit.",
      applicationTips: ["Focus on JEE preparation", "Build strong foundation in mathematics", "Participate in coding competitions"],
      scholarships: ["Merit-based scholarships", "Need-based financial aid"]
    };
  }
};

// Career Insights Service (profile-aware)
export const getCareerInsights = async (careerName, userProfile = null) => {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const profileContext = userProfile ? `\nUser Profile:\n- Current Education: ${userProfile.education || 'Not specified'}\n- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}\n- Location: ${userProfile.location || 'Not specified'}\n- Career Goals: ${userProfile.careerGoals || 'Not specified'}\n` : '';

    const prompt = `Provide detailed, personalized insights about the career: ${careerName}\n${profileContext}\nInclude:\n1. Job description tailored to their background\n2. Required skills and how they can develop them\n3. Salary range in India based on their location\n4. Growth prospects considering their profile\n5. Educational requirements and pathways\n6. Top companies hiring in their area\n7. Personalized career roadmap\n8. Skills gap analysis\n\nFormat as JSON:\n{\n  "description": "personalized job description",\n  "skills": ["skill1", "skill2"],\n  "salary": "₹X-Y LPA",\n  "growth": "growth prospects",\n  "education": "educational requirements",\n  "companies": ["company1", "company2"],\n  "pros": ["advantage1", "advantage2"],\n  "cons": ["challenge1", "challenge2"],\n  "roadmap": ["step1", "step2", "step3"],\n  "skillsGap": ["skill1 to develop", "skill2 to improve"],\n  "timeline": "estimated timeline to achieve this career"\n}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = parseJsonSafe(response.text())
    if (parsed) return parsed
    return {
      description: "A professional role in the field",
      skills: ["Communication", "Problem Solving"],
      salary: "₹5-15 LPA",
      growth: "Good growth prospects",
      education: "Relevant degree required",
      companies: ["Top companies in the field"],
      pros: ["Good opportunities", "Growth potential"],
      cons: ["Competitive field", "Continuous learning required"],
      roadmap: ["Complete education", "Gain experience", "Build network"],
      skillsGap: ["Technical skills", "Soft skills"],
      timeline: "2-4 years"
    };
  } catch (error) {
    console.error('Error in getCareerInsights:', error);
    return {
      description: "A professional role in the field",
      skills: ["Communication", "Problem Solving"],
      salary: "₹5-15 LPA",
      growth: "Good growth prospects",
      education: "Relevant degree required",
      companies: ["Top companies in the field"],
      pros: ["Good opportunities", "Growth potential"],
      cons: ["Competitive field", "Continuous learning required"],
      roadmap: ["Complete education", "Gain experience", "Build network"],
      skillsGap: ["Technical skills", "Soft skills"],
      timeline: "2-4 years"
    };
  }
};

// Smart Alert Generation (profile-aware)
export const generateSmartAlerts = async (userProfile, currentDate) => {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const prompt = `Generate personalized alerts for a student with this profile:\n\nProfile: ${JSON.stringify(userProfile)}\nCurrent Date: ${currentDate}\n\nGenerate relevant alerts like:\n- Application deadlines for colleges matching their profile\n- Scholarship opportunities they're eligible for\n- Career events in their area\n- Skill development opportunities\n- Exam dates relevant to their goals\n- Internship opportunities\n- Career fairs and networking events\n\nFormat as JSON array:\n[\n  {\n    "title": "Alert Title",\n    "message": "Personalized alert message",\n    "type": "deadline|scholarship|event|reminder|exam|internship",\n    "priority": "high|medium|low",\n    "date": "YYYY-MM-DD",\n    "time": "HH:MM",\n    "actionRequired": "What they need to do",\n    "relatedTo": "college|career|skill|exam"\n  }\n]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = parseJsonSafe(response.text())
    if (parsed) return parsed
    return [
      {
        title: "Career Guidance Session",
        message: "Schedule a session to discuss your career goals",
        type: "reminder",
        priority: "medium",
        date: new Date().toISOString().split('T')[0],
        time: "10:00",
        actionRequired: "Book a counseling session",
        relatedTo: "career"
      }
    ];
  } catch (error) {
    console.error('Error in generateSmartAlerts:', error);
    return [
      {
        title: "Career Guidance Session",
        message: "Schedule a session to discuss your career goals",
        type: "reminder",
        priority: "medium",
        date: new Date().toISOString().split('T')[0],
        time: "10:00",
        actionRequired: "Book a counseling session",
        relatedTo: "career"
      }
    ];
  }
};

// Generate Personalized Study Plan
export const generateStudyPlan = async (userProfile, goal) => {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const prompt = `Generate a personalized study plan for this user:\n\nProfile: ${JSON.stringify(userProfile)}\nGoal: ${goal}\n\nCreate a detailed study plan including:\n- Daily/weekly schedule\n- Resources to use\n- Milestones to achieve\n- Skills to focus on\n- Practice exercises\n- Timeline\n\nFormat as JSON:\n{\n  "planName": "Study Plan Name",\n  "duration": "X months/weeks",\n  "schedule": [\n    {\n      "week": 1,\n      "topics": ["topic1", "topic2"],\n      "activities": ["activity1", "activity2"],\n      "resources": ["resource1", "resource2"],\n      "milestone": "milestone description"\n    }\n  ],\n  "resources": ["resource1", "resource2"],\n  "skills": ["skill1", "skill2"],\n  "timeline": "detailed timeline",\n  "tips": ["tip1", "tip2"]\n}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = parseJsonSafe(response.text())
    if (parsed) return parsed
    return {
      planName: "Basic Study Plan",
      duration: "3 months",
      schedule: [],
      resources: ["Online courses", "Books", "Practice tests"],
      skills: ["Problem solving", "Communication"],
      timeline: "3-month structured plan",
      tips: ["Stay consistent", "Practice daily"]
    };
  } catch (error) {
    console.error('Error in generateStudyPlan:', error);
    return {
      planName: "Basic Study Plan",
      duration: "3 months",
      schedule: [],
      resources: ["Online courses", "Books", "Practice tests"],
      skills: ["Problem solving", "Communication"],
      timeline: "3-month structured plan",
      tips: ["Stay consistent", "Practice daily"]
    };
  }
};

// NEW: Get AI-ranked top skills for a stream
export const getTopSkillsForStream = async (userProfile, stream) => {
  try {
    if (!apiKey) throw new Error('API key not configured')

    const prompt = `Given this user's profile and their chosen stream, list the top 6 skills they should focus on next.\n\nProfile: ${JSON.stringify(userProfile)}\nStream: ${stream}\n\nReturn JSON as:\n{ "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"] }`;

    const result = await model.generateContent(prompt)
    const response = await result.response
    const parsed = parseJsonSafe(response.text())
    if (Array.isArray(parsed?.skills) && parsed.skills.length) return parsed.skills
    return ["Problem Solving", "Communication", "Time Management", "Critical Thinking", "Collaboration", "Self-Learning"]
  } catch (error) {
    console.error('Error in getTopSkillsForStream:', error)
    return ["Problem Solving", "Communication", "Time Management", "Critical Thinking", "Collaboration", "Self-Learning"]
  }
}

// NEW: Score courses with personalized reasons
export const scoreCoursesForUser = async (userProfile, stream, courses) => {
  try {
    if (!apiKey) throw new Error('API key not configured')

    const prompt = `Score each course (0-100) for this user and provide a brief personalized reason (<= 20 words).\n\nProfile: ${JSON.stringify(userProfile)}\nStream: ${stream}\nCourses: ${JSON.stringify(courses)}\n\nReturn JSON as array of objects:\n[{ "course": "course title", "score": 78, "reason": "short reason" }]`;

    const result = await model.generateContent(prompt)
    const response = await result.response
    const parsed = parseJsonSafe(response.text())
    if (Array.isArray(parsed)) return parsed

    return courses.map((c, i) => ({ course: c, score: 60 - i * 8 >= 20 ? 60 - i * 8 : 35, reason: "Good match with your interests and background." }))
  } catch (error) {
    console.error('Error in scoreCoursesForUser:', error)
    return courses.map((c, i) => ({ course: c, score: 55 - i * 6 >= 20 ? 55 - i * 6 : 30, reason: "Relevant to your selected stream." }))
  }
}
