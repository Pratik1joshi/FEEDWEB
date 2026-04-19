"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import BasicRichTextEditor from "@/components/rich-text-editor/BasicRichTextEditor";
import { showAdminError, showAdminSuccess } from "@/lib/admin-toast";
import { pagesApi, uploadApi } from "@/lib/api-services";
import {
  Trash2,
  Plus,
  Image as ImageIcon,
  Briefcase,
  Settings,
  LayoutTemplate,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
  : "http://localhost:5000";

const DEFAULT_GALLERY_ITEM = {
  src: "/about.jpg",
  span: "md:col-span-1 md:row-span-1",
  title: "Team Building",
  description: "Growing together through collaboration",
};

const DEFAULT_JOB = {
  id: "",
  slug: "",
  title: "",
  department: "",
  type: "Full-time",
  location: "Kathmandu, Nepal",
  experience: "",
  salary: "",
  deadline: "",
  summary: "",
  detailsHtml: "",
  requirementsHtml: "",
  benefitsHtml: "",
  applicationEmail: "",
  applicationLink: "",
  isActive: true,
};

const DEFAULT_CAREERS_META = {
  banner: {
    badgeText: "Career Opportunities",
    title: "Join Our Dynamic Team",
    subtitle: "Work with us and provide the Contribution to nation and FEED",
    description:
      "Joining our team presents an exciting opportunity to contribute to a dynamic and forward-thinking organization",
    backgroundImage: "",
  },
  hero: {
    title: "Career",
    subtitle: "Join Our Team",
    description:
      "Joining our team presents an exciting opportunity to contribute to a dynamic and forward-thinking organization. We value individuals who bring their unique skills and experiences to the table, and we believe that you can make a significant impact here. Our team is built on collaboration, innovation, and a shared commitment to excellence. By joining us, you'll have the chance to work alongside dedicated professionals who are passionate about what they do.",
    image: "",
  },
  lifeAtFeed: {
    title: "Life at FEED",
    description:
      "Experience the dynamic and collaborative environment that makes FEED a great place to work",
  },
  jobsSection: {
    title: "Open Positions",
    description: "Explore current opportunities and view complete role details.",
  },
  apply: {
    title: "Apply To Join Our Team",
    description:
      "Joining our team presents an exciting opportunity to contribute to a dynamic and forward-thinking organization. We value individuals who bring their unique skills and experiences to the table, and we believe that you can make a significant impact here.",
    buttonText: "Apply Now",
    buttonLink: "/contact",
  },
  gallery: [
    {
      src: "/about.jpg",
      span: "md:col-span-2 md:row-span-2",
      title: "Team Building",
      description: "Growing together through collaboration",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-1 md:row-span-1",
      title: "Innovation",
      description: "Pushing boundaries",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-1 md:row-span-1",
      title: "Leadership",
      description: "Guiding the way forward",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-1 md:row-span-2",
      title: "Research",
      description: "Discovering new possibilities",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-2 md:row-span-1",
      title: "Collaboration",
      description: "Working as one",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-1 md:row-span-1",
      title: "Development",
      description: "Building the future",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-2 md:row-span-1",
      title: "Community",
      description: "Making a difference together",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-1 md:row-span-2",
      title: "Growth",
      description: "Nurturing talent",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-1 md:row-span-1",
      title: "Excellence",
      description: "Striving for the best",
    },
    {
      src: "/about.jpg",
      span: "md:col-span-1 md:row-span-1",
      title: "Sustainability",
      description: "Creating lasting impact",
    },
  ],
  jobs: [],
};

const DEFAULT_KNOW_US_VALUE = {
  title: "Excellence",
  description:
    "We deliver the highest quality research and consulting services using cutting-edge technology and best practices.",
};

const escapeHtml = (value = "") =>
  `${value}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const paragraphsToHtml = (items = []) =>
  items
    .map((item) => `${item || ""}`.trim())
    .filter(Boolean)
    .map((item) => `<p>${escapeHtml(item)}</p>`)
    .join("");

const DEFAULT_KNOW_US_HISTORY_PARAGRAPHS = [
  "After realizing the essence of a Research and Consulting Company in the field of Engineering, Energy and Environment to deliver high quality professional services, the like minded and highly motivated professionals initiated FEED in 1999.",
  "FEED (P) Ltd. envisions to deliver science based research and professional services in the field of sustainable development, climate and climate change impacts, adaptations, to contribute for disaster risk reduction; bridging academic research with professionals and policymakers for sustainable development.",
  "FEED team believes in coupling the enthusiasm and ambition of youth, with its lack of fear and innovative techniques, with the gardened knowledge of experience to work for the change.",
];

const DEFAULT_KNOW_US_JOURNEY_PARAGRAPHS = [
  "FEED was established in September 1999 under the Company Act of Nepal at the Office of the Company Registrar, Kathmandu and Tax/VAT Office of the Government of Nepal. After realizing the essence of a Research and Consulting Company in the field of Engineering, Energy and Environment to deliver high quality professional services, like-minded and highly motivated professionals initiated FEED.",
  "Over more than two decades, FEED has been engaging actively in Nepal, providing a diverse range of services in the engineering sector through the latest and cutting-edge technology. FEED has gained valuable expertise and experiences in project management, Hydropower, Energy, Ecosystem, Environment and Nature-based solutions, Water resources, Infrastructure and Planning, climate change, disaster risk reduction and more.",
  "Alongside government agencies, FEED has healthy experience working with NGOs, INGOs, and donor agencies. The company believes in coupling the enthusiasm and ambition of youth with innovative techniques and the seasoned knowledge of experience to work for positive change. FEED maintains high levels of professional ethics and anti-corruption policies that create a transparent and zero-tolerance environment.",
];

const DEFAULT_KNOW_US_META = {
  banner: {
    badgeText: "About FEED",
    title: "Forum for Energy and Environment Development",
    subtitle: "",
    description:
      "Developing resilient and sustainable communities through innovative research and consulting services",
    backgroundImage: "/photo-1617280137702-32e761be8b26.jpg",
  },
  history: {
    heading: "Feed Pvt Ltd",
    subheading: "How we started",
    contentHtml: paragraphsToHtml(DEFAULT_KNOW_US_HISTORY_PARAGRAPHS),
    buttonText: "Get in Touch",
    buttonLink: "/contact",
    image: "/about.jpg",
  },
  aboutFeed: {
    sectionEyebrow: "About",
    sectionTitle: "FEED",
    intro:
      "Forum for Energy and Environment Development (FEED) P. Ltd. is one of the leading consulting companies in Nepal initiated by the Engineers' and development planners' with a vision of providing best research and consulting services in developing the risk informed societies. FEED is driven by strong and diverse professionals with proven expertise and experience in handling large and complex projects across sectors.",
    details:
      "FEED was established in September 1999 under the Company Act of Nepal at the Office of the Company Registrar, Kathmandu and Tax/VAT Office of the Government of Nepal. FEED has been engaging actively in Nepal in providing a diverse range of services in the engineering sector through the latest and cutting edge technology for more than a couple of decades. Over the years, FEED has gained valuable expertise and experiences in the field of project management, Hydropower, Energy, Ecosystem, Environment and Nature based solutions, Water resources, Infrastructure and Planning, climate change, disaster risk reduction and so on. Alongside the government agencies, FEED has a healthy experiences of working with the NGOs, INGOs, and donor agencies.",
    image: "/about2.jpg",
  },
  visionBlock: {
    description:
      "FEED believes in working closely with the customers to understand the holistic nature of their requirements and put forth a comprehensive plan in place. Through the adequate research, successful piloting and reference of best practices, FEED aims to co-create sustainable solutions to any problems. For this, FEED prioritizes interdisciplinary collaboration, quality assurance, resource optimization for devising cost effective solutions, and sound interaction with the stakeholders. Further, FEED has been maintaining high level of professional ethics and anti-corruption policy that lead transparent and zero-tolerance environment.",
    image: "/about3.jpg",
  },
  missionVision: {
    missionTitle: "Our Mission",
    missionDescription:
      "To develop the environment friendly infrastructures, and to make the rational use of energy and resources for the better livelihood and sustainable development.",
    visionTitle: "Our Vision",
    visionDescription:
      "Offering the best research and consulting services in developing resilient and sustainable communities.",
  },
  valuesSection: {
    title: "Our Core Values",
    description:
      "The principles that guide our work and shape our approach to sustainable development",
    values: [
      {
        title: "Excellence",
        description:
          "We deliver the highest quality research and consulting services using cutting-edge technology and best practices.",
      },
      {
        title: "Collaboration",
        description:
          "We prioritize interdisciplinary collaboration and sound interaction with stakeholders for sustainable solutions.",
      },
      {
        title: "Sustainability",
        description:
          "We focus on developing environment-friendly infrastructures and sustainable community development.",
      },
      {
        title: "Integrity",
        description:
          "We maintain high professional ethics and anti-corruption policies in a transparent, zero-tolerance environment.",
      },
    ],
  },
  objectivesSection: {
    title: "Our Objectives",
    description:
      "Strategic goals that drive our professional expertise and service delivery",
    objectives: [
      "Conduct detailed investigation and studies in disaster prevention and mitigation technology including land use mapping, hazard and risk analysis, pre and post natural and manmade disaster assessment, research and investigation.",
      "Provide professional expertise in information dissemination, impact assessment, and community-oriented development works in the field of energy, environment, Climate Change and DRR, and infrastructure development.",
      "Perform research and development in the field of environment, Hydrometeorological and Geological Disasters, IEE, EIA, and SEIA.",
      "Infrastructure Analysis, feasibility studies, designs and conduct trainings related in the field of social development, infrastructure and other appropriate technology.",
      "Conduct different types of survey (detailed and feasibility), design and construction supervision of Hydropower Projects and Renewable Energy.",
      "Use of Geographic Information System (GIS) tools in project planning, monitoring, impact assessment and different modeling works.",
      "Provide expert services on Environment Friendly Rural/Urban development, Eco-safe rural roads.",
      "Baseline survey, Project monitoring and evaluation.",
    ],
  },
  journey: {
    title: "Our Journey",
    description: "Over two decades of excellence in sustainable development consulting",
    contentHtml: paragraphsToHtml(DEFAULT_KNOW_US_JOURNEY_PARAGRAPHS),
  },
};

const DEFAULT_ABOUT_STAT = {
  number: 26,
  suffix: "+",
  label: "Years of Experience",
  icon: "award",
};

const DEFAULT_ABOUT_CLIENT = {
  name: "World Bank",
  logo: "/clients/AEPC.png",
};

const DEFAULT_ABOUT_SECTION_META = {
  header: {
    badgeText: "About Us",
    title: "26 Years of Proven Experience",
    description:
      "Forum for Energy and Environment Development (FEED) P. Ltd. is one of the leading consulting companies in Nepal initiated by the Engineers' and development planners' with a vision of providing best research and consulting services in developing the risk informed societies. FEED is driven by strong and diverse professionals with proven expertise and experience in handling large and complex projects across sectors.",
    ctaText: "Know Us More",
    ctaLink: "/about",
    image: "/placeholder.jpg",
  },
  stats: {
    title: "Our Impact in Numbers",
    subtitle: "Measurable results from our commitment to sustainable development",
    items: [
      { number: 26, suffix: "+", label: "Years of Experience", icon: "award" },
      { number: 100, suffix: "+", label: "Projects Completed", icon: "target" },
      { number: 30, suffix: "+", label: "Countries Reached", icon: "globe" },
      { number: 50, suffix: "+", label: "Expert Consultants", icon: "users" },
    ],
  },
  clients: {
    title: "Our Clients",
    subtitle: "Our Valuable Clients and Collaborators",
    items: [
      { name: "World Bank", logo: "/clients/AEPC.png" },
      { name: "United Nations", logo: "/clients/Helvetas.png" },
      { name: "Asian Development Bank", logo: "/clients/UNDP.jpg" },
      { name: "USAID", logo: "/clients/UNEnvironment.png" },
      { name: "GIZ", logo: "/clients/PracticalAction.jpg" },
      { name: "UNDP", logo: "/clients/IUCN.png" },
    ],
  },
};

const DEFAULT_PROJECTS_SECTION_META = {
  header: {
    badgeText: "Portfolio Showcase",
    title: "Latest Projects",
    subtitle:
      "Explore our latest innovative solutions across environmental and energy sectors, showcasing our commitment to sustainable development and technical excellence.",
    ctaText: "See All Projects",
    ctaLink: "/projects",
  },
  messages: {
    loading: "Loading our latest projects...",
    empty: "No projects available at the moment.",
    error: "Failed to load projects. Please try again later.",
  },
};

const DEFAULT_HERO_ROTATING_STAT = "25+ Years of Experience";

const DEFAULT_HERO_SECTION_META = {
  video: {
    src: "/hero-video.mp4",
    poster: "",
    overlayBrightness: 0.4,
  },
  header: {
    badgeText: "Forum for Energy and Environment Development",
    title: "An organization committed for sustainable Development in The Himalayas",
  },
  buttons: {
    primaryText: "Know Us More",
    primaryLink: "/about",
    secondaryText: "Our Works",
    secondaryLink: "/projects",
  },
  stats: {
    title: "Up to Now",
    items: [
      "25+ Years of Experience",
      "100+ Projects Completed in Nepal",
      "Helped Thousands of People",
      "Sustainable Development Solutions",
    ],
  },
};

const DEFAULT_SERVICES_SECTION_META = {
  header: {
    badgeText: "Our Expertise",
    title: "Our Services",
    subtitle: "Comprehensive solutions for sustainable development and environmental challenges",
    ctaText: "View All Services",
    ctaLink: "/services",
  },
  messages: {
    loading: "Loading services...",
    empty: "Our services information will be available soon.",
    error: "Unable to load services. Please try again later.",
  },
};

const DEFAULT_EVENTS_SECTION_META = {
  header: {
    badgeText: "Events & Workshops",
    title: "Explore Recent and Upcoming Events",
    subtitle: "Join us for conferences, workshops, and community engagement sessions",
    ctaText: "View All Events",
    ctaLink: "/events",
  },
  messages: {
    loading: "Loading events...",
    empty: "Check back soon for exciting events and workshops.",
    error: "Unable to load events. Please try again later.",
    fallbackSubtitle: "There are no upcoming events at the moment. Explore our past events below.",
  },
};

const DEFAULT_MEDIA_SECTION_META = {
  header: {
    badgeText: "News & Media",
    title: "Latest News & Media",
    subtitle: "Stay updated with our latest developments and industry insights",
    ctaText: "View All Media",
    ctaLink: "/media",
  },
  messages: {
    loading: "Loading media...",
    empty: "Check back soon for the latest news and updates.",
    error: "Unable to load media content. Please try again later.",
  },
};

const ADDITIONAL_HOMEPAGE_SECTION_DEFAULTS = {
  "publications-section": {
    header: {
      badgeText: "Publications",
      title: "Latest Publications",
      subtitle:
        "Explore our research papers, policy briefs, and reports that provide valuable insights on energy and environmental challenges.",
      ctaText: "View All Publications",
      ctaLink: "/publications",
    },
    messages: {
      loading: "Loading publications...",
      empty: "Check back soon for our latest research and reports.",
      error: "Unable to load publications. Please try again later.",
      note: "",
      placeholder: "",
    },
  },
  "timeline-section": {
    header: {
      badgeText: "Milestones",
      title: "Our Journey",
      subtitle:
        "Explore the key milestones that have shaped our organization's impact on energy and environmental development.",
      ctaText: "",
      ctaLink: "",
    },
    messages: {
      loading: "Loading timeline...",
      empty: "No timeline items available.",
      error: "Unable to load timeline. Please try again later.",
      note: "Drag to explore the timeline",
      placeholder: "",
    },
  },
  "working-areas-section": {
    header: {
      badgeText: "Working Areas",
      title: "Our Work in Nepal",
      subtitle: "Discover the regions where we have active projects and impact.",
      ctaText: "",
      ctaLink: "",
    },
    messages: {
      loading: "Loading map and project data...",
      empty: "No project location data available at the moment.",
      error: "Unable to load map/project data. Please try again later.",
      note: "Map Legend",
      placeholder: "",
    },
  },
  "contact-section": {
    header: {
      badgeText: "",
      title: "Get in Touch",
      subtitle: "Send us a message and our team will get back to you.",
      ctaText: "Send Message",
      ctaLink: "",
    },
    messages: {
      loading: "",
      empty: "",
      error: "",
      note: "Contact Information",
      placeholder: "",
    },
  },
  "newsletter-section": {
    header: {
      badgeText: "FEED Updates",
      title: "Stay Updated",
      subtitle: "Get updates about our latest projects, insights, and publications.",
      ctaText: "Subscribe",
      ctaLink: "",
    },
    messages: {
      loading: "",
      empty: "",
      error: "",
      note: "We only send relevant updates. Unsubscribe anytime.",
      placeholder: "Enter your email address",
    },
  },
};

const ADDITIONAL_HOMEPAGE_SECTION_SLUGS = Object.keys(ADDITIONAL_HOMEPAGE_SECTION_DEFAULTS);

const cloneObject = (value) => JSON.parse(JSON.stringify(value));

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const withMediaOrigin = (src = "") => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/uploads/")) return `${API_ORIGIN}${src}`;
  return src;
};

const normalizeCareersMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_CAREERS_META);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  const gallery =
    Array.isArray(meta.gallery) && meta.gallery.length > 0
      ? meta.gallery.map((item) => ({ ...DEFAULT_GALLERY_ITEM, ...item }))
      : defaults.gallery;

  const jobs = Array.isArray(meta.jobs)
    ? meta.jobs.map((job, index) => {
        const normalized = { ...DEFAULT_JOB, ...job };
        const fallbackTitle = normalized.title || `Job ${index + 1}`;
        normalized.id = normalized.id || `job-${index + 1}`;
        normalized.slug = normalized.slug || slugify(fallbackTitle);
        normalized.summary = normalized.summary || normalized.description || "";
        normalized.detailsHtml =
          normalized.detailsHtml || normalized.details_html || normalized.description || "";
        normalized.requirementsHtml =
          normalized.requirementsHtml || normalized.requirements_html || "";
        normalized.benefitsHtml = normalized.benefitsHtml || normalized.benefits_html || "";
        normalized.applicationEmail =
          normalized.applicationEmail || normalized.application_email || "";
        normalized.applicationLink =
          normalized.applicationLink || normalized.application_link || "";
        normalized.isActive = normalized.isActive ?? normalized.is_active ?? true;
        return normalized;
      })
    : [];

  return {
    ...defaults,
    ...meta,
    banner: { ...defaults.banner, ...(meta.banner || {}) },
    hero: { ...defaults.hero, ...(meta.hero || {}) },
    lifeAtFeed: { ...defaults.lifeAtFeed, ...(meta.lifeAtFeed || {}) },
    jobsSection: { ...defaults.jobsSection, ...(meta.jobsSection || {}) },
    apply: { ...defaults.apply, ...(meta.apply || {}) },
    gallery,
    jobs,
  };
};

const normalizeKnowUsMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_KNOW_US_META);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  const historyContentHtml =
    typeof meta.history?.contentHtml === "string" && meta.history.contentHtml.trim().length > 0
      ? meta.history.contentHtml
      : Array.isArray(meta.history?.paragraphs) && meta.history.paragraphs.length > 0
        ? paragraphsToHtml(meta.history.paragraphs)
        : defaults.history.contentHtml;

  const values =
    Array.isArray(meta.valuesSection?.values) && meta.valuesSection.values.length > 0
      ? meta.valuesSection.values.map((item) => ({ ...DEFAULT_KNOW_US_VALUE, ...(item || {}) }))
      : defaults.valuesSection.values;

  const objectives =
    Array.isArray(meta.objectivesSection?.objectives) && meta.objectivesSection.objectives.length > 0
      ? meta.objectivesSection.objectives.map((item) => `${item || ""}`)
      : defaults.objectivesSection.objectives;

  const journeyContentHtml =
    typeof meta.journey?.contentHtml === "string" && meta.journey.contentHtml.trim().length > 0
      ? meta.journey.contentHtml
      : Array.isArray(meta.journey?.paragraphs) && meta.journey.paragraphs.length > 0
        ? paragraphsToHtml(meta.journey.paragraphs)
        : defaults.journey.contentHtml;

  return {
    ...defaults,
    ...meta,
    banner: { ...defaults.banner, ...(meta.banner || {}) },
    history: {
      ...defaults.history,
      ...(meta.history || {}),
      contentHtml: historyContentHtml,
    },
    aboutFeed: { ...defaults.aboutFeed, ...(meta.aboutFeed || {}) },
    visionBlock: { ...defaults.visionBlock, ...(meta.visionBlock || {}) },
    missionVision: { ...defaults.missionVision, ...(meta.missionVision || {}) },
    valuesSection: {
      ...defaults.valuesSection,
      ...(meta.valuesSection || {}),
      values,
    },
    objectivesSection: {
      ...defaults.objectivesSection,
      ...(meta.objectivesSection || {}),
      objectives,
    },
    journey: {
      ...defaults.journey,
      ...(meta.journey || {}),
      contentHtml: journeyContentHtml,
    },
  };
};

const normalizeAboutSectionMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_ABOUT_SECTION_META);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  const statsItems =
    Array.isArray(meta.stats?.items) && meta.stats.items.length > 0
      ? meta.stats.items.map((item, index) => {
          const merged = {
            ...DEFAULT_ABOUT_STAT,
            ...defaults.stats.items[index % defaults.stats.items.length],
            ...(item || {}),
          };
          const parsedNumber = Number(merged.number);
          merged.number = Number.isFinite(parsedNumber) ? parsedNumber : DEFAULT_ABOUT_STAT.number;
          return merged;
        })
      : defaults.stats.items;

  const clientItems =
    Array.isArray(meta.clients?.items) && meta.clients.items.length > 0
      ? meta.clients.items.map((item) => ({ ...DEFAULT_ABOUT_CLIENT, ...(item || {}) }))
      : defaults.clients.items;

  return {
    ...defaults,
    ...meta,
    header: { ...defaults.header, ...(meta.header || {}) },
    stats: {
      ...defaults.stats,
      ...(meta.stats || {}),
      items: statsItems,
    },
    clients: {
      ...defaults.clients,
      ...(meta.clients || {}),
      items: clientItems,
    },
  };
};

const normalizeProjectsSectionMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_PROJECTS_SECTION_META);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  return {
    ...defaults,
    ...meta,
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    messages: {
      ...defaults.messages,
      ...(meta.messages || {}),
    },
  };
};

const normalizeServicesSectionMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_SERVICES_SECTION_META);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  return {
    ...defaults,
    ...meta,
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    messages: {
      ...defaults.messages,
      ...(meta.messages || {}),
    },
  };
};

const normalizeEventsSectionMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_EVENTS_SECTION_META);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  return {
    ...defaults,
    ...meta,
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    messages: {
      ...defaults.messages,
      ...(meta.messages || {}),
    },
  };
};

const normalizeMediaSectionMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_MEDIA_SECTION_META);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  return {
    ...defaults,
    ...meta,
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    messages: {
      ...defaults.messages,
      ...(meta.messages || {}),
    },
  };
};

const normalizeAdditionalHomepageSectionMeta = (rawMeta, sectionSlug) => {
  const fallbackDefaults = {
    header: {
      badgeText: "",
      title: "",
      subtitle: "",
      ctaText: "",
      ctaLink: "",
    },
    messages: {
      loading: "",
      empty: "",
      error: "",
      note: "",
      placeholder: "",
    },
  };

  const defaults = cloneObject(ADDITIONAL_HOMEPAGE_SECTION_DEFAULTS[sectionSlug] || fallbackDefaults);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  return {
    ...defaults,
    ...meta,
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    messages: {
      ...defaults.messages,
      ...(meta.messages || {}),
    },
  };
};

const normalizeHeroSectionMeta = (rawMeta) => {
  const defaults = cloneObject(DEFAULT_HERO_SECTION_META);
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};

  const parsedBrightness = Number(meta.video?.overlayBrightness);
  const overlayBrightness = Number.isFinite(parsedBrightness)
    ? Math.min(1, Math.max(0, parsedBrightness))
    : defaults.video.overlayBrightness;

  const statsItemsRaw =
    Array.isArray(meta.stats?.items) && meta.stats.items.length > 0
      ? meta.stats.items
      : defaults.stats.items;

  const statsItems = statsItemsRaw
    .map((item) => `${item || ""}`.trim())
    .filter(Boolean);

  return {
    ...defaults,
    ...meta,
    video: {
      ...defaults.video,
      ...(meta.video || {}),
      overlayBrightness,
    },
    header: {
      ...defaults.header,
      ...(meta.header || {}),
    },
    buttons: {
      ...defaults.buttons,
      ...(meta.buttons || {}),
    },
    stats: {
      ...defaults.stats,
      ...(meta.stats || {}),
      items: statsItems.length > 0 ? statsItems : defaults.stats.items,
    },
  };
};

export default function EditPageContent({ params }) {
  const slug = params.slug;
  const isCareers = slug === "work-with-us";
  const isKnowUs = slug === "know-us";
  const isAboutSection = slug === "about-section";
  const isHeroSection = slug === "hero-section";
  const isProjectsSection = slug === "projects-section";
  const isServicesSection = slug === "services-section";
  const isEventsSection = slug === "events-section";
  const isMediaSection = slug === "media-section";
  const isAdditionalHomepageSection = ADDITIONAL_HOMEPAGE_SECTION_SLUGS.includes(slug);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image_url: "",
    meta_data: cloneObject(
      isCareers
        ? DEFAULT_CAREERS_META
        : isKnowUs
          ? DEFAULT_KNOW_US_META
          : isAboutSection
            ? DEFAULT_ABOUT_SECTION_META
            : isHeroSection
              ? DEFAULT_HERO_SECTION_META
            : isProjectsSection
              ? DEFAULT_PROJECTS_SECTION_META
            : isServicesSection
              ? DEFAULT_SERVICES_SECTION_META
            : isEventsSection
              ? DEFAULT_EVENTS_SECTION_META
            : isMediaSection
              ? DEFAULT_MEDIA_SECTION_META
            : isAdditionalHomepageSection
              ? ADDITIONAL_HOMEPAGE_SECTION_DEFAULTS[slug] || {}
            : {},
    ),
    is_published: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [expandedJobIndex, setExpandedJobIndex] = useState(null);

  const careersMeta = useMemo(
    () => normalizeCareersMeta(formData.meta_data),
    [formData.meta_data],
  );

  const knowUsMeta = useMemo(
    () => normalizeKnowUsMeta(formData.meta_data),
    [formData.meta_data],
  );

  const aboutSectionMeta = useMemo(
    () => normalizeAboutSectionMeta(formData.meta_data),
    [formData.meta_data],
  );

  const projectsSectionMeta = useMemo(
    () => normalizeProjectsSectionMeta(formData.meta_data),
    [formData.meta_data],
  );

  const servicesSectionMeta = useMemo(
    () => normalizeServicesSectionMeta(formData.meta_data),
    [formData.meta_data],
  );

  const eventsSectionMeta = useMemo(
    () => normalizeEventsSectionMeta(formData.meta_data),
    [formData.meta_data],
  );

  const mediaSectionMeta = useMemo(
    () => normalizeMediaSectionMeta(formData.meta_data),
    [formData.meta_data],
  );

  const additionalHomepageSectionMeta = useMemo(
    () => normalizeAdditionalHomepageSectionMeta(formData.meta_data, slug),
    [formData.meta_data, slug],
  );

  const heroSectionMeta = useMemo(
    () => normalizeHeroSectionMeta(formData.meta_data),
    [formData.meta_data],
  );

  useEffect(() => {
    setActiveTab("general");
    setExpandedJobIndex(null);
    fetchPage();
  }, [slug]);

  useEffect(() => {
    if (error) {
      showAdminError(error);
    }
  }, [error]);

  const fetchPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pagesApi.getBySlug(slug);
      if (response.success && response.data) {
        const nextMeta = isCareers
          ? normalizeCareersMeta(response.data.meta_data)
          : isKnowUs
            ? normalizeKnowUsMeta(response.data.meta_data)
            : isAboutSection
              ? normalizeAboutSectionMeta(response.data.meta_data)
              : isHeroSection
                ? normalizeHeroSectionMeta(response.data.meta_data)
              : isProjectsSection
                ? normalizeProjectsSectionMeta(response.data.meta_data)
              : isServicesSection
                ? normalizeServicesSectionMeta(response.data.meta_data)
              : isEventsSection
                ? normalizeEventsSectionMeta(response.data.meta_data)
              : isMediaSection
                ? normalizeMediaSectionMeta(response.data.meta_data)
              : isAdditionalHomepageSection
                ? normalizeAdditionalHomepageSectionMeta(response.data.meta_data, slug)
            : response.data.meta_data || {};

        setFormData({
          title: response.data.title || "",
          subtitle: response.data.subtitle || "",
          content: response.data.content || "",
          image_url: response.data.image_url || "",
          meta_data: nextMeta,
          is_published: response.data.is_published !== false,
        });
      }
    } catch (err) {
      console.error("Failed to load page content", err);
      const isKnownMissingSection =
        (
          isCareers ||
          isKnowUs ||
          isAboutSection ||
          isHeroSection ||
          isProjectsSection ||
          isServicesSection ||
          isEventsSection ||
          isMediaSection ||
          isAdditionalHomepageSection
        ) &&
        `${err?.message || ""}`.toLowerCase().includes("page not found");

      if (!isKnownMissingSection) {
        setError("Failed to load content. It may not exist.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const updateMetaField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      meta_data: {
        ...(prev.meta_data || {}),
        [section]: {
          ...((prev.meta_data && prev.meta_data[section]) || {}),
          [field]: value,
        },
      },
    }));
  };

  const setGallery = (gallery) => {
    setFormData((prev) => ({
      ...prev,
      meta_data: {
        ...(prev.meta_data || {}),
        gallery,
      },
    }));
  };

  const setJobs = (jobs) => {
    setFormData((prev) => ({
      ...prev,
      meta_data: {
        ...(prev.meta_data || {}),
        jobs,
      },
    }));
  };

  const setKnowUsSection = (section, value) => {
    setFormData((prev) => ({
      ...prev,
      meta_data: {
        ...(prev.meta_data || {}),
        [section]: value,
      },
    }));
  };

  const updateKnowUsValue = (index, field, value) => {
    const nextValues = [...(knowUsMeta.valuesSection?.values || [])];
    nextValues[index] = {
      ...DEFAULT_KNOW_US_VALUE,
      ...(nextValues[index] || {}),
      [field]: value,
    };
    setKnowUsSection("valuesSection", {
      ...(knowUsMeta.valuesSection || {}),
      values: nextValues,
    });
  };

  const addKnowUsValue = () => {
    setKnowUsSection("valuesSection", {
      ...(knowUsMeta.valuesSection || {}),
      values: [...(knowUsMeta.valuesSection?.values || []), { ...DEFAULT_KNOW_US_VALUE }],
    });
  };

  const removeKnowUsValue = (index) => {
    const nextValues = [...(knowUsMeta.valuesSection?.values || [])];
    nextValues.splice(index, 1);
    setKnowUsSection("valuesSection", {
      ...(knowUsMeta.valuesSection || {}),
      values: nextValues,
    });
  };

  const updateKnowUsTextListItem = (section, field, index, value) => {
    const sectionData = knowUsMeta[section] || {};
    const list = [...(sectionData[field] || [])];
    list[index] = value;
    setKnowUsSection(section, {
      ...sectionData,
      [field]: list,
    });
  };

  const addKnowUsTextListItem = (section, field, defaultValue = "") => {
    const sectionData = knowUsMeta[section] || {};
    setKnowUsSection(section, {
      ...sectionData,
      [field]: [...(sectionData[field] || []), defaultValue],
    });
  };

  const removeKnowUsTextListItem = (section, field, index) => {
    const sectionData = knowUsMeta[section] || {};
    const list = [...(sectionData[field] || [])];
    list.splice(index, 1);
    setKnowUsSection(section, {
      ...sectionData,
      [field]: list,
    });
  };

  const handleImageUpload = async (e, target = "featured", index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    try {
      setSaving(true);
      const res = await uploadApi.single(file);

      if (!res.success) {
        setError("Failed to upload file");
        return;
      }

      const imageUrl = res.data?.url || res.url || "";

      if (target === "gallery" && index !== null) {
        const nextGallery = [...careersMeta.gallery];
        nextGallery[index] = {
          ...nextGallery[index],
          src: imageUrl,
        };
        setGallery(nextGallery);
        return;
      }

      if (target === "bannerBackground") {
        updateMetaField("banner", "backgroundImage", imageUrl);
        return;
      }

      if (target === "heroImage") {
        updateMetaField("hero", "image", imageUrl);
        return;
      }

      if (target === "heroVideo") {
        updateMetaField("video", "src", imageUrl);
        return;
      }

      if (target === "knowUsBannerBackground") {
        updateMetaField("banner", "backgroundImage", imageUrl);
        return;
      }

      if (target === "knowUsHistoryImage") {
        updateMetaField("history", "image", imageUrl);
        return;
      }

      if (target === "knowUsAboutImage") {
        updateMetaField("aboutFeed", "image", imageUrl);
        return;
      }

      if (target === "knowUsVisionImage") {
        updateMetaField("visionBlock", "image", imageUrl);
        return;
      }

      if (target === "aboutSectionImage") {
        updateMetaField("header", "image", imageUrl);
        return;
      }

      if (target === "aboutClientLogo" && index !== null) {
        const nextClients = [...(aboutSectionMeta.clients?.items || [])];
        nextClients[index] = {
          ...DEFAULT_ABOUT_CLIENT,
          ...(nextClients[index] || {}),
          logo: imageUrl,
        };
        setAboutClients(nextClients);
        return;
      }

      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
    } catch (err) {
      console.error(err);
      setError("Error uploading file");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        meta_data: isCareers
          ? normalizeCareersMeta(formData.meta_data)
          : isKnowUs
            ? normalizeKnowUsMeta(formData.meta_data)
            : isAboutSection
              ? normalizeAboutSectionMeta(formData.meta_data)
              : isHeroSection
                ? normalizeHeroSectionMeta(formData.meta_data)
              : isProjectsSection
                ? normalizeProjectsSectionMeta(formData.meta_data)
              : isServicesSection
                ? normalizeServicesSectionMeta(formData.meta_data)
              : isEventsSection
                ? normalizeEventsSectionMeta(formData.meta_data)
              : isMediaSection
                ? normalizeMediaSectionMeta(formData.meta_data)
              : isAdditionalHomepageSection
                ? normalizeAdditionalHomepageSectionMeta(formData.meta_data, slug)
            : formData.meta_data,
      };

      const response = await pagesApi.update(slug, payload);
      if (response.success) {
        showAdminSuccess("Changes saved. The section content has been updated.");
      } else {
        setError(response.message || "Error saving content");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const addJob = () => {
    const newJob = {
      ...DEFAULT_JOB,
      id: `job-${Date.now()}`,
      slug: `job-${Date.now()}`,
    };
    setJobs([...(careersMeta.jobs || []), newJob]);
    setExpandedJobIndex((careersMeta.jobs || []).length);
  };

  const updateJobField = (index, field, value) => {
    const nextJobs = [...(careersMeta.jobs || [])];
    const current = { ...nextJobs[index] };
    const previousTitle = current.title || "";
    current[field] = value;

    if (field === "title") {
      const previousAutoSlug = slugify(previousTitle);
      if (!current.slug || current.slug === previousAutoSlug) {
        current.slug = slugify(value);
      }
    }

    nextJobs[index] = current;
    setJobs(nextJobs);
  };

  const removeJob = (index) => {
    const nextJobs = [...(careersMeta.jobs || [])];
    nextJobs.splice(index, 1);
    setJobs(nextJobs);
    setExpandedJobIndex((prev) => (prev === index ? null : prev));
  };

  const addGalleryImage = () => {
    setGallery([...(careersMeta.gallery || []), { ...DEFAULT_GALLERY_ITEM }]);
  };

  const updateGallery = (index, field, value) => {
    const nextGallery = [...(careersMeta.gallery || [])];
    nextGallery[index] = {
      ...nextGallery[index],
      [field]: value,
    };
    setGallery(nextGallery);
  };

  const removeGallery = (index) => {
    const nextGallery = [...(careersMeta.gallery || [])];
    nextGallery.splice(index, 1);
    setGallery(nextGallery);
  };

  const setAboutStats = (items) => {
    setFormData((prev) => ({
      ...prev,
      meta_data: {
        ...(prev.meta_data || {}),
        stats: {
          ...((prev.meta_data && prev.meta_data.stats) || {}),
          items,
        },
      },
    }));
  };

  const setAboutClients = (items) => {
    setFormData((prev) => ({
      ...prev,
      meta_data: {
        ...(prev.meta_data || {}),
        clients: {
          ...((prev.meta_data && prev.meta_data.clients) || {}),
          items,
        },
      },
    }));
  };

  const updateAboutStat = (index, field, value) => {
    const next = [...(aboutSectionMeta.stats?.items || [])];
    next[index] = {
      ...DEFAULT_ABOUT_STAT,
      ...(next[index] || {}),
      [field]: field === "number" ? Number(value) || 0 : value,
    };
    setAboutStats(next);
  };

  const addAboutStat = () => {
    setAboutStats([...(aboutSectionMeta.stats?.items || []), { ...DEFAULT_ABOUT_STAT }]);
  };

  const removeAboutStat = (index) => {
    const next = [...(aboutSectionMeta.stats?.items || [])];
    next.splice(index, 1);
    setAboutStats(next);
  };

  const updateAboutClient = (index, field, value) => {
    const next = [...(aboutSectionMeta.clients?.items || [])];
    next[index] = {
      ...DEFAULT_ABOUT_CLIENT,
      ...(next[index] || {}),
      [field]: value,
    };
    setAboutClients(next);
  };

  const addAboutClient = () => {
    setAboutClients([...(aboutSectionMeta.clients?.items || []), { ...DEFAULT_ABOUT_CLIENT }]);
  };

  const removeAboutClient = (index) => {
    const next = [...(aboutSectionMeta.clients?.items || [])];
    next.splice(index, 1);
    setAboutClients(next);
  };

  const setHeroStats = (items) => {
    setFormData((prev) => ({
      ...prev,
      meta_data: {
        ...(prev.meta_data || {}),
        stats: {
          ...((prev.meta_data && prev.meta_data.stats) || {}),
          items,
        },
      },
    }));
  };

  const updateHeroStat = (index, value) => {
    const next = [...(heroSectionMeta.stats?.items || [])];
    next[index] = value;
    setHeroStats(next);
  };

  const addHeroStat = () => {
    setHeroStats([...(heroSectionMeta.stats?.items || []), DEFAULT_HERO_ROTATING_STAT]);
  };

  const removeHeroStat = (index) => {
    const next = [...(heroSectionMeta.stats?.items || [])];
    next.splice(index, 1);
    setHeroStats(next.length > 0 ? next : [DEFAULT_HERO_ROTATING_STAT]);
  };

  const tabs = [
    { id: "general", label: "General Info", icon: Settings },
    ...(isCareers
      ? [
          { id: "banner", label: "Banner", icon: LayoutTemplate },
          { id: "hero", label: "Hero & Sections", icon: FileText },
          { id: "jobs", label: "Job Postings", icon: Briefcase },
          { id: "gallery", label: "Gallery Photos", icon: ImageIcon },
          { id: "apply", label: "Apply CTA", icon: CheckCircle2 },
        ]
      : isKnowUs
        ? [
            { id: "banner", label: "Banner", icon: LayoutTemplate },
            { id: "story", label: "Story Sections", icon: FileText },
            { id: "mission", label: "Mission & Vision", icon: CheckCircle2 },
            { id: "values", label: "Core Values", icon: Briefcase },
            { id: "objectives", label: "Objectives", icon: Settings },
            { id: "journey", label: "Journey", icon: ImageIcon },
          ]
        : isAboutSection
          ? [
              { id: "header", label: "Header & CTA", icon: LayoutTemplate },
              { id: "stats", label: "Stats", icon: CheckCircle2 },
              { id: "clients", label: "Clients", icon: ImageIcon },
            ]
          : isHeroSection
            ? [
                { id: "hero", label: "Hero Content", icon: LayoutTemplate },
                { id: "stats", label: "Ticker Stats", icon: CheckCircle2 },
              ]
          : isProjectsSection
            ? [
                { id: "header", label: "Header & CTA", icon: LayoutTemplate },
                { id: "messages", label: "State Messages", icon: FileText },
              ]
          : isServicesSection || isEventsSection || isMediaSection
            ? [
                { id: "header", label: "Header & CTA", icon: LayoutTemplate },
                { id: "messages", label: "State Messages", icon: FileText },
              ]
          : isAdditionalHomepageSection
            ? [
                { id: "header", label: "Header & CTA", icon: LayoutTemplate },
                { id: "messages", label: "Messages", icon: FileText },
              ]
      : []),
  ];

  const pageTitle = {
    "hero-section": "Hero Section (Home Page)",
    "about-section": "About Us Section (Home Page)",
    "projects-section": "Projects Section (Home Page)",
    "services-section": "Services Section (Home Page)",
    "events-section": "Events Section (Home Page)",
    "media-section": "Media Section (Home Page)",
    "publications-section": "Publications Section (Home Page)",
    "timeline-section": "Timeline Section (Home Page)",
    "working-areas-section": "Working Areas Section (Home Page)",
    "contact-section": "Contact Section (Home Page)",
    "newsletter-section": "Newsletter Section (Home Page)",
    "about-page": "About Us Page (Legacy)",
    "work-with-us": "Work With Us (Careers)",
    "know-us": "Know Us (About Page Content)",
  }[slug] || `Edit ${slug}`;

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500">Loading editor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/pages"
            className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-[#14234b] hover:bg-[#0f1b3b] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 flex items-center gap-2 ${
                active
                  ? "border-[#14234b] text-[#14234b]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === "general" && (
          <div className="space-y-6">
            {isCareers && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                Banner, hero, gallery, jobs, and apply text for Work With Us are editable in the other tabs.
              </div>
            )}

            {isKnowUs && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                Banner, story sections, mission/vision, values, objectives, and journey content are editable in the other tabs.
              </div>
            )}

            {isAboutSection && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                Homepage About section content, stats, and clients are editable in the Header, Stats, and Clients tabs.
              </div>
            )}

            {isProjectsSection && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                Homepage Projects section texts are editable in Header and State Messages tabs.
              </div>
            )}

            {isServicesSection && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                Homepage Services section heading, button, and loading/empty/error messages are editable in Header and State Messages tabs.
              </div>
            )}

            {isEventsSection && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                Homepage Events section heading, button, and loading/empty/error/fallback messages are editable in Header and State Messages tabs.
              </div>
            )}

            {isMediaSection && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                Homepage Media section heading, button, and loading/empty/error messages are editable in Header and State Messages tabs.
              </div>
            )}

            {isAdditionalHomepageSection && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                This homepage section is editable in Header & CTA and Messages tabs.
              </div>
            )}

            {isHeroSection && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-800">
                Homepage hero video, text, buttons, and rotating ticker stats are editable in the Hero Content and Ticker Stats tabs.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#14234b] focus:border-[#14234b]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (Optional)</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#14234b] focus:border-[#14234b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Hero Image</label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                    <img
                      src={withMediaOrigin(formData.image_url)}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "featured")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
              <div className="border rounded-md custom-quill-container bg-white" style={{ minHeight: "400px" }}>
                <BasicRichTextEditor
                  value={formData.content || ""}
                  onChange={handleEditorChange}
                  placeholder="Write the page content here..."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#14234b] rounded"
                />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700 font-medium">
                  Published (Visible to public)
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "banner" && isCareers && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Career Banner Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={careersMeta.banner.badgeText}
                  onChange={(e) => updateMetaField("banner", "badgeText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
                <input
                  type="text"
                  value={careersMeta.banner.title}
                  onChange={(e) => updateMetaField("banner", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Subtitle</label>
              <textarea
                value={careersMeta.banner.subtitle}
                onChange={(e) => updateMetaField("banner", "subtitle", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Description</label>
              <textarea
                value={careersMeta.banner.description}
                onChange={(e) => updateMetaField("banner", "description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Background Image</label>
              <div className="flex items-center gap-4">
                {careersMeta.banner.backgroundImage && (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                    <img
                      src={withMediaOrigin(careersMeta.banner.backgroundImage)}
                      alt="Banner background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "bannerBackground")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "hero" && isCareers && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Hero And Section Content</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Heading</label>
                <input
                  type="text"
                  value={careersMeta.hero.title}
                  onChange={(e) => updateMetaField("hero", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subheading</label>
                <input
                  type="text"
                  value={careersMeta.hero.subtitle}
                  onChange={(e) => updateMetaField("hero", "subtitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description</label>
              <textarea
                value={careersMeta.hero.description}
                onChange={(e) => updateMetaField("hero", "description", e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Section Image</label>
              <div className="flex items-center gap-4">
                {careersMeta.hero.image && (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                    <img
                      src={withMediaOrigin(careersMeta.hero.image)}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "heroImage")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Life At FEED Title</label>
                <input
                  type="text"
                  value={careersMeta.lifeAtFeed.title}
                  onChange={(e) => updateMetaField("lifeAtFeed", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Open Positions Section Title</label>
                <input
                  type="text"
                  value={careersMeta.jobsSection.title}
                  onChange={(e) => updateMetaField("jobsSection", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Life At FEED Description</label>
                <textarea
                  value={careersMeta.lifeAtFeed.description}
                  onChange={(e) => updateMetaField("lifeAtFeed", "description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Open Positions Section Description</label>
                <textarea
                  value={careersMeta.jobsSection.description}
                  onChange={(e) => updateMetaField("jobsSection", "description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && isCareers && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Detailed Job Postings</h3>
              <button
                type="button"
                onClick={addJob}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> Add Job Post
              </button>
            </div>

            {careersMeta.jobs.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 border-2 border-dashed rounded-lg text-gray-500">
                No job postings yet. Add one and publish detailed role content.
              </div>
            ) : (
              <div className="space-y-6">
                {careersMeta.jobs.map((job, index) => {
                  const expanded = expandedJobIndex === index;
                  return (
                    <div key={job.id || index} className="border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {job.title || `Untitled Job #${index + 1}`}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {job.slug || "job-slug"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setExpandedJobIndex(expanded ? null : index)}
                            className="text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-2 rounded-md text-sm flex items-center gap-1"
                          >
                            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            {expanded ? "Collapse" : "Expand"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeJob(index)}
                            className="text-red-600 hover:text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md text-sm flex items-center gap-1"
                          >
                            <Trash2 size={15} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                              type="text"
                              value={job.title}
                              onChange={(e) => updateJobField(index, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Job Slug</label>
                            <input
                              type="text"
                              value={job.slug}
                              onChange={(e) => updateJobField(index, "slug", slugify(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                            <input
                              type="text"
                              value={job.department}
                              onChange={(e) => updateJobField(index, "department", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                            <input
                              type="text"
                              value={job.location}
                              onChange={(e) => updateJobField(index, "location", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={job.type}
                              onChange={(e) => updateJobField(index, "type", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Consultant">Consultant</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Experience</label>
                            <input
                              type="text"
                              value={job.experience}
                              onChange={(e) => updateJobField(index, "experience", e.target.value)}
                              placeholder="e.g. 3+ years"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Salary / Range</label>
                            <input
                              type="text"
                              value={job.salary}
                              onChange={(e) => updateJobField(index, "salary", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Deadline</label>
                            <input
                              type="date"
                              value={job.deadline}
                              onChange={(e) => updateJobField(index, "deadline", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Application Email</label>
                            <input
                              type="email"
                              value={job.applicationEmail}
                              onChange={(e) => updateJobField(index, "applicationEmail", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Application Link</label>
                          <input
                            type="text"
                            value={job.applicationLink}
                            onChange={(e) => updateJobField(index, "applicationLink", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Short Summary (card preview)</label>
                          <textarea
                            value={job.summary}
                            onChange={(e) => updateJobField(index, "summary", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            id={`job-active-${index}`}
                            type="checkbox"
                            checked={job.isActive}
                            onChange={(e) => updateJobField(index, "isActive", e.target.checked)}
                            className="h-4 w-4 text-[#14234b] rounded"
                          />
                          <label htmlFor={`job-active-${index}`} className="text-sm text-gray-700">
                            Active and visible on careers page
                          </label>
                        </div>

                        {expanded && (
                          <div className="space-y-6 pt-4 border-t border-gray-200">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Detailed Job Description
                              </label>
                              <div className="border rounded-md bg-white" style={{ minHeight: "220px" }}>
                                <BasicRichTextEditor
                                  value={job.detailsHtml || ""}
                                  onChange={(html) => updateJobField(index, "detailsHtml", html)}
                                  placeholder="Write a detailed job description..."
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                              <div className="border rounded-md bg-white" style={{ minHeight: "220px" }}>
                                <BasicRichTextEditor
                                  value={job.requirementsHtml || ""}
                                  onChange={(html) => updateJobField(index, "requirementsHtml", html)}
                                  placeholder="List qualifications and requirements..."
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                              <div className="border rounded-md bg-white" style={{ minHeight: "220px" }}>
                                <BasicRichTextEditor
                                  value={job.benefitsHtml || ""}
                                  onChange={(html) => updateJobField(index, "benefitsHtml", html)}
                                  placeholder="Describe compensation and benefits..."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "gallery" && isCareers && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Life at FEED Photo Gallery</h3>
              <button
                type="button"
                onClick={addGalleryImage}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> Add Photo
              </button>
            </div>

            {careersMeta.gallery.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 border-2 border-dashed rounded-lg text-gray-500">
                No gallery photos added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {careersMeta.gallery.map((img, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                    <div className="w-1/3 flex flex-col gap-2">
                      {img.src ? (
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={withMediaOrigin(img.src)}
                            alt={img.title || "Gallery image"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center p-2">
                          No Image
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "gallery", index)}
                        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-200"
                      />
                    </div>

                    <div className="w-2/3 flex flex-col gap-3 relative">
                      <button
                        type="button"
                        onClick={() => removeGallery(index)}
                        className="absolute top-0 right-0 text-red-500 hover:bg-red-100 p-1 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Overlay Title</label>
                        <input
                          type="text"
                          value={img.title}
                          onChange={(e) => updateGallery(index, "title", e.target.value)}
                          className="w-[85%] px-2 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Sub-text</label>
                        <input
                          type="text"
                          value={img.description}
                          onChange={(e) => updateGallery(index, "description", e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Grid Layout Span (CSS)</label>
                        <select
                          value={img.span}
                          onChange={(e) => updateGallery(index, "span", e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        >
                          <option value="md:col-span-1 md:row-span-1">1x1 Current (Small)</option>
                          <option value="md:col-span-2 md:row-span-1">2x1 Wide</option>
                          <option value="md:col-span-1 md:row-span-2">1x2 Tall</option>
                          <option value="md:col-span-2 md:row-span-2">2x2 Large Block</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "apply" && isCareers && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Apply Section Content</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apply Title</label>
              <input
                type="text"
                value={careersMeta.apply.title}
                onChange={(e) => updateMetaField("apply", "title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apply Description</label>
              <textarea
                value={careersMeta.apply.description}
                onChange={(e) => updateMetaField("apply", "description", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={careersMeta.apply.buttonText}
                  onChange={(e) => updateMetaField("apply", "buttonText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={careersMeta.apply.buttonLink}
                  onChange={(e) => updateMetaField("apply", "buttonLink", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "hero" && isHeroSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Homepage Hero Content</h3>

            <div className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50">
              <h4 className="font-semibold text-gray-800">Video Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Source URL / Path</label>
                  <input
                    type="text"
                    value={heroSectionMeta.video.src}
                    onChange={(e) => updateMetaField("video", "src", e.target.value)}
                    placeholder="/hero-video.mp4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Poster (Optional)</label>
                  <input
                    type="text"
                    value={heroSectionMeta.video.poster}
                    onChange={(e) => updateMetaField("video", "poster", e.target.value)}
                    placeholder="/hero-poster.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Brightness Overlay (0 to 1)</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={heroSectionMeta.video.overlayBrightness}
                  onChange={(e) =>
                    updateMetaField("video", "overlayBrightness", Math.min(1, Math.max(0, Number(e.target.value) || 0)))
                  }
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Hero Video (MP4 / WEBM)</label>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) => handleImageUpload(e, "heroVideo")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Uploading a video will automatically set the Video Source URL field to the uploaded file path.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 space-y-4">
              <h4 className="font-semibold text-gray-800">Hero Text Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                  <input
                    type="text"
                    value={heroSectionMeta.header.badgeText}
                    onChange={(e) => updateMetaField("header", "badgeText", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                  <input
                    type="text"
                    value={heroSectionMeta.header.title}
                    onChange={(e) => updateMetaField("header", "title", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 space-y-4">
              <h4 className="font-semibold text-gray-800">Hero Buttons</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Text</label>
                  <input
                    type="text"
                    value={heroSectionMeta.buttons.primaryText}
                    onChange={(e) => updateMetaField("buttons", "primaryText", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Link</label>
                  <input
                    type="text"
                    value={heroSectionMeta.buttons.primaryLink}
                    onChange={(e) => updateMetaField("buttons", "primaryLink", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
                  <input
                    type="text"
                    value={heroSectionMeta.buttons.secondaryText}
                    onChange={(e) => updateMetaField("buttons", "secondaryText", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Link</label>
                  <input
                    type="text"
                    value={heroSectionMeta.buttons.secondaryLink}
                    onChange={(e) => updateMetaField("buttons", "secondaryLink", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "header" && isAboutSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Homepage About Header</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={aboutSectionMeta.header.badgeText}
                  onChange={(e) => updateMetaField("header", "badgeText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
                <input
                  type="text"
                  value={aboutSectionMeta.header.title}
                  onChange={(e) => updateMetaField("header", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={aboutSectionMeta.header.description}
                onChange={(e) => updateMetaField("header", "description", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={aboutSectionMeta.header.ctaText}
                  onChange={(e) => updateMetaField("header", "ctaText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                <input
                  type="text"
                  value={aboutSectionMeta.header.ctaLink}
                  onChange={(e) => updateMetaField("header", "ctaLink", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Image</label>
              <div className="flex items-center gap-4">
                {aboutSectionMeta.header.image && (
                  <div className="relative w-56 h-36 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                    <img
                      src={withMediaOrigin(aboutSectionMeta.header.image)}
                      alt="About section"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "aboutSectionImage")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "header" && isProjectsSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Homepage Projects Header</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={projectsSectionMeta.header.badgeText}
                  onChange={(e) => updateMetaField("header", "badgeText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={projectsSectionMeta.header.title}
                  onChange={(e) => updateMetaField("header", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Description</label>
              <textarea
                rows={4}
                value={projectsSectionMeta.header.subtitle}
                onChange={(e) => updateMetaField("header", "subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={projectsSectionMeta.header.ctaText}
                  onChange={(e) => updateMetaField("header", "ctaText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={projectsSectionMeta.header.ctaLink}
                  onChange={(e) => updateMetaField("header", "ctaLink", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && isProjectsSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Projects Section State Messages</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loading Message</label>
              <input
                type="text"
                value={projectsSectionMeta.messages.loading}
                onChange={(e) => updateMetaField("messages", "loading", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empty State Message</label>
              <input
                type="text"
                value={projectsSectionMeta.messages.empty}
                onChange={(e) => updateMetaField("messages", "empty", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Error State Message</label>
              <input
                type="text"
                value={projectsSectionMeta.messages.error}
                onChange={(e) => updateMetaField("messages", "error", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {activeTab === "header" && isServicesSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Homepage Services Header</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={servicesSectionMeta.header.badgeText}
                  onChange={(e) => updateMetaField("header", "badgeText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={servicesSectionMeta.header.title}
                  onChange={(e) => updateMetaField("header", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Description</label>
              <textarea
                rows={4}
                value={servicesSectionMeta.header.subtitle}
                onChange={(e) => updateMetaField("header", "subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={servicesSectionMeta.header.ctaText}
                  onChange={(e) => updateMetaField("header", "ctaText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={servicesSectionMeta.header.ctaLink}
                  onChange={(e) => updateMetaField("header", "ctaLink", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && isServicesSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Services Section State Messages</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loading Message</label>
              <input
                type="text"
                value={servicesSectionMeta.messages.loading}
                onChange={(e) => updateMetaField("messages", "loading", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empty State Message</label>
              <input
                type="text"
                value={servicesSectionMeta.messages.empty}
                onChange={(e) => updateMetaField("messages", "empty", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Error State Message</label>
              <input
                type="text"
                value={servicesSectionMeta.messages.error}
                onChange={(e) => updateMetaField("messages", "error", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {activeTab === "header" && isEventsSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Homepage Events Header</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={eventsSectionMeta.header.badgeText}
                  onChange={(e) => updateMetaField("header", "badgeText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={eventsSectionMeta.header.title}
                  onChange={(e) => updateMetaField("header", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Description</label>
              <textarea
                rows={4}
                value={eventsSectionMeta.header.subtitle}
                onChange={(e) => updateMetaField("header", "subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={eventsSectionMeta.header.ctaText}
                  onChange={(e) => updateMetaField("header", "ctaText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={eventsSectionMeta.header.ctaLink}
                  onChange={(e) => updateMetaField("header", "ctaLink", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && isEventsSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Events Section State Messages</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loading Message</label>
              <input
                type="text"
                value={eventsSectionMeta.messages.loading}
                onChange={(e) => updateMetaField("messages", "loading", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fallback Subtitle (when no upcoming events)</label>
              <input
                type="text"
                value={eventsSectionMeta.messages.fallbackSubtitle}
                onChange={(e) => updateMetaField("messages", "fallbackSubtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empty State Message</label>
              <input
                type="text"
                value={eventsSectionMeta.messages.empty}
                onChange={(e) => updateMetaField("messages", "empty", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Error State Message</label>
              <input
                type="text"
                value={eventsSectionMeta.messages.error}
                onChange={(e) => updateMetaField("messages", "error", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {activeTab === "header" && isMediaSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Homepage Media Header</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={mediaSectionMeta.header.badgeText}
                  onChange={(e) => updateMetaField("header", "badgeText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={mediaSectionMeta.header.title}
                  onChange={(e) => updateMetaField("header", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Description</label>
              <textarea
                rows={4}
                value={mediaSectionMeta.header.subtitle}
                onChange={(e) => updateMetaField("header", "subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={mediaSectionMeta.header.ctaText}
                  onChange={(e) => updateMetaField("header", "ctaText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={mediaSectionMeta.header.ctaLink}
                  onChange={(e) => updateMetaField("header", "ctaLink", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && isMediaSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Media Section State Messages</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loading Message</label>
              <input
                type="text"
                value={mediaSectionMeta.messages.loading}
                onChange={(e) => updateMetaField("messages", "loading", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empty State Message</label>
              <input
                type="text"
                value={mediaSectionMeta.messages.empty}
                onChange={(e) => updateMetaField("messages", "empty", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Error State Message</label>
              <input
                type="text"
                value={mediaSectionMeta.messages.error}
                onChange={(e) => updateMetaField("messages", "error", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {activeTab === "header" && isAdditionalHomepageSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Homepage Section Header</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={additionalHomepageSectionMeta.header.badgeText}
                  onChange={(e) => updateMetaField("header", "badgeText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={additionalHomepageSectionMeta.header.title}
                  onChange={(e) => updateMetaField("header", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Description</label>
              <textarea
                rows={4}
                value={additionalHomepageSectionMeta.header.subtitle}
                onChange={(e) => updateMetaField("header", "subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={additionalHomepageSectionMeta.header.ctaText}
                  onChange={(e) => updateMetaField("header", "ctaText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link (optional)</label>
                <input
                  type="text"
                  value={additionalHomepageSectionMeta.header.ctaLink}
                  onChange={(e) => updateMetaField("header", "ctaLink", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && isAdditionalHomepageSection && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Homepage Section Messages</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loading Message</label>
              <input
                type="text"
                value={additionalHomepageSectionMeta.messages.loading}
                onChange={(e) => updateMetaField("messages", "loading", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empty State Message</label>
              <input
                type="text"
                value={additionalHomepageSectionMeta.messages.empty}
                onChange={(e) => updateMetaField("messages", "empty", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Error Message</label>
              <input
                type="text"
                value={additionalHomepageSectionMeta.messages.error}
                onChange={(e) => updateMetaField("messages", "error", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extra Note / Helper Text</label>
              <input
                type="text"
                value={additionalHomepageSectionMeta.messages.note}
                onChange={(e) => updateMetaField("messages", "note", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Input Placeholder (if used)</label>
              <input
                type="text"
                value={additionalHomepageSectionMeta.messages.placeholder}
                onChange={(e) => updateMetaField("messages", "placeholder", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {activeTab === "stats" && isHeroSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Hero Ticker Stats</h3>
              <button
                type="button"
                onClick={addHeroStat}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Stat Line
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stats Card Title</label>
              <input
                type="text"
                value={heroSectionMeta.stats.title}
                onChange={(e) => updateMetaField("stats", "title", e.target.value)}
                className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="space-y-3">
              {(heroSectionMeta.stats.items || []).map((item, index) => (
                <div key={`hero-stat-${index}`} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-500">Ticker Line #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeHeroStat(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateHeroStat(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && isAboutSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Impact Stats</h3>
              <button
                type="button"
                onClick={addAboutStat}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Stat
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={aboutSectionMeta.stats.title}
                  onChange={(e) => updateMetaField("stats", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <input
                  type="text"
                  value={aboutSectionMeta.stats.subtitle}
                  onChange={(e) => updateMetaField("stats", "subtitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-4">
              {(aboutSectionMeta.stats.items || []).map((item, index) => (
                <div key={`about-stat-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-800">Stat #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeAboutStat(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Number</label>
                      <input
                        type="number"
                        value={item.number}
                        onChange={(e) => updateAboutStat(index, "number", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Suffix</label>
                      <input
                        type="text"
                        value={item.suffix}
                        onChange={(e) => updateAboutStat(index, "suffix", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateAboutStat(index, "label", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                      <select
                        value={item.icon}
                        onChange={(e) => updateAboutStat(index, "icon", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="award">Award</option>
                        <option value="target">Target</option>
                        <option value="globe">Globe</option>
                        <option value="users">Users</option>
                        <option value="eye">Eye</option>
                        <option value="lightbulb">Lightbulb</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "clients" && isAboutSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Clients Marquee</h3>
              <button
                type="button"
                onClick={addAboutClient}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Client
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={aboutSectionMeta.clients.title}
                  onChange={(e) => updateMetaField("clients", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <input
                  type="text"
                  value={aboutSectionMeta.clients.subtitle}
                  onChange={(e) => updateMetaField("clients", "subtitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-4">
              {(aboutSectionMeta.clients.items || []).map((client, index) => (
                <div key={`about-client-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                  <div className="w-40 shrink-0">
                    {client.logo ? (
                      <div className="relative w-full h-24 rounded-md overflow-hidden border bg-white">
                        <img
                          src={withMediaOrigin(client.logo)}
                          alt={client.name || "Client logo"}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-md bg-gray-200 text-gray-500 text-xs flex items-center justify-center">
                        No Logo
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "aboutClientLogo", index)}
                      className="mt-2 block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-200"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-3">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                        <input
                          type="text"
                          value={client.name}
                          onChange={(e) => updateAboutClient(index, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAboutClient(index)}
                        className="text-red-600 hover:text-red-700 mt-7"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "banner" && isKnowUs && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Know Us Banner Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={knowUsMeta.banner.badgeText}
                  onChange={(e) => updateMetaField("banner", "badgeText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={knowUsMeta.banner.title}
                  onChange={(e) => updateMetaField("banner", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (Optional)</label>
              <input
                type="text"
                value={knowUsMeta.banner.subtitle}
                onChange={(e) => updateMetaField("banner", "subtitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={knowUsMeta.banner.description}
                onChange={(e) => updateMetaField("banner", "description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Background Image</label>
              <div className="flex items-center gap-4">
                {knowUsMeta.banner.backgroundImage && (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                    <img
                      src={withMediaOrigin(knowUsMeta.banner.backgroundImage)}
                      alt="Know us banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "knowUsBannerBackground")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "story" && isKnowUs && (
          <div className="space-y-8">
            <div className="border border-gray-200 rounded-lg p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">How We Started Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                  <input
                    type="text"
                    value={knowUsMeta.history.heading}
                    onChange={(e) => updateMetaField("history", "heading", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                  <input
                    type="text"
                    value={knowUsMeta.history.subheading}
                    onChange={(e) => updateMetaField("history", "subheading", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={knowUsMeta.history.buttonText}
                    onChange={(e) => updateMetaField("history", "buttonText", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    value={knowUsMeta.history.buttonLink}
                    onChange={(e) => updateMetaField("history", "buttonLink", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Image</label>
                <div className="flex items-center gap-4">
                  {knowUsMeta.history.image && (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                      <img
                        src={withMediaOrigin(knowUsMeta.history.image)}
                        alt="History"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "knowUsHistoryImage")}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
                <div className="border rounded-md bg-white" style={{ minHeight: "260px" }}>
                  <BasicRichTextEditor
                    value={knowUsMeta.history.contentHtml || ""}
                    onChange={(html) => updateMetaField("history", "contentHtml", html)}
                    placeholder="Write the complete How We Started content..."
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">About FEED Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eyebrow Label</label>
                  <input
                    type="text"
                    value={knowUsMeta.aboutFeed.sectionEyebrow}
                    onChange={(e) => updateMetaField("aboutFeed", "sectionEyebrow", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={knowUsMeta.aboutFeed.sectionTitle}
                    onChange={(e) => updateMetaField("aboutFeed", "sectionTitle", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Intro Paragraph</label>
                <textarea
                  rows={4}
                  value={knowUsMeta.aboutFeed.intro}
                  onChange={(e) => updateMetaField("aboutFeed", "intro", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                <textarea
                  rows={6}
                  value={knowUsMeta.aboutFeed.details}
                  onChange={(e) => updateMetaField("aboutFeed", "details", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Image</label>
                <div className="flex items-center gap-4">
                  {knowUsMeta.aboutFeed.image && (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                      <img
                        src={withMediaOrigin(knowUsMeta.aboutFeed.image)}
                        alt="About feed"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "knowUsAboutImage")}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Vision Narrative Section</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Narrative Text</label>
                <textarea
                  rows={6}
                  value={knowUsMeta.visionBlock.description}
                  onChange={(e) => updateMetaField("visionBlock", "description", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Image</label>
                <div className="flex items-center gap-4">
                  {knowUsMeta.visionBlock.image && (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                      <img
                        src={withMediaOrigin(knowUsMeta.visionBlock.image)}
                        alt="Vision"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "knowUsVisionImage")}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mission" && isKnowUs && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Mission And Vision Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Mission Title</label>
                <input
                  type="text"
                  value={knowUsMeta.missionVision.missionTitle}
                  onChange={(e) => updateMetaField("missionVision", "missionTitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <label className="block text-sm font-medium text-gray-700">Mission Description</label>
                <textarea
                  rows={5}
                  value={knowUsMeta.missionVision.missionDescription}
                  onChange={(e) => updateMetaField("missionVision", "missionDescription", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Vision Title</label>
                <input
                  type="text"
                  value={knowUsMeta.missionVision.visionTitle}
                  onChange={(e) => updateMetaField("missionVision", "visionTitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <label className="block text-sm font-medium text-gray-700">Vision Description</label>
                <textarea
                  rows={5}
                  value={knowUsMeta.missionVision.visionDescription}
                  onChange={(e) => updateMetaField("missionVision", "visionDescription", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "values" && isKnowUs && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Core Values Section</h3>
              <button
                type="button"
                onClick={addKnowUsValue}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Value
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={knowUsMeta.valuesSection.title}
                  onChange={(e) => updateMetaField("valuesSection", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
                <input
                  type="text"
                  value={knowUsMeta.valuesSection.description}
                  onChange={(e) => updateMetaField("valuesSection", "description", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(knowUsMeta.valuesSection.values || []).map((value, index) => (
                <div key={`value-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeKnowUsValue(index)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Value Title</label>
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => updateKnowUsValue(index, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Value Description</label>
                    <textarea
                      rows={3}
                      value={value.description}
                      onChange={(e) => updateKnowUsValue(index, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "objectives" && isKnowUs && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Objectives Section</h3>
              <button
                type="button"
                onClick={() => addKnowUsTextListItem("objectivesSection", "objectives", "")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Objective
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={knowUsMeta.objectivesSection.title}
                  onChange={(e) => updateMetaField("objectivesSection", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
                <input
                  type="text"
                  value={knowUsMeta.objectivesSection.description}
                  onChange={(e) => updateMetaField("objectivesSection", "description", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-3">
              {(knowUsMeta.objectivesSection.objectives || []).map((objective, index) => (
                <div key={`objective-${index}`} className="border border-gray-200 rounded-md p-3 bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500">Objective #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeKnowUsTextListItem("objectivesSection", "objectives", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={objective}
                    onChange={(e) =>
                      updateKnowUsTextListItem("objectivesSection", "objectives", index, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "journey" && isKnowUs && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Journey Section</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={knowUsMeta.journey.title}
                  onChange={(e) => updateMetaField("journey", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
                <input
                  type="text"
                  value={knowUsMeta.journey.description}
                  onChange={(e) => updateMetaField("journey", "description", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Journey Content</label>
              <div className="border rounded-md bg-white" style={{ minHeight: "320px" }}>
                <BasicRichTextEditor
                  value={knowUsMeta.journey.contentHtml || ""}
                  onChange={(html) => updateMetaField("journey", "contentHtml", html)}
                  placeholder="Write the complete journey content..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
