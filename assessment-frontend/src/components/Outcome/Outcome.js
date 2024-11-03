// src/Outcome.js
import React from 'react';
import './outcome.css'; // Import the CSS file

const programDetails = {
  'MassHealth Standard (Adults)': {
    explanation:
      'MassHealth Standard provides comprehensive health insurance to adults, including doctor visits, hospital stays, prescription drugs, and more.',
    eligibilityCriteria: [
      { criterion: 'Age', value: '19 or older' },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Income Limit', value: '≤ 133% of Federal Poverty Level (FPL)' },
      {
        criterion: 'Asset Limit',
        value: 'No limit if under 65; ≤ $2,000 if 65 or older',
      },
    ],
  },
  'MassHealth Standard (Children 1-18)': {
    explanation:
      'MassHealth Standard provides comprehensive health insurance to children, including preventive care, dental services, vision care, and more.',
    eligibilityCriteria: [
      { criterion: 'Age', value: 'Under 19' },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Income Limit', value: '≤ 150% of FPL' },
      { criterion: 'Asset Limit', value: 'Not applicable' },
    ],
  },
  'Senior Care Options (SCO)': {
    explanation:
      'SCO is a comprehensive health plan that combines Medicare and MassHealth benefits for seniors, including primary care, specialty care, and long-term services.',
    eligibilityCriteria: [
      { criterion: 'Age', value: '65 or older' },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Medicare Enrollment', value: 'Required' },
      { criterion: 'Income Limit', value: '≤ 100% of FPL' },
      { criterion: 'Asset Limit', value: '≤ $2,000' },
    ],
  },
  'One Care Program': {
    explanation:
      'One Care offers integrated care for people with disabilities aged 21-64 who are eligible for both MassHealth and Medicare. It provides a combined care plan that includes medical, behavioral health, and long-term support services.',
    eligibilityCriteria: [
      { criterion: 'Age', value: '21-64' },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Medicare Enrollment', value: 'Required' },
      { criterion: 'Income Limit', value: '≤ 133% of FPL' },
      { criterion: 'End-Stage Renal Disease (ESRD)', value: 'Must not have ESRD' },
    ],
  },
  'Integrated Care Options (ICO)': {
    explanation:
      'ICO provides integrated care for individuals who are eligible for both MassHealth and Medicare, focusing on coordinated services to improve health outcomes.',
    eligibilityCriteria: [
      { criterion: 'Age', value: '21-64' },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Medicare Enrollment', value: 'Required' },
      { criterion: 'Income Limit', value: '≤ 133% of FPL' },
      { criterion: 'End-Stage Renal Disease (ESRD)', value: 'Must not have ESRD' },
    ],
  },
  'Frail Elder Waiver (FEW)': {
    explanation:
      'The Frail Elder Waiver allows eligible seniors to receive home and community-based services as an alternative to nursing facility care.',
    eligibilityCriteria: [
      { criterion: 'Age', value: '60 or older' },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      {
        criterion: 'Need for Nursing Facility Level of Care',
        value: 'Must meet criteria',
      },
      { criterion: 'Income Limit', value: '≤ $32,904 (300% of Federal Benefit Rate)' },
      { criterion: 'Asset Limit', value: '≤ $2,000' },
    ],
  },
  'ABI Residential Habilitation (ABI-RH)': {
    explanation:
      'The ABI-RH waiver provides residential support services to individuals with Acquired Brain Injury who are moving from a nursing facility to the community.',
    eligibilityCriteria: [
      { criterion: 'Diagnosis', value: 'Acquired Brain Injury (ABI)' },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      {
        criterion: 'Current Residence',
        value: 'Must be in a nursing facility or hospital',
      },
      { criterion: 'Income Limit', value: '≤ $32,904 (300% of FBR)' },
      { criterion: 'Asset Limit', value: '≤ $2,000' },
    ],
  },
  'ABI Non-Residential Habilitation (ABI-N)': {
    explanation:
      'The ABI-N waiver provides non-residential support services to individuals with ABI, facilitating community living without residential habilitation.',
    eligibilityCriteria: [
      { criterion: 'Diagnosis', value: 'Acquired Brain Injury (ABI)' },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      {
        criterion: 'Current Residence',
        value: 'Must be in a nursing facility or hospital',
      },
      { criterion: 'Income Limit', value: '≤ $32,904 (300% of FBR)' },
      { criterion: 'Asset Limit', value: '≤ $2,000' },
    ],
  },
  'MFP Residential Supports (MFP-RS)': {
    explanation:
      'The Money Follows the Person Residential Supports waiver assists individuals transitioning from institutional settings to the community, providing residential services.',
    eligibilityCriteria: [
      { criterion: 'Age', value: '18 or older' },
      {
        criterion: 'Current Residence',
        value: 'Must be transitioning from a nursing facility or hospital',
      },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Income Limit', value: '≤ $32,904 (300% of FBR)' },
      { criterion: 'Asset Limit', value: '≤ $2,000' },
    ],
  },
  'MFP Community Living (MFP-CL)': {
    explanation:
      'The MFP-CL waiver supports individuals transitioning to community living, offering services to live independently.',
    eligibilityCriteria: [
      { criterion: 'Age', value: '18 or older' },
      {
        criterion: 'Current Residence or Need',
        value:
          'Transitioning from a nursing facility or requires assistance with daily activities',
      },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Income Limit', value: '≤ $32,904 (300% of FBR)' },
      { criterion: 'Asset Limit', value: '≤ $2,000' },
    ],
  },
  'Traumatic Brain Injury (TBI) Waiver': {
    explanation:
      'The TBI Waiver provides specialized services to individuals with Traumatic Brain Injury, allowing them to live in the community rather than a nursing facility.',
    eligibilityCriteria: [
      { criterion: 'Diagnosis', value: 'Traumatic Brain Injury (TBI)' },
      {
        criterion: 'Need for Nursing Facility Level of Care',
        value: 'Must meet criteria',
      },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Income Limit', value: '≤ $32,904 (300% of FBR)' },
      { criterion: 'Asset Limit', value: '≤ $2,000' },
    ],
  },
  'Adult Supports Waiver (DDS-AS)': {
    explanation:
      'The DDS-AS waiver provides services to adults with intellectual disabilities to support community living and avoid institutionalization.',
    eligibilityCriteria: [
      { criterion: 'Age', value: '22 or older' },
      {
        criterion: 'Diagnosis',
        value: 'Intellectual disability diagnosed by DDS',
      },
      { criterion: 'Residency', value: 'Massachusetts resident' },
      { criterion: 'Income Limit', value: '≤ $32,904 (300% of FBR)' },
      { criterion: 'Asset Limit', value: '≤ $2,000' },
    ],
  },
};

function Outcome({ programs }) {
  return (
    <div className="outcome-container">
      <h2 className="outcome-title">Your Eligible Programs</h2>
      {programs.map((program) => (
        <div key={program} className="program-card">
          <h3 className="program-name">{program}</h3>
          {programDetails[program] ? (
            <>
              <p className="program-explanation">{programDetails[program].explanation}</p>
              <table className="eligibility-table">
                <thead>
                  <tr>
                    <th>Eligibility Criteria</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {programDetails[program].eligibilityCriteria.map((item, index) => (
                    <tr key={index}>
                      <td>{item.criterion}</td>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="no-info">No additional information available.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Outcome;