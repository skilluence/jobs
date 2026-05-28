"use client";

import { useEffect, useMemo, useState } from "react";
import jobs from "../data/jobs";

const ITEMS_PER_PAGE = 10;

function formatNumber(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function timeAgo(dateString) {
  if (!dateString) return "Recently";
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `New ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `New ${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const WORK_SITES = ["All", "Remote", "Hybrid", "On-site"];
const EXPERIENCE_LEVELS = ["Entry level", "Mid-Senior level", "Senior level", "Director", "Internship"];
const EXPERIENCE_YEARS = [
  { key: "0-1", label: "0 – 1 years", min: 0, max: 1 },
  { key: "1-3", label: "1 – 3 years", min: 1, max: 3 },
  { key: "3-5", label: "3 – 5 years", min: 3, max: 5 },
  { key: "5-10", label: "5 – 10 years", min: 5, max: 10 },
  { key: "10+", label: "10+ years", min: 10, max: Infinity },
];
const WORK_SCHEDULES = [
  { value: "All", label: "All" },
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

const JOB_FUNCTIONS = [
  { key: "engineering", label: "Engineering", patterns: [/\bengineer\b/i, /\bdeveloper\b/i, /\bsoftware\b/i, /\bSDE\b/, /\bSWE\b/, /\bdevops\b/i] },
  { key: "data", label: "Data & AI", patterns: [/\bdata\b/i, /\banalyst\b/i, /\bscientist\b/i, /\bML\b/, /\bAI\b/, /machine learning/i, /research/i] },
  { key: "design", label: "Design", patterns: [/\bdesign\b/i, /\bUX\b/, /\bUI\b/, /product design/i] },
  { key: "product", label: "Product", patterns: [/product manager/i, /\bPM\b/, /product owner/i] },
  { key: "marketing", label: "Marketing", patterns: [/marketing/i, /\bSEO\b/i, /content/i, /growth/i] },
  { key: "sales", label: "Sales", patterns: [/\bsales\b/i, /\baccount\b/i, /business development/i] },
  { key: "operations", label: "Operations", patterns: [/operations/i, /\bops\b/i, /supply chain/i] },
  { key: "finance", label: "Finance", patterns: [/\bfinance\b/i, /accountant/i, /accounting/i] },
];

const INDUSTRIES = [
  { key: "tech", label: "Technology", patterns: [/software/i, /technology/i, /\bSaaS\b/i, /\btech\b/i, /\bIT\b/, /cloud/i, /\bAI\b/, /platform/i] },
  { key: "finance", label: "Finance", patterns: [/\bbank/i, /finance/i, /financial/i, /fintech/i, /capital/i, /investment/i, /trading/i] },
  { key: "healthcare", label: "Healthcare", patterns: [/health/i, /medical/i, /pharma/i, /hospital/i, /biotech/i, /clinical/i] },
  { key: "retail", label: "Retail & E-commerce", patterns: [/retail/i, /e-commerce/i, /commerce/i, /shopping/i] },
  { key: "consulting", label: "Consulting", patterns: [/consulting/i, /advisory/i] },
  { key: "manufacturing", label: "Manufacturing", patterns: [/manufactur/i, /industrial/i, /automotive/i] },
  { key: "media", label: "Media & Entertainment", patterns: [/media/i, /entertainment/i, /publishing/i, /gaming/i] },
];

const EDUCATION_LEVELS = [
  { key: "bachelor", label: "Bachelor's", patterns: [/bachelor/i, /\bB\.?S\.?\b/, /\bB\.?A\.?\b/, /undergraduate/i] },
  { key: "master", label: "Master's", patterns: [/master/i, /\bM\.?S\.?\b/, /\bM\.?A\.?\b/, /\bMBA\b/i] },
  { key: "phd", label: "PhD", patterns: [/\bPhD\b/i, /Ph\.D/i, /doctorate/i, /doctoral/i] },
];

const SALARY_BUCKETS = [
  { key: "lt80", label: "Under $80k", min: 0, max: 80000 },
  { key: "80-120", label: "$80k – $120k", min: 80000, max: 120000 },
  { key: "120-160", label: "$120k – $160k", min: 120000, max: 160000 },
  { key: "160-200", label: "$160k – $200k", min: 160000, max: 200000 },
  { key: "gt200", label: "$200k+", min: 200000, max: Infinity },
];

const VISA_TYPES = [
  { key: "h1b", label: "H-1B", patterns: [/H-?1B/i, /\bH1\b/] },
  { key: "h4", label: "H-4", patterns: [/H-?4\b/i] },
  { key: "opt", label: "OPT", patterns: [/(?<!STEM\s)\bOPT\b/i, /\bF-?1\s*OPT\b/i] },
  { key: "stemopt", label: "STEM OPT", patterns: [/STEM\s*OPT/i, /STEM\s*extension/i] },
  { key: "cpt", label: "CPT", patterns: [/\bCPT\b/] },
  { key: "greencard", label: "Green Card", patterns: [/green card/i, /permanent resident/i, /\bGC\b/] },
  { key: "citizen", label: "US Citizen", patterns: [/\bU\.?S\.?\s*citizen/i, /\bcitizenship\b/i, /\bU\.?S\.?\s*national\b/i] },
];

function matchKeys(text, defs) {
  if (!text) return [];
  return defs.filter((d) => d.patterns.some((p) => p.test(text))).map((d) => d.key);
}

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ");
}

function extractYears(html) {
  const text = stripHtml(html);
  const range = text.match(/(\d{1,2})\s*(?:-|to|–|—)\s*(\d{1,2})\+?\s*(?:years|yrs)\b/i);
  if (range) {
    const a = parseInt(range[1], 10);
    const b = parseInt(range[2], 10);
    return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  const single = text.match(/(\d{1,2})\+?\s*(?:years|yrs)\s*(?:of)?\s*(?:experience|exp)/i);
  if (single) {
    const n = parseInt(single[1], 10);
    return { min: n, max: n };
  }
  return null;
}

function extractSalary(html) {
  const text = stripHtml(html);
  const match = text.match(/\$\s?([\d,]+)(?:\s?[kK])?\s*(?:-|to|–|—)\s*\$?\s?([\d,]+)(?:\s?[kK])?/);
  if (!match) return null;
  const parseNum = (raw, hasK) => {
    const n = parseInt(raw.replace(/,/g, ""), 10);
    if (Number.isNaN(n)) return null;
    return hasK ? n * 1000 : n;
  };
  const fullMatch = match[0];
  const hasK1 = /\d[kK]/.test(fullMatch.split(/-|to|–|—/)[0]);
  const hasK2 = /\d[kK]/.test(fullMatch.split(/-|to|–|—/)[1] || "");
  let min = parseNum(match[1], hasK1);
  let max = parseNum(match[2], hasK2);
  if (min == null || max == null) return null;
  if (min < 1000 && hasK1) min *= 1000;
  if (max < 1000 && hasK2) max *= 1000;
  if (min > max) [min, max] = [max, min];
  return { min, max };
}

function enrichJob(job) {
  const description = stripHtml(job.descriptionHtml);
  const haystack = `${job.title} ${job.organization} ${description}`;
  return {
    ...job,
    _jobFunctions: matchKeys(job.title, JOB_FUNCTIONS),
    _industries: matchKeys(`${job.organization} ${description}`, INDUSTRIES),
    _education: matchKeys(description, EDUCATION_LEVELS),
    _salary: extractSalary(job.descriptionHtml),
    _years: extractYears(job.descriptionHtml),
    _isInternship: job.employmentType === "INTERNSHIP" || /\bintern(ship)?\b/i.test(job.title),
    _visa: matchKeys(haystack, VISA_TYPES),
  };
}

const DEFAULT_FILTERS = {
  location: "",
  company: "",
  jobFunction: [],
  industry: [],
  workSite: "All",
  workSchedule: "All",
  experience: "",
  experienceYears: "",
  education: [],
  salary: "",
  internshipOnly: false,
  visa: [],
};

const FILTER_CATEGORIES = [
  { key: "location", label: "Location" },
  { key: "company", label: "Company" },
  { key: "jobFunction", label: "Job function" },
  { key: "industry", label: "Industry" },
  { key: "workSite", label: "Work site" },
  { key: "workSchedule", label: "Work schedule" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "salary", label: "Salary" },
  { key: "internship", label: "Internship" },
  { key: "visa", label: "Visa" },
];

function FilterIcon({ name }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "location":
      return (<svg {...common}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
    case "company":
      return (<svg {...common}><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" /></svg>);
    case "jobFunction":
      return (<svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4 2.6-2.6z" /></svg>);
    case "industry":
      return (<svg {...common}><path d="M3 3v18h18M7 14l4-4 4 4 5-5" /></svg>);
    case "workSite":
      return (<svg {...common}><path d="M3 11l9-8 9 8M5 9v11h14V9" /></svg>);
    case "workSchedule":
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
    case "experience":
      return (<svg {...common}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>);
    case "education":
      return (<svg {...common}><path d="M2 10l10-5 10 5-10 5-10-5z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg>);
    case "salary":
      return (<svg {...common}><path d="M12 1v22M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" /></svg>);
    case "internship":
      return (<svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></svg>);
    case "visa":
      return (<svg {...common}><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="11" r="3" /><path d="M9 17h6" /></svg>);
    default:
      return null;
  }
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>&#8249;</button>
      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
        ) : (
          <button key={page} className={`page-btn ${currentPage === page ? "active" : ""}`} onClick={() => onPageChange(page)}>{page}</button>
        )
      )}
      <button className="page-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>&#8250;</button>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [jobsData, setJobsData] = useState(jobs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [openCategory, setOpenCategory] = useState("location");

  const enrichedJobs = useMemo(() => jobsData.map(enrichJob), [jobsData]);

  const handleSearch = async (searchTerm) => {
    const searchQuery = searchTerm.trim() || "AI";
    setLoading(true);
    setError("");
    setCurrentPage(1);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Search failed.");
      }

      const results = Array.isArray(data.items) && data.items.length > 0 ? data.items : [];
      if (results.length === 0) {
        setError(`No results found for "${searchQuery}".`);
        setJobsData(jobs);
      } else {
        const normalizedJobs = results.map((job) => ({
          id: job.id || job.jobId || job.url || `${job.title}-${Math.random()}`,
          title: job.title || job.jobName || "Job opening",
          organization: job.organization || job.company || "Company",
          organizationLogo: job.organization_logo || job.organizationLogo || "",
          datePosted: job.date_posted || job.datePosted || new Date().toISOString(),
          locations: (job.locations_derived && job.locations_derived[0]) || job.locations || "United States",
          employmentType: Array.isArray(job.employment_type) ? job.employment_type[0] : job.employment_type || "FULL_TIME",
          aiExperienceLevel: job.ai_experience_level || job.seniority || "Mid-Senior level",
          aiWorkArrangement: job.ai_work_arrangement || job.work_arrangement || "Remote",
          aiKeySkills: job.ai_key_skills || ["AI", "Machine Learning", "Data"],
          descriptionHtml: job.description_html || job.description || "<p>No job description available.</p>",
        }));
        setJobsData(normalizedJobs);
      }
    } catch (err) {
      setError(err.message || "Unable to fetch jobs.");
      setJobsData(jobs);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = enrichedJobs.filter((job) => {
    if (filters.location && !job.locations.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.company && !job.organization.toLowerCase().includes(filters.company.toLowerCase())) return false;
    if (filters.jobFunction.length > 0 && !filters.jobFunction.some((k) => job._jobFunctions.includes(k))) return false;
    if (filters.industry.length > 0 && !filters.industry.some((k) => job._industries.includes(k))) return false;
    if (filters.workSite && filters.workSite !== "All" && job.aiWorkArrangement !== filters.workSite) return false;
    if (filters.workSchedule && filters.workSchedule !== "All" && job.employmentType !== filters.workSchedule) return false;
    if (filters.experience && job.aiExperienceLevel !== filters.experience) return false;
    if (filters.experienceYears) {
      const bucket = EXPERIENCE_YEARS.find((b) => b.key === filters.experienceYears);
      if (bucket) {
        if (!job._years) return false;
        if (job._years.max < bucket.min || job._years.min > bucket.max) return false;
      }
    }
    if (filters.education.length > 0 && !filters.education.some((k) => job._education.includes(k))) return false;
    if (filters.internshipOnly && !job._isInternship) return false;
    if (filters.visa.length > 0 && !filters.visa.some((k) => job._visa.includes(k))) return false;
    if (filters.salary) {
      const bucket = SALARY_BUCKETS.find((b) => b.key === filters.salary);
      if (bucket) {
        if (!job._salary) return false;
        if (job._salary.max < bucket.min || job._salary.min > bucket.max) return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const pagedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, jobsData]);

  const activeCount = (key) => {
    switch (key) {
      case "location": return filters.location ? 1 : 0;
      case "company": return filters.company ? 1 : 0;
      case "jobFunction": return filters.jobFunction.length;
      case "industry": return filters.industry.length;
      case "workSite": return filters.workSite && filters.workSite !== "All" ? 1 : 0;
      case "workSchedule": return filters.workSchedule && filters.workSchedule !== "All" ? 1 : 0;
      case "experience": return (filters.experience ? 1 : 0) + (filters.experienceYears ? 1 : 0);
      case "education": return filters.education.length;
      case "salary": return filters.salary ? 1 : 0;
      case "internship": return filters.internshipOnly ? 1 : 0;
      case "visa": return filters.visa.length;
      default: return 0;
    }
  };

  const hasActiveFilters = FILTER_CATEGORIES.some((c) => activeCount(c.key) > 0);
  const clearFilters = () => setFilters(DEFAULT_FILTERS);
  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const toggleInArray = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const renderCategoryContent = (key) => {
    switch (key) {
      case "location":
        return (
          <input
            type="text"
            className="filter-location-input"
            placeholder="City, State…"
            value={filters.location}
            onChange={(e) => setFilter("location", e.target.value)}
          />
        );
      case "company":
        return (
          <input
            type="text"
            className="filter-location-input"
            placeholder="Company name…"
            value={filters.company}
            onChange={(e) => setFilter("company", e.target.value)}
          />
        );
      case "jobFunction":
        return JOB_FUNCTIONS.map((opt) => (
          <label key={opt.key} className="filter-option">
            <input
              type="checkbox"
              checked={filters.jobFunction.includes(opt.key)}
              onChange={() => toggleInArray("jobFunction", opt.key)}
            />
            <span>{opt.label}</span>
          </label>
        ));
      case "industry":
        return INDUSTRIES.map((opt) => (
          <label key={opt.key} className="filter-option">
            <input
              type="checkbox"
              checked={filters.industry.includes(opt.key)}
              onChange={() => toggleInArray("industry", opt.key)}
            />
            <span>{opt.label}</span>
          </label>
        ));
      case "workSite":
        return WORK_SITES.map((option) => (
          <label key={option} className="filter-option">
            <input
              type="radio"
              name="workSite"
              checked={filters.workSite === option}
              onChange={() => setFilter("workSite", option)}
            />
            <span>{option}</span>
          </label>
        ));
      case "workSchedule":
        return WORK_SCHEDULES.map(({ value, label }) => (
          <label key={value} className="filter-option">
            <input
              type="radio"
              name="workSchedule"
              checked={filters.workSchedule === value}
              onChange={() => setFilter("workSchedule", value)}
            />
            <span>{label}</span>
          </label>
        ));
      case "experience":
        return (
          <>
            <div className="filter-subheading">Level</div>
            {EXPERIENCE_LEVELS.map((option) => (
              <label key={option} className="filter-option">
                <input
                  type="radio"
                  name="experience"
                  checked={filters.experience === option}
                  onClick={() => filters.experience === option && setFilter("experience", "")}
                  onChange={() => setFilter("experience", option)}
                />
                <span>{option}</span>
              </label>
            ))}
            <div className="filter-subheading" style={{ marginTop: 10 }}>Years of experience</div>
            {EXPERIENCE_YEARS.map((bucket) => (
              <label key={bucket.key} className="filter-option">
                <input
                  type="radio"
                  name="experienceYears"
                  checked={filters.experienceYears === bucket.key}
                  onClick={() => filters.experienceYears === bucket.key && setFilter("experienceYears", "")}
                  onChange={() => setFilter("experienceYears", bucket.key)}
                />
                <span>{bucket.label}</span>
              </label>
            ))}
          </>
        );
      case "education":
        return EDUCATION_LEVELS.map((opt) => (
          <label key={opt.key} className="filter-option">
            <input
              type="checkbox"
              checked={filters.education.includes(opt.key)}
              onChange={() => toggleInArray("education", opt.key)}
            />
            <span>{opt.label}</span>
          </label>
        ));
      case "salary":
        return SALARY_BUCKETS.map((bucket) => (
          <label key={bucket.key} className="filter-option">
            <input
              type="radio"
              name="salary"
              checked={filters.salary === bucket.key}
              onClick={() => filters.salary === bucket.key && setFilter("salary", "")}
              onChange={() => setFilter("salary", bucket.key)}
            />
            <span>{bucket.label}</span>
          </label>
        ));
      case "internship":
        return (
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.internshipOnly}
              onChange={(e) => setFilter("internshipOnly", e.target.checked)}
            />
            <span>Show only internships</span>
          </label>
        );
      case "visa":
        return VISA_TYPES.map((opt) => (
          <label key={opt.key} className="filter-option">
            <input
              type="checkbox"
              checked={filters.visa.includes(opt.key)}
              onChange={() => toggleInArray("visa", opt.key)}
            />
            <span>{opt.label}</span>
          </label>
        ));
      default:
        return null;
    }
  };

  return (
    <div>
      <section className="hero">
        <img
          src="/logo-authentic-scaled.png"
          alt="Skilluence"
          className="hero-logo"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <h1>
          Find Your <em>Visa-Sponsored</em>
          <br /> Dream Job in the U.S.
        </h1>
        <p className="hero-sub">
          Thousands of verified roles from top U.S. employers actively sponsoring H-1B,
          OPT, TN &amp; Green Cards — built for international talent.
        </p>
        <div className="hero-cta-row">
          <button className="hero-btn-primary" onClick={() => handleSearch(query)}>
            Search Jobs
          </button>
          <button
            className="hero-btn-secondary"
            onClick={() => window.open("https://skilluence.com/resume-audit", "_blank")}
          >
            Get Free Resume Audit
          </button>
          <button
            className="hero-btn-secondary"
            onClick={() => {
              document.cookie = "loggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/login";
            }}
            style={{
              padding: "15px 34px",
              fontSize: "15px",
              fontWeight: "600",
              background: "rgba(255,255,255,0.10)",
              color: "white",
              border: "1.5px solid rgba(255,255,255,0.35)",
              borderRadius: "99px",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "background 0.2s, border-color 0.2s, transform 0.2s",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(255,255,255,0.18)";
              e.target.style.borderColor = "rgba(255,255,255,0.6)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255,255,255,0.10)";
              e.target.style.borderColor = "rgba(255,255,255,0.35)";
              e.target.style.transform = "";
            }}
          >
            Logout
          </button>
        </div>
      </section>

      <div className="hero-bottom-search-text" id="jobs-board">
        <h2>Search roles that sponsor your visa</h2>
        <p>Live Apify-powered job search with a modern Next.js interface.</p>
      </div>

      <main className="main-layout container">
        <section className="left-col">
          <div className="search-row">
            <div className="search-input-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={query}
                placeholder="Search & find your dream job"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch(query);
                }}
              />
              <button className="btn btn-primary search-btn" onClick={() => handleSearch(query)}>
                Search
              </button>
            </div>
          </div>

          <div className="results-meta">
            <div className="results-count">
              {loading ? (
                "Searching jobs..."
              ) : (
                <>
                  Showing <strong>{filteredJobs.length}</strong> of <strong>{formatNumber(jobsData.length)}+</strong> jobs
                </>
              )}
            </div>
            {totalPages > 1 && (
              <div className="results-page-info">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>
            )}
          </div>

          {error ? (
            <div style={{ marginBottom: 16, padding: 12, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa", color: "#92400e" }}>
              {error}
            </div>
          ) : null}

          <div className="jobs-list" id="jobsList">
            {pagedJobs.length === 0 ? (
              <div className="job-card">
                <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                  No jobs match the selected filters.
                </div>
              </div>
            ) : (
              pagedJobs.map((job) => (
                <article key={job.id} className="job-card" data-id={job.id}>
                  <div className="jc-header">
                    <div className="jc-company-info">
                      {job.organizationLogo ? (
                        <div className="jc-logo">
                          <img src={job.organizationLogo} alt={job.organization} />
                        </div>
                      ) : null}
                      <div>
                        <div className="jc-company">{job.organization}</div>
                        <div className="jc-title">{job.title}</div>
                        <div className="jc-location">{job.locations}</div>
                      </div>
                    </div>
                    <div className="jc-time">{timeAgo(job.datePosted)}</div>
                  </div>
                  <div className="jc-meta">
                    <span>{job.aiExperienceLevel}</span>
                    <span>{job.employmentType.replace("_", " ")}</span>
                    <span>{job.aiWorkArrangement}</span>
                  </div>
                  <div className="jc-tags">
                    {job.aiKeySkills.map((skill) => (
                      <span key={skill} className="jtag">{skill}</span>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              document.getElementById("jobsList")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </section>

        <aside className="filter-aside">
          <div className="filter-panel filter-rail">
            <div className="filter-panel-header">
              <span className="filter-panel-title">Filters</span>
              {hasActiveFilters && (
                <button className="filter-clear-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>

            <div className="filter-rail-body">
              <div className="filter-rail-list">
                {FILTER_CATEGORIES.map((cat) => {
                  const isOpen = openCategory === cat.key;
                  const count = activeCount(cat.key);
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      className={`filter-rail-row ${isOpen ? "active" : ""}`}
                      onClick={() => setOpenCategory(cat.key)}
                    >
                      <FilterIcon name={cat.key} />
                      <span className="filter-rail-label">{cat.label}</span>
                      {count > 0 && <span className="filter-rail-badge">+{count}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="filter-rail-pane">
                {openCategory ? (
                  <>
                    <div className="filter-rail-pane-title">
                      {FILTER_CATEGORIES.find((c) => c.key === openCategory)?.label}
                    </div>
                    <div className="filter-rail-pane-body">
                      {renderCategoryContent(openCategory)}
                    </div>
                  </>
                ) : (
                  <div className="filter-rail-pane-empty">
                    Select a category to refine results.
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
