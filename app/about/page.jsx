"use client";

import { useEffect, useMemo, useState } from "react";
import { Target, Eye, Globe, Heart, Building } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import { pagesApi } from "@/lib/api-services";
import Link from "next/link";
import Image from "next/image";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
  : "http://localhost:5000";

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

const VALUE_ICONS = [Target, Heart, Globe, Eye];

const cloneObject = (value) => JSON.parse(JSON.stringify(value));

const withMediaOrigin = (src = "") => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/uploads/")) return `${API_ORIGIN}${src}`;
  return src;
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

export default function AboutPage() {
  const [meta, setMeta] = useState(cloneObject(DEFAULT_KNOW_US_META));

  useEffect(() => {
    let isMounted = true;

    const fetchKnowUs = async () => {
      try {
        const response = await pagesApi.getBySlug("know-us");
        if (isMounted && response.success && response.data) {
          setMeta(normalizeKnowUsMeta(response.data.meta_data));
        }
      } catch (error) {
        console.error("Failed to load Know Us page content", error);
      }
    };

    fetchKnowUs();

    return () => {
      isMounted = false;
    };
  }, []);

  const objectiveColumns = useMemo(() => {
    const list = meta.objectivesSection.objectives || [];
    const midpoint = Math.ceil(list.length / 2);
    return [list.slice(0, midpoint), list.slice(midpoint)];
  }, [meta.objectivesSection.objectives]);

  return (
    <>
      <Header />
      <main>
        <HeroBanner
          title={meta.banner.title}
          subtitle={meta.banner.subtitle}
          description={meta.banner.description}
          badgeText={meta.banner.badgeText}
          badgeIcon={Building}
          backgroundImage={withMediaOrigin(meta.banner.backgroundImage)}
          rootClassName="pt-16 md:pt-20"
          contentClassName="mb-10 md:mb-12"
          titleClassName="text-2xl md:text-4xl lg:text-5xl"
          subtitleClassName="text-lg md:text-xl lg:text-2xl"
          descriptionClassName="text-sm md:text-base lg:text-lg"
        />

        <section className="py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF]">{meta.history.heading}</h2>
                  <p className="text-xl md:text-2xl text-gray-600">{meta.history.subheading}</p>
                </div>
                <div
                  className="max-w-none text-gray-600 [&_p]:text-base [&_p]:md:text-lg [&_p]:leading-relaxed [&_p:not(:last-child)]:mb-4"
                  dangerouslySetInnerHTML={{ __html: meta.history.contentHtml || "" }}
                />
                {meta.history.buttonText && (
                  <Link
                    href={meta.history.buttonLink || "/contact"}
                    className="inline-flex bg-[#0396FF] text-white px-7 py-2.5 rounded-full hover:bg-opacity-90 transition-all duration-300 text-base md:text-lg font-medium"
                  >
                    {meta.history.buttonText}
                  </Link>
                )}
              </div>

              <div className="relative h-[300px] sm:h-[360px] md:h-[430px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={withMediaOrigin(meta.history.image)}
                  alt="FEED Company History"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center mb-12 md:mb-14">
              <h2 className="text-xl md:text-2xl text-gray-600 mb-2">{meta.aboutFeed.sectionEyebrow}</h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-6 md:mb-8">{meta.aboutFeed.sectionTitle}</h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{meta.aboutFeed.intro}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-center mb-12 md:mb-14">
              <div className="space-y-6">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{meta.aboutFeed.details}</p>
              </div>
              <div className="relative h-[280px] sm:h-[330px] md:h-[380px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={withMediaOrigin(meta.aboutFeed.image)}
                  alt="FEED Establishment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-center">
              <div className="relative h-[280px] sm:h-[330px] md:h-[380px] rounded-lg overflow-hidden shadow-xl md:order-1 order-2">
                <Image
                  src={withMediaOrigin(meta.visionBlock.image)}
                  alt="FEED Vision"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-6 md:order-2 order-1">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{meta.visionBlock.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 mb-14 md:mb-16">
              <div className="bg-gray-50 rounded-lg p-6 md:p-8">
                <div className="w-14 h-14 bg-[#0396FF] rounded-full flex items-center justify-center mb-5">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0396FF] mb-3 md:mb-4">
                  {meta.missionVision.missionTitle}
                </h3>
                <p className="text-gray-600 leading-relaxed">{meta.missionVision.missionDescription}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 md:p-8">
                <div className="w-14 h-14 bg-[#0396FF] rounded-full flex items-center justify-center mb-5">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0396FF] mb-3 md:mb-4">
                  {meta.missionVision.visionTitle}
                </h3>
                <p className="text-gray-600 leading-relaxed">{meta.missionVision.visionDescription}</p>
              </div>
            </div>

            <div className="mb-14 md:mb-16">
              <div className="text-center mb-10 md:mb-12">
                <h3 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">{meta.valuesSection.title}</h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{meta.valuesSection.description}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(meta.valuesSection.values || []).map((value, index) => {
                  const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
                  return (
                    <div
                      key={`${value.title}-${index}`}
                      className="text-center p-5 rounded-lg hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="w-14 h-14 bg-[#0396FF] rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-[#0396FF]/80 transition-colors duration-300">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-xl font-serif font-bold text-[#0396FF] mb-3">{value.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-14 md:mb-16">
              <div className="text-center mb-10 md:mb-12">
                <h3 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">
                  {meta.objectivesSection.title}
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{meta.objectivesSection.description}</p>
              </div>
              <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg">
                <div className="grid md:grid-cols-2 gap-8">
                  {objectiveColumns.map((column, columnIndex) => (
                    <div key={`objective-column-${columnIndex}`} className="space-y-6">
                      {column.map((objective, index) => (
                        <div key={`objective-${columnIndex}-${index}`} className="flex items-start space-x-4">
                          <div className="w-3 h-3 bg-[#0396FF] rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 leading-relaxed">{objective}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-7 md:p-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 md:mb-12">
                  <h3 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">{meta.journey.title}</h3>
                  <p className="text-lg text-gray-600">{meta.journey.description}</p>
                </div>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <div dangerouslySetInnerHTML={{ __html: meta.journey.contentHtml || "" }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}