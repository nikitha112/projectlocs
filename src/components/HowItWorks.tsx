import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Report Lost or Found Items',
      description:
        'Easily report items you lost or found by filling out the form with details like title, description, location, and category.',
    },
    {
      title: 'Search & Browse Items',
      description:
        'Browse all reported items. Filter by category, type (lost/found), or date to quickly find matches.',
    },
    {
      title: 'Potential Matches',
      description:
        'Our system automatically finds potential matches between lost and found items and notifies you.',
    },
    {
      title: 'Claim or Contact',
      description:
        'Contact the finder/owner directly to claim the item safely and mark it as claimed once completed.',
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">
          How It Works
        </h2>

        <div className="grid gap-10 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="text-2xl font-semibold text-blue-600 mb-2">
                Step {index + 1}: {step.title}
              </div>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-700">
            Our goal is to help you recover your lost items quickly and safely.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
