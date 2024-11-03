// src/components/Assessment/Assessment.js
import React, { useState, useEffect } from 'react';
import Question from '../Question/Question'; // Adjusted import path
import Outcome from '../Outcome/Outcome'; // Adjusted import path
import './Assessment.css'; // Import the component-specific CSS

function Assessment() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, 'success', 'error'

  // Define questions
  const questions = [
    // Initial Question
    {
      key: 'testOrReal',
      question: 'Is this assessment for testing purposes or a real inquiry?',
      options: ['Test', 'Real'],
      type: 'options',
    },
    // Add other questions here...
    {
      key: 'residency',
      question: 'Do you currently reside in Massachusetts?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'age',
      question: 'What is your age group?',
      options: ['Under 18', '18-21', '21-64', '65 or older'],
      type: 'options',
    },
    {
      key: 'householdSize',
      question: 'How many people are in your household?',
      options: ['1', '2', '3', '4', '5', '6', '7', '8+'],
      type: 'options',
    },
    {
      key: 'householdIncome',
      question: 'What is your total annual household income (before taxes)?',
      options: [
        'Less than $15,000',
        '$15,000 - $20,000',
        '$20,001 - $25,000',
        '$25,001 - $30,000',
        '$30,001 - $35,000',
        '$35,001 - $40,000',
        '$40,001 - $45,000',
        '$45,001 - $50,000',
        '$50,001 - $55,000',
        '$55,001 - $60,000',
        'Over $60,000',
      ],
      type: 'options',
    },
    {
      key: 'assets',
      question: 'What is the total value of your countable assets?',
      options: [
        'Less than $2,000',
        '$2,001 - $5,000',
        '$5,001 - $10,000',
        'Over $10,000',
      ],
      type: 'options',
    },
    {
      key: 'medicareEnrolled',
      question: 'Are you enrolled in Medicare?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'disability',
      question: 'Do you have a disability?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'esrd',
      question: 'Do you have end-stage renal disease (ESRD)?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'abiOrTbi',
      question:
        'Do you have an acquired brain injury (ABI) or traumatic brain injury (TBI)?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'nursingFacility',
      question:
        'Are you currently residing in a nursing facility or hospital, or have you been in one for at least 90 consecutive days?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'nursingCareCriteria',
      question:
        'Do you meet the criteria for needing nursing facility level of care?',
      options: ['Yes', 'No'],
      type: 'options',
      explanation: `This question asks whether you require the level of care typically provided in a nursing facility due to medical, functional, or cognitive impairments. 
Meeting the criteria generally means you have significant health-related needs that cannot be met through informal supports or standard home care services.
**Key factors include:**
- **Assistance with Activities of Daily Living (ADLs):** Such as bathing, dressing, eating, toileting, transferring, and continence.
- **Medical and Nursing Needs:** Requiring regular medical treatments or interventions provided by licensed nurses.
- **Cognitive Impairments:** Memory loss, disorientation, or impaired judgment due to conditions like dementia.
- **Behavioral Issues:** Behaviors that pose a risk to yourself or others.
If you're unsure, consider consulting a healthcare professional for an assessment.`,
    },
    {
      key: 'intellectualDisability',
      question:
        'Do you have an intellectual disability diagnosed by the Department of Developmental Services (DDS)?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'communitySupportNeeded',
      question:
        'Do you require assistance with daily activities to live in the community (e.g., personal care, homemaker services)?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'transitioningFromInstitutionalCare',
      question:
        'Are you planning to transition from a nursing facility or hospital back into the community?',
      options: ['Yes', 'No'],
      type: 'options',
    },
    {
      key: 'coordinatedCareNeeded',
      question:
        'Would you benefit from coordinated health care services, including medical, behavioral health, and long-term services and supports?',
      options: ['Yes', 'No'],
      type: 'options',
    },
  ];

  // Helper Functions
  const getFPL = (householdSize) => {
    // 2023 FPL values
    const fplValues = {
      1: 14580,
      2: 19720,
      3: 24860,
      4: 30000,
      5: 35140,
      6: 40280,
      7: 45420,
      8: 50560,
    };
    const additionalPerson = 5120;
    if (householdSize <= 8) {
      return fplValues[householdSize];
    } else {
      return fplValues[8] + (householdSize - 8) * additionalPerson;
    }
  };

  const mapIncome = (incomeOption) => {
    const incomeRanges = {
      'Less than $15,000': 15000,
      '$15,000 - $20,000': 20000,
      '$20,001 - $25,000': 25000,
      '$25,001 - $30,000': 30000,
      '$30,001 - $35,000': 35000,
      '$35,001 - $40,000': 40000,
      '$40,001 - $45,000': 45000,
      '$45,001 - $50,000': 50000,
      '$50,001 - $55,000': 55000,
      '$55,001 - $60,000': 60000,
      'Over $60,000': 60001,
    };
    return incomeRanges[incomeOption] || 0;
  };

  const mapAssets = (assetsOption) => {
    const assetsRanges = {
      'Less than $2,000': 2000,
      '$2,001 - $5,000': 5000,
      '$5,001 - $10,000': 10000,
      'Over $10,000': 10001,
    };
    return assetsRanges[assetsOption] || 0;
  };

  const determineIncomeEligibility = () => {
    const { householdSize, householdIncome, age } = answers;

    let size = householdSize === '8+' ? 8 : parseInt(householdSize, 10);
    let income = mapIncome(householdIncome);

    if (isNaN(size) || isNaN(income) || size <= 0 || income < 0) {
      return false;
    }

    const fpl = getFPL(size);

    let incomeLimits = {};

    // Determine income limits based on age
    if (age === 'Under 18') {
      incomeLimits = {
        'MassHealth Standard (Children 1-18)': fpl * 1.5, // 150% FPL
      };
    } else if (age === '18-21' || age === '21-64' || age === '65 or older') {
      incomeLimits = {
        'MassHealth Standard (Adults)': fpl * 1.33, // 133% FPL
        'One Care Program': fpl * 1.33, // 133% FPL
        'Integrated Care Options (ICO)': fpl * 1.33, // 133% FPL
        'Senior Care Options (SCO)': fpl * 1.0, // 100% FPL
      };
    }

    return { incomeEligible: incomeLimits, income };
  };

  const determineAssetEligibility = () => {
    const { assets, age } = answers;

    let assetValue = mapAssets(assets);

    if (isNaN(assetValue) || assetValue < 0) {
      return false;
    }

    let assetLimits = {
      'MassHealth Standard (Adults)': age === '65 or older' ? 2000 : Infinity,
      'Senior Care Options (SCO)': 2000,
      'Frail Elder Waiver (FEW)': 2000,
      'ABI and MFP Waivers': 2000,
      'Traumatic Brain Injury (TBI) Waiver': 2000,
      'Adult Supports Waiver (DDS-AS)': 2000,
    };

    return { assetEligible: assetLimits, assetValue };
  };

  const determineEligibility = () => {
    const {
      residency,
      age,
      medicareEnrolled,
      esrd,
      disability,
      abiOrTbi,
      nursingFacility,
      nursingCareCriteria,
      intellectualDisability,
      communitySupportNeeded,
      transitioningFromInstitutionalCare,
      coordinatedCareNeeded,
    } = answers;

    let eligiblePrograms = [];

    // Residency check
    if (residency !== 'Yes') {
      return ['Ineligible for all listed MassHealth programs and waivers.'];
    }

    // Income eligibility check
    const incomeCheck = determineIncomeEligibility();
    if (!incomeCheck || !incomeCheck.incomeEligible) {
      return ['Unable to determine income eligibility due to invalid inputs.'];
    }
    const { incomeEligible, income } = incomeCheck;

    // Asset eligibility check
    const assetCheck = determineAssetEligibility();
    if (!assetCheck || !assetCheck.assetEligible) {
      return ['Unable to determine asset eligibility due to invalid inputs.'];
    }
    const { assetEligible, assetValue } = assetCheck;

    // MassHealth Standard (Adults)
    if (
      (age === '18-21' || age === '21-64' || age === '65 or older') &&
      income <= incomeEligible['MassHealth Standard (Adults)'] &&
      assetValue <= assetEligible['MassHealth Standard (Adults)']
    ) {
      eligiblePrograms.push('MassHealth Standard (Adults)');
    }

    // Children MassHealth Standard
    if (age === 'Under 18' && income <= incomeEligible['MassHealth Standard (Children 1-18)']) {
      eligiblePrograms.push('MassHealth Standard (Children 1-18)');
    }

    // Senior Care Options (SCO)
    if (
      age === '65 or older' &&
      medicareEnrolled === 'Yes' &&
      income <= incomeEligible['Senior Care Options (SCO)'] &&
      assetValue <= assetEligible['Senior Care Options (SCO)']
    ) {
      eligiblePrograms.push('Senior Care Options (SCO)');
    }

    // One Care Program and ICO
    if (
      (age === '18-21' || age === '21-64') &&
      medicareEnrolled === 'Yes' &&
      esrd === 'No' &&
      income <= incomeEligible['One Care Program']
    ) {
      eligiblePrograms.push('One Care Program');
      eligiblePrograms.push('Integrated Care Options (ICO)');
    }

    // Frail Elder Waiver (FEW)
    if (
      (age === '60+' || age === '65 or older') &&
      nursingCareCriteria === 'Yes' &&
      assetValue <= assetEligible['Frail Elder Waiver (FEW)'] &&
      income <= 32904 // 300% FBR
    ) {
      eligiblePrograms.push('Frail Elder Waiver (FEW)');
    }

    // ABI and MFP Waivers
    if (
      abiOrTbi === 'Yes' &&
      nursingFacility === 'Yes' &&
      assetValue <= assetEligible['ABI and MFP Waivers'] &&
      income <= 32904 // 300% FBR
    ) {
      eligiblePrograms.push('ABI Residential Habilitation (ABI-RH)');
      eligiblePrograms.push('ABI Non-Residential Habilitation (ABI-N)');
      eligiblePrograms.push('MFP Residential Supports (MFP-RS)');
      eligiblePrograms.push('MFP Community Living (MFP-CL)');
    }

    // Traumatic Brain Injury (TBI) Waiver
    if (
      abiOrTbi === 'Yes' &&
      nursingCareCriteria === 'Yes' &&
      assetValue <= assetEligible['Traumatic Brain Injury (TBI) Waiver'] &&
      income <= 32904 // 300% FBR
    ) {
      eligiblePrograms.push('Traumatic Brain Injury (TBI) Waiver');
    }

    // Adult Supports Waiver (DDS-AS)
    if (
      intellectualDisability === 'Yes' &&
      (age === '22 or older' || age === '65 or older') &&
      assetValue <= assetEligible['Adult Supports Waiver (DDS-AS)'] &&
      income <= 32904 // 300% FBR
    ) {
      eligiblePrograms.push('Adult Supports Waiver (DDS-AS)');
    }

    // Need for community support
    if (communitySupportNeeded === 'Yes') {
      if (
        (age === '60+' || age === '65 or older') &&
        assetValue <= assetEligible['Frail Elder Waiver (FEW)'] &&
        income <= 32904 // 300% FBR
      ) {
        eligiblePrograms.push('Frail Elder Waiver (FEW)');
      }
      if (transitioningFromInstitutionalCare === 'Yes') {
        eligiblePrograms.push('MFP Community Living (MFP-CL)');
      }
    }

    // Transitioning from Institutional Care
    if (transitioningFromInstitutionalCare === 'Yes') {
      eligiblePrograms.push('MFP Residential Supports (MFP-RS)');
      eligiblePrograms.push('MFP Community Living (MFP-CL)');
    }

    // Coordinated Care Needs
    if (coordinatedCareNeeded === 'Yes') {
      if (
        (age === '18-21' || age === '21-64') &&
        medicareEnrolled === 'Yes' &&
        esrd === 'No' &&
        income <= incomeEligible['One Care Program']
      ) {
        eligiblePrograms.push('Integrated Care Options (ICO)');
        eligiblePrograms.push('One Care Program');
      }
      if (age === '65 or older' && medicareEnrolled === 'Yes') {
        eligiblePrograms.push('Senior Care Options (SCO)');
      }
    }

    // Remove duplicates
    eligiblePrograms = [...new Set(eligiblePrograms)];

    if (eligiblePrograms.length === 0) {
      eligiblePrograms.push('Based on your answers, you may need to contact MassHealth for more information.');
    }

    return eligiblePrograms;
  };

  // Function to submit the assessment to the backend
  const submitAssessment = async () => {
    console.log('Submitting assessment with answers:', answers); // Debugging log
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        console.log('Assessment submitted successfully.');
      } else {
        const errorData = await response.json();
        setSubmissionStatus('error');
        console.error('Failed to submit assessment:', errorData.message);
      }
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Error submitting assessment:', error);
    }
  };

  // Function to handle user's answer
  const handleAnswer = (key, value) => {
    console.log(`Answer received for ${key}: ${value}`); // Debugging log
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [key]: value,
    }));
    setStep((prevStep) => prevStep + 1);
  };

  // useEffect to handle submission when assessment is complete
  useEffect(() => {
    if (step > questions.length && !submitted) {
      console.log('All questions answered. Submitting assessment...'); // Debugging log
      submitAssessment();
      setSubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Determine eligibility only after submission
  const eligiblePrograms = step > questions.length ? determineEligibility() : [];

  if (step > questions.length) {
    return (
      <Outcome
        programs={eligiblePrograms}
        submissionStatus={submissionStatus}
      />
    );
  }

  // Add debugging logs to track step and current question
  console.log(`Current step: ${step}`);
  const currentQuestion = questions[step - 1];
  console.log('Current question:', currentQuestion);

  return (
    <div className="assessment-container">
      <Question
        key={currentQuestion.key} // Adding a unique key prop based on question key
        question={currentQuestion.question}
        options={currentQuestion.options}
        onAnswer={(value) => handleAnswer(currentQuestion.key, value)}
        type={currentQuestion.type}
        explanation={currentQuestion.explanation} // Pass the explanation prop here
      />
      {submissionStatus === 'success' && (
        <div className="submission-success">
          Your assessment has been submitted successfully.
        </div>
      )}
      {submissionStatus === 'error' && (
        <div className="submission-error">
          There was an error submitting your assessment. Please try again later.
        </div>
      )}
    </div>
  );
}

export default Assessment;
