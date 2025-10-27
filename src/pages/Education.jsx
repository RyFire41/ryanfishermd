import React from 'react';
import { Helmet } from 'react-helmet';

export default function Education() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-12">
      <Helmet>
        <title>Educational Resources — Ryan M. Fisher, MD</title>
        <meta name="description" content="Educational resources, guides, and handouts from Ryan M. Fisher, MD." />
      </Helmet>

      <h2 className="text-3xl font-semibold mb-4">Educational Resources</h2>
      <p className="prose prose-dr">This page collects curated educational materials, guides, and resources for patients and learners. Add downloadable handouts, summaries, and links here.</p>
    </main>
  );
}
