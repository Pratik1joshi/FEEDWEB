"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Calendar, Clock3, Mail, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import { pagesApi } from "@/lib/api-services";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
  : "http://localhost:5000";

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

const normalizeJobs = (rawJobs) => {
  if (!Array.isArray(rawJobs)) return [];
  return rawJobs.map((job, index) => {
    const title = job.title || `Job ${index + 1}`;
    return {
      ...job,
      title,
      slug: job.slug || slugify(title),
      summary: job.summary || job.description || "",
      detailsHtml: job.detailsHtml || job.details_html || job.description || "",
      requirementsHtml: job.requirementsHtml || job.requirements_html || "",
      benefitsHtml: job.benefitsHtml || job.benefits_html || "",
      applicationLink: job.applicationLink || job.application_link || "",
      applicationEmail: job.applicationEmail || job.application_email || "",
      location: job.location || "",
      type: job.type || "Full-time",
      department: job.department || "",
      experience: job.experience || "",
      salary: job.salary || "",
      deadline: job.deadline || "",
      isActive: job.isActive ?? job.is_active ?? true,
    };
  });
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export default function CareerJobDetailPage({ params }) {
  const jobSlug = decodeURIComponent(params.jobSlug || "");

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
        console.error("Failed to load careers data", err);
        if (mounted) {
          setError("Could not load job details right now.");
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

  const allJobs = useMemo(() => normalizeJobs(pageData?.meta_data?.jobs), [pageData?.meta_data?.jobs]);
  const job = useMemo(
    () => allJobs.find((item) => (item.slug || slugify(item.title)) === jobSlug),
    [allJobs, jobSlug],
  );

  const bannerImage = resolveMediaUrl(pageData?.meta_data?.banner?.backgroundImage);

  const renderRichHtml = (html) => {
    if (!html) return null;
    return (
      <div
        className="prose max-w-none prose-p:text-gray-700 prose-li:text-gray-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <>
      <Header />
      <main>
        <HeroBanner
          title={job?.title || "Career Opportunity"}
          subtitle={job ? `${job.type}${job.location ? ` • ${job.location}` : ""}` : "Job Detail"}
          description={job?.summary || "Read the full role details and apply."}
          badgeText={job?.department || "Career"}
          backgroundImage={bannerImage || undefined}
        />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <Link
              href="/about/careers"
              className="inline-flex items-center gap-2 text-[#0396FF] hover:text-[#027ad1] mb-8"
            >
              <ArrowLeft size={16} />
              Back to Careers
            </Link>

            {loading && <p className="text-gray-500">Loading job details...</p>}

            {!loading && error && <p className="text-red-600">{error}</p>}

            {!loading && !error && !job && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Job not found</h2>
                <p className="text-gray-600 mb-6">
                  This role does not exist or may have been unpublished from the admin panel.
                </p>
                <Link
                  href="/about/careers"
                  className="inline-flex bg-[#0396FF] text-white px-6 py-2.5 rounded-full hover:bg-opacity-90"
                >
                  View all roles
                </Link>
              </div>
            )}

            {!loading && !error && job && (
              <div className="space-y-8">
                <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{job.title}</h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
                    {job.department && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={15} />
                        <span>{job.department}</span>
                      </div>
                    )}
                    {job.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={15} />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.experience && (
                      <div className="flex items-center gap-2">
                        <Clock3 size={15} />
                        <span>{job.experience}</span>
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Salary:</span>
                        <span>{job.salary}</span>
                      </div>
                    )}
                    {job.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar size={15} />
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Type:</span>
                      <span>{job.type}</span>
                    </div>
                  </div>

                  {job.summary && <p className="text-gray-700 leading-relaxed mt-6">{job.summary}</p>}
                </div>

                {job.detailsHtml && (
                  <div className="rounded-xl border border-gray-200 p-6 bg-white">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Role Description</h2>
                    {renderRichHtml(job.detailsHtml)}
                  </div>
                )}

                {job.requirementsHtml && (
                  <div className="rounded-xl border border-gray-200 p-6 bg-white">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Requirements</h2>
                    {renderRichHtml(job.requirementsHtml)}
                  </div>
                )}

                {job.benefitsHtml && (
                  <div className="rounded-xl border border-gray-200 p-6 bg-white">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Benefits</h2>
                    {renderRichHtml(job.benefitsHtml)}
                  </div>
                )}

                <div className="rounded-xl border border-gray-200 p-6 bg-blue-50">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">How to Apply</h2>

                  <div className="flex flex-wrap items-center gap-3">
                    {job.applicationLink && (
                      /^https?:\/\//i.test(job.applicationLink) ? (
                        <a
                          href={job.applicationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex bg-[#0396FF] text-white px-6 py-2.5 rounded-full hover:bg-opacity-90"
                        >
                          Apply Now
                        </a>
                      ) : (
                        <Link
                          href={job.applicationLink}
                          className="inline-flex bg-[#0396FF] text-white px-6 py-2.5 rounded-full hover:bg-opacity-90"
                        >
                          Apply Now
                        </Link>
                      )
                    )}

                    {job.applicationEmail && (
                      <a
                        href={`mailto:${job.applicationEmail}`}
                        className="inline-flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-full hover:bg-blue-100"
                      >
                        <Mail size={16} />
                        {job.applicationEmail}
                      </a>
                    )}

                    {!job.applicationLink && !job.applicationEmail && (
                      <p className="text-gray-700">Application instructions will be posted soon.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}