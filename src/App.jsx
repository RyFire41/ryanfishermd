import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
// Header is rendered globally in main.jsx
import { InsightsPreview } from "./components/InsightsSection.jsx";
import { EducationalTopicsPreview } from "./components/EducationalTopicsSection.jsx";

export default function DrFisherEducationalSite() {
  return (
    <div className="min-h-screen text-[#1f2937] bg-[#F4EFE4]">
      {/* SEO metadata */}
      <Helmet>
        <title>Dr. Ryan M. Fisher MD | Whole-Person Family Medicine</title>
        <meta
          name="description"
          content="Spirit-led, whole-person care and family medicine in South Florida."
        />
      </Helmet>

  {/* Header is rendered globally in main.jsx */}

  {/* Main content */}
  <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 sm:py-14 space-y-10">
        {/* About Section */}
        <section className="rounded-3xl border border-[#E9E5DA] bg-[#FBF9F5] p-8 shadow-sm grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-[#1f2937]">About Dr. Fisher</h2>
            <p className="mt-4 text-[#374151] leading-relaxed text-lg">
              Dr. Ryan M. Fisher is a board-certified Family Medicine physician committed to education and the advancement of evidence-based, compassionate, and relationship-centered care.
            </p>
            <p className="mt-4 text-[#374151] leading-relaxed text-lg">
              This site serves as a platform for sharing general educational materials and insights related to preventive medicine, chronic disease management, and whole-person wellness.
            </p>
          </div>

          {/* Profile image */}
          <div className="flex justify-center md:justify-end">
            <div className="rounded-3xl border-2 border-dashed border-[#E9E5DA] bg-[#F4EFE4] p-6 text-center w-auto max-w-xs md:max-w-sm lg:max-w-md">
              <img
                src="/ryanfishermd_profile_pic.jpeg"
                alt="Dr. Ryan M. Fisher"
                className="rounded-3xl w-96 shadow-md"
              />
            </div>
          </div>
        </section>

        {/* Educational Topics */}
        <EducationalTopicsPreview />

        {/* Physician’s Insights */}
        <InsightsPreview />

        {/* Legal Notice */}
        <section className="bg-[#F4EFE4]">
          <h2 className="text-md font-semibold text-[#1f2937]">
            Medical Information and Legal Notice
          </h2>
          <div className="mt-4 text-xs leading-5 text-[#374151] space-y-3">
            <p>
              The information on this website is provided for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              Use of this website does not create a physician–patient relationship with Dr. Ryan M. Fisher.
            </p>
            <p>
              External links are provided for convenience and informational purposes and do not constitute an endorsement.
            </p>
          </div>
        </section>

        {/* Footer */}
        <p className="text-xs text-[#374151] italic text-center">
          The views and opinions expressed on this site are solely those of Dr. Ryan M. Fisher and do not represent the official policy or position of the Cleveland Clinic or any affiliated institution.
        </p>

        <p className="text-xs text-[#374151] text-center">
          © {new Date().getFullYear()} Ryan M. Fisher, MD • Educational purposes only. Not a substitute for professional medical advice.
        </p>
      </main>
    </div>
  );
}
