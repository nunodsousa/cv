/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

const RESUME_CONTEXT = `
NAME: Nuno Miguel Santos Teixeira de Sousa (Nuno de Sousa)
TITLE: Expert in Data Science & IA
SUMMARY: Expert in Data Science and IA with over 10 years of experience and a Ph.D. in Theoretical Physics, specializing in Python-based development of advanced pricing models, business analytics, technology-driven financial systems, and machine learning algorithms. MBA candidate at CPBS.

CONTACT (some info is hidden for privacy reasons):
- Emails: nunoxxxxxxxx@gmail.com, nunoxxxxxxxx@simia-tech.com 
- Phones: +351 xx xxx xx xx, +34 xxx xx xx xx
- Website: https://github.com/nunodsousa
- LinkedIn: www.linkedin.com/in/nunodsousa/
- ORCID: 0000-0002-3226-9683
- Gender: Male
- Nationality: Portuguese
- Date of Birth: 28/07/1982

EMPLOYMENT HISTORY:
1. Expert in Data Science & IA - DataJuicers (Remote) [Nov 2019 - Present]
   - Defined/implemented end-to-end AI/ML/data science solutions for high-profile clients (utilities, healthcare, chemicals).
   - Processed/structured large datasets.
   - Acted as business translator between technical teams and stakeholders.
   - Led cross-functional collaboration.
   - Expertise: Market analysis, pricing strategies, demand forecasting, process optimization.

2. Quantitative Analyst - Arfima Trading (Madrid) [Apr 2019 - Oct 2019]
   - Designed/deployed automated trading strategies (futures, EOS to HFT).
   - Analyzed financial data for trading signals.
   - Implemented ML models for commodities.
   - Developed backtesting frameworks and risk management protocols.

3. Data Scientist - DataJuicers (Madrid) [Jun 2017 - Mar 2019]
   - Specialized in Business Solutions, Time Series Forecasting, ML.
   - Sectors: Luxury, retail, services, industry.
   - Directed "Dress Recommendation System" (recognized by Google for TensorFlow/CV application).
   - Hedge fund projects (financial analysis/modeling).

4. Researcher/Lecturer - Universidad Autónoma de Madrid [2009 - Jun 2017]
   - Teaching Physics/Informatics Engineering.
   - Research in Computational Physics, Electrodynamics, Mathematical Methods.

EDUCATION:
- MBA (Católica Porto Business School - CPBS) [Oct 2024 - July 2026]
- PhD in Theoretical Physics (Universidad Autónoma de Madrid) [Sep 2010 - Oct 2014]. Cum Laude.
  - Thesis: 'Light scattering in disordered and nonreciprocal media'.
  - Link: https://sirena.csic.es/wp-content/uploads/2024/07/Tesis-Nuno.pdf
- Master in Photonics (UAM) [Sep 2009 - Jun 2010]. GPA 8.8/10.
- Licenciate in Physics (Universidade do Porto).

SKILLS:
- Programming: Python (pandas, scikit-learn, statsmodels, NumPy), SQL, C.
- Modeling: Monte Carlo, GLM/GAM, Bayesian, Survival analysis, CLV.
- AI & Cloud: OpenAI, LangChain.
- DevOps: Git, Docker.
- Techniques: Deep Learning (Keras, TensorFlow), Random Forest, XGBoost, SVM, KNN.
- Time Series: Prophet, ARIMA, ETS, State Space.
- Languages: Portuguese (Native), English (C1+), Spanish (12y in Spain).

SUPERVISION EXPERIENCE:
- Degree Thesis: "Sistema Inteligente de Análise e Sumarização de Notícias de Matérias-Primas", Mário Pinto (2025).
- Master Thesis: "Machine learning applied to nanophotonics", Edurne Sáenz Párraga (2022).
- Degree Thesis: "Paralelización del Proyecto Eris", Borja Leandro (2020).
- Master Thesis: "Light scattering in diluted lattices under percolation", Cristina Sanz Fernández (2016).
- Master Thesis: "Dynamics of a dimer in light", Jorge Olmos Trigo (2016).

PUBLICATIONS (Selected):
20. Diego R Abujetas, N de Sousa... "Active angular tuning and switching of Brewster quasi bound states..." (2022). Impact: 8.449
19. Alexey Kimel... Nuno De Sousa... "The 2022 magneto-optics roadmap", J. Phys D (2022). Impact: 3.1
18. DR Abujetas, N de Sousa... "Active angular tuning..." Nanophotonics (2021). Impact: 8.449
17. Jorge Olmos-Trigo... Nuno de Sousa... "Multiple Kerker anapoles..." Laser Photonics Rev (2021). Impact: 10.655
... [Full list available in app]

CONFERENCE PRESENTATIONS:
- Oral Communications by invitation:
  - "Magneto-optical activity in high-index dielectric materials", META2016.
  - "Magneto-optical activity in interacting magneto-plasmonic nanodisks", TNT2013.
- Oral Communications (approx 30+ items)
- Poster Communications:
  - "Near-field effects in Anderson Localization", Dinamo 2017.
  - "Magneto-Optical Activity in High Index Dielectric Nanoantennas", TNT2016.
... [Full list available in app]
`;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are an AI assistant for Nuno de Sousa. 
      Your goal is to answer questions about Nuno's professional background, skills, publications, and education based STRICTLY on the provided resume context.
      
      Resume Context:
      ${RESUME_CONTEXT}
      
      Guidelines:
      - Be professional, polite, and concise.
      - If asked about contact info, provide the full details (emails, phones, etc.).
      - If asked about publications, you can list specific high-impact papers or summarize his research topics (Magneto-optics, Nanophotonics, etc.).
      - Highlight his PhD in Physics and 10+ years of experience.
      `,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "I am currently offline (API Key missing). Please check the configuration.";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
};