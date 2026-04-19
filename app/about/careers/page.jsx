"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, Calendar, Clock3, MapPin, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import { pagesApi } from "@/lib/api-services";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
  : "http://localhost:5000";

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

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const resolveMediaUrl = (src = "") => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/uploads/")) return `${API_ORIGIN}${src}`;
  return src;
};

const normalizeCareersMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === "object" ? rawMeta : {};
  const gallery =
    Array.isArray(meta.gallery) && meta.gallery.length > 0
      ? meta.gallery.map((item) => ({
          src: item.src || "/about.jpg",
          span: item.span || "md:col-span-1 md:row-span-1",
          title: item.title || "",
          description: item.description || "",
        }))
      : DEFAULT_CAREERS_META.gallery;

  const jobs = Array.isArray(meta.jobs)
    ? meta.jobs.map((job, index) => {
        const title = job.title || `Job ${index + 1}`;
        return {
          ...job,
          title,
          slug: job.slug || slugify(title),
          summary: job.summary || job.description || "",
          type: job.type || "Full-time",
          location: job.location || "",
          department: job.department || "",
          experience: job.experience || "",
          deadline: job.deadline || "",
          isActive: job.isActive ?? job.is_active ?? true,
        };
      })
    : [];

  return {
    ...DEFAULT_CAREERS_META,
    ...meta,
    banner: { ...DEFAULT_CAREERS_META.banner, ...(meta.banner || {}) },
    hero: { ...DEFAULT_CAREERS_META.hero, ...(meta.hero || {}) },
    lifeAtFeed: { ...DEFAULT_CAREERS_META.lifeAtFeed, ...(meta.lifeAtFeed || {}) },
    jobsSection: { ...DEFAULT_CAREERS_META.jobsSection, ...(meta.jobsSection || {}) },
    apply: { ...DEFAULT_CAREERS_META.apply, ...(meta.apply || {}) },
    gallery,
    jobs,
  };
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export default function CareersPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPage = async () => {
      try {
        const response = await pagesApi.getBySlug("work-with-us");
        if (mounted && response.success && response.data) {
          setPageData(response.data);
        }
      } catch (err) {
        console.error("Failed to load careers content", err);
        if (mounted) {
          setError("Could not load latest content. Showing defaults.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPage();
    return () => {
      mounted = false;
    };
  }, []);

  const careersMeta = useMemo(
    () => normalizeCareersMeta(pageData?.meta_data),
    [pageData?.meta_data],
  );

  const bannerImage = resolveMediaUrl(careersMeta.banner.backgroundImage);
  const heroImage = resolveMediaUrl(careersMeta.hero.image || pageData?.image_url || "/about.jpg");
  const activeJobs = careersMeta.jobs.filter((job) => job.isActive !== false);

  return (
    <>
      <Header />
      <main>
        <HeroBanner
          title={careersMeta.banner.title}
          subtitle={careersMeta.banner.subtitle}
          description={careersMeta.banner.description}
          badgeText={careersMeta.banner.badgeText}
          badgeIcon={Users}
          backgroundImage={bannerImage || undefined}
        />

        {error && (
          <section className="bg-yellow-50 border-y border-yellow-200">
            <div className="container mx-auto px-6 py-3 text-sm text-yellow-700">{error}</div>
          </section>
        )}

        {loading && (
          <section className="py-8 bg-white">
            <div className="container mx-auto px-6 text-sm text-gray-500">Loading careers content...</div>
          </section>
        )}

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0396FF] mb-4">
                  {careersMeta.hero.title}
                </h1>
                <h2 className="text-2xl md:text-3xl text-gray-600 mb-8">{careersMeta.hero.subtitle}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{careersMeta.hero.description}</p>
              </div>
              {heroImage && (
                <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-xl">
                  <Image src={heroImage} alt={careersMeta.hero.title} fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">
                {careersMeta.lifeAtFeed.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{careersMeta.lifeAtFeed.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
              {careersMeta.gallery.map((image, index) => {
                const imageSrc = resolveMediaUrl(image.src || "/about.jpg");
                return (
                  <div
                    key={`${image.title}-${index}`}
                    className={`relative group ${image.span} transform transition-all duration-500 hover:z-10`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={image.title || "Gallery image"}
                        fill
                        className={`object-cover transition-transform duration-700 ${
                          hoveredIndex === index ? "scale-110" : "scale-100"
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
                          hoveredIndex === index ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>

                    <div
                      className={`absolute inset-0 p-6 flex flex-col justify-end text-white transform transition-all duration-500 ${
                        hoveredIndex === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">
                {careersMeta.jobsSection.title}
              </h2>
              <p className="text-lg text-gray-600">{careersMeta.jobsSection.description}</p>
            </div>

            {activeJobs.length === 0 ? (
              <div className="max-w-2xl mx-auto text-center bg-gray-50 border border-gray-200 rounded-xl px-6 py-10">
                <p className="text-gray-600">No active job openings at the moment. Please check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeJobs.map((job, index) => {
                  const jobSlug = job.slug || slugify(job.title || `job-${index + 1}`);
                  return (
                    <article
                      key={job.id || jobSlug}
                      className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          {job.type}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        {job.department && (
                          <div className="flex items-center gap-2">
                            <Briefcase size={14} />
                            <span>{job.department}</span>
                          </div>
                        )}
                        {job.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.experience && (
                          <div className="flex items-center gap-2">
                            <Clock3 size={14} />
                            <span>{job.experience}</span>
                          </div>
                        )}
                        {job.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Deadline: {formatDate(job.deadline)}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mt-4 leading-relaxed">{job.summary}</p>

                      <Link
                        href={`/about/careers/${encodeURIComponent(jobSlug)}`}
                        className="inline-flex items-center gap-2 mt-6 text-[#0396FF] hover:text-[#027ad1] font-medium"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-6">
                {careersMeta.apply.title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{careersMeta.apply.description}</p>
              {/^https?:\/\//i.test(careersMeta.apply.buttonLink || "") ? (
                <a
                  href={careersMeta.apply.buttonLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
                >
                  {careersMeta.apply.buttonText}
                </a>
              ) : (
                <Link
                  href={careersMeta.apply.buttonLink || "/contact"}
                  className="inline-flex bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
                >
                  {careersMeta.apply.buttonText}
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}