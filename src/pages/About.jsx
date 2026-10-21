import React from 'react';
import { 
  Sprout, 
  ShieldCheck, 
  Cpu, 
  HeartHandshake, 
  Award, 
  Layers, 
  Landmark, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-green" style={{ marginBottom: '12px' }}>Our Mission</span>
          <h1 style={{ fontSize: '2.5rem', color: '#14532D', marginBottom: '14px' }}>
            Transforming Indian Agriculture through Evidence-Grounded AI
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#647067', lineHeight: 1.7 }}>
            SEHAT-KRISHI AI was engineered to bridge the critical gap between cutting-edge artificial intelligence and the daily field realities of Indian smallholder farmers.
          </p>
        </div>

        {/* Vision Cards */}
        <div className="grid-2" style={{ marginBottom: '36px' }}>
          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', marginBottom: '14px' }}>
              <HeartHandshake size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '8px' }}>
              Farmers at the Center
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#647067', lineHeight: 1.6, margin: 0 }}>
              Over 85% of India's farmers operate on marginal landholdings (&lt;2 hectares). We focus on simple language (English, Hindi, Gujarati), zero technical jargon, and practical steps to reduce input costs while protecting yields.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', marginBottom: '14px' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#14532D', marginBottom: '8px' }}>
              Agricultural Safety & Ethics
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#647067', lineHeight: 1.6, margin: 0 }}>
              Unlike generic AI chatbots that hallucinate hazardous pesticide doses, SEHAT-KRISHI AI enforces strict Integrated Pest Management (IPM) rules: cultural and biological management first, with verified CIBRC chemical safety guardrails.
            </p>
          </div>
        </div>

        {/* The Technology Stack */}
        <div className="card" style={{ marginBottom: '36px', padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#14532D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={22} color="#166534" />
            <span>The Intelligence Architecture</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.92rem', color: '#17251B', lineHeight: 1.6 }}>
            <div>
              <strong>1. Multimodal AI & Computer Vision:</strong> Powered by Google Gemini 2.5 and 1.5 models for visual phytopathology screening, lesion segmentation, and natural language dialogue in Indian languages.
            </div>
            <div>
              <strong>2. Retrieval-Augmented Generation (RAG):</strong> Every query queries a verified corpus derived from Indian Council of Agricultural Research (ICAR), Directorate of Plant Protection, Quarantine & Storage (DPPQS), and State Agricultural Universities.
            </div>
            <div>
              <strong>3. Real Meteorological API:</strong> High-resolution weather observations and agricultural risk models computed via Open-Meteo and IMD agricultural normals.
            </div>
            <div>
              <strong>4. Open Market Intelligence:</strong> APMC Mandi rates tracking the Agmarknet agricultural data feed for accurate daily price benchmarks.
            </div>
          </div>
        </div>

        {/* Disclaimer on Local KVK Consultation */}
        <div className="card card-soft" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#14532D', marginBottom: '10px' }}>
            The Role of Local Agricultural Experts
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.6, margin: 0 }}>
            Artificial Intelligence is a powerful preliminary decision-support tool, but it does not replace the localized on-site experience of your block agriculture officer, Krishi Vigyan Kendra (KVK) scientists, or physical soil testing laboratories. We advocate using AI to formulate informed questions and confirm suspicious symptoms.
          </p>
        </div>
      </div>
    </div>
  );
}
