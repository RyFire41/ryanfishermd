import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
  <main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-12">
      <Helmet>
        <title>About — Ryan M. Fisher, MD</title>
        <meta name="description" content="About Ryan M. Fisher, MD — family medicine physician." />
      </Helmet>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-semibold mb-4">About</h2>
          <p className="prose prose-dr">I'm Ryan M. Fisher, MD, a family medicine physician focused on patient-centered care, preventive health, and helping people navigate complex health systems. This site shares clinical insights, educational resources, and patient-focused guidance.</p>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="rounded-3xl border-2 border-dashed border-[#E9E5DA] bg-[#F4EFE4] p-4 text-center w-48">
            <picture>
              <source srcSet="/ryanfishermd_profile_pic.avif" type="image/avif" />
              <source srcSet="/ryanfishermd_profile_pic.webp" type="image/webp" />
              <img src="/ryanfishermd_profile_pic.jpeg" alt="Dr. Ryan M. Fisher" className="rounded-3xl w-40 shadow-md" />
            </picture>
          </div>
        </div>
      </div>
    </main>
  );
}
