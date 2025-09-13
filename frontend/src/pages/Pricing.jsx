import React, { useState } from 'react';
import { Check, X, Star, Users, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Basic',
      icon: <Users className="w-8 h-8" />,
      description: 'Perfect for individual property owners',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'List up to 2 properties',
        'Basic property management',
        'Email support',
        'Standard listing visibility',
        'Basic analytics',
        'Mobile app access'
      ],
      limitations: [
        'No priority support',
        'Limited customization',
        'Basic reporting only'
      ],
      popular: false,
      color: 'gray'
    },
    {
      name: 'Professional',
      icon: <Zap className="w-8 h-8" />,
      description: 'Best for growing rental businesses',
      monthlyPrice: 999,
      yearlyPrice: 9990,
      features: [
        'List unlimited properties',
        'Advanced property management',
        'Priority email & phone support',
        'Enhanced listing visibility',
        'Advanced analytics & reporting',
        'Mobile app access',
        'Automated rent collection',
        'Tenant screening tools',
        'Digital lease agreements',
        'Maintenance request management'
      ],
      limitations: [],
      popular: true,
      color: 'blue'
    },
    {
      name: 'Enterprise',
      icon: <Crown className="w-8 h-8" />,
      description: 'For large-scale property management',
      monthlyPrice: 2499,
      yearlyPrice: 24990,
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom branding options',
        'API access',
        'Advanced integrations',
        'Custom reporting',
        'Bulk operations',
        'Multi-user access',
        'White-label solutions'
      ],
      limitations: [],
      popular: false,
      color: 'purple'
    }
  ];

  const faqs = [
    {
      question: 'Is there a setup fee?',
      answer: 'No, there are no setup fees for any of our plans. You can start listing your properties immediately after signing up.'
    },
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What happens if I cancel?',
      answer: 'You can cancel anytime. Your listings will remain active until the end of your billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee if you\'re not satisfied with our service.'
    }
  ];

  const getPrice = (plan) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    if (billingPeriod === 'yearly' && plan.monthlyPrice > 0) {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = monthlyCost - plan.yearlyPrice;
      return Math.round((savings / monthlyCost) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your rental business. Start free, upgrade when you need more.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingPeriod === 'monthly' ? 'text-white' : 'text-blue-200'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className={`ml-3 ${billingPeriod === 'yearly' ? 'text-white' : 'text-blue-200'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Save up to 17%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <div className="flex items-center mb-4">
                  <div className={`text-${plan.color}-600 dark:text-${plan.color}-400 mr-3`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹{getPrice(plan).toLocaleString()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {getSavings(plan) > 0 && (
                    <div className="text-green-600 text-sm font-semibold mt-1">
                      Save {getSavings(plan)}% with yearly billing
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-6 ${plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Start Free Trial'}
                </button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    What's included:
                  </h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 dark:text-white mt-6">
                        Limitations:
                      </h4>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-center">
                          <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white dark:bg-gray-800 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Compare Plans
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-900 dark:text-white font-semibold">
                    Features
                  </th>
                  {plans.map((plan, index) => (
                    <th key={index} className="text-center py-4 px-6 text-gray-900 dark:text-white font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  'Property Listings',
                  'Analytics & Reporting',
                  'Customer Support',
                  'Mobile App',
                  'Rent Collection',
                  'Tenant Screening',
                  'API Access'
                ].map((feature, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      {feature}
                    </td>
                    <td className="text-center py-4 px-6">
                      {feature === 'Property Listings' ? '2 properties' :
                        feature === 'Customer Support' ? 'Email only' :
                          feature === 'API Access' ? <X className="w-5 h-5 text-red-500 mx-auto" /> :
                            <Check className="w-5 h-5 text-green-500 mx-auto" />}
                    </td>
                    <td className="text-center py-4 px-6">
                      {feature === 'Property Listings' ? 'Unlimited' :
                        feature === 'Customer Support' ? 'Email & Phone' :
                          feature === 'API Access' ? <X className="w-5 h-5 text-red-500 mx-auto" /> :
                            <Check className="w-5 h-5 text-green-500 mx-auto" />}
                    </td>
                    <td className="text-center py-4 px-6">
                      {feature === 'Property Listings' ? 'Unlimited' :
                        feature === 'Customer Support' ? '24/7 Priority' :
                          <Check className="w-5 h-5 text-green-500 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of property owners who trust MESS WALLAH
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
