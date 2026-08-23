/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

const RESUME_CONTEXT = `
NAME: Nuno Miguel Santos Teixeira de Sousa (Nuno de Sousa)
TITLE: Data & AI Lead | Subject Matter Expert | Data Scientist
FOCUS: Quantitative Strategy, Pricing, Forecasting & AI
SUMMARY: Data Science and AI leader with over 10 years of experience combining quantitative expertise with business strategy and organizational leadership. Currently works as a Data Scientist and Subject Matter Expert, developing pricing and forecasting solutions for complex, data-sparse markets. Has led multidisciplinary teams of more than 10 professionals and delivered strategic analytics and AI initiatives for international clients across energy, finance, chemicals and industrial sectors. Holds a PhD in Theoretical Physics and is completing an Executive MBA, bringing together analytical rigor, executive communication and a growing focus on strategy, management and business leadership.

CONTACT (some info is hidden for privacy reasons):
- Emails: nunoxxxxxxxx@gmail.com, nunoxxxxxxxx@simia-tech.com 
- Phones: +351 xx xxx xx xx, +34 xxx xx xx xx
- Website: https://github.com/nunodsousa
- LinkedIn: www.linkedin.com/in/nunodsousa/
- ORCID: 0000-0002-3226-9683
- Gender: Male
- Nationality: Portuguese

EMPLOYMENT HISTORY:
1. Data Scientist | Subject Matter Expert in Quantitative Modelling, Pricing & Forecasting - AuctionConnect (Oporto/Remote) [Mar 2026 - Present]
   - Serves as a subject matter expert at the intersection of data science, pricing strategy and market intelligence, developing quantitative capabilities that improve price transparency and support decision-making in the global marine fuels market.
   - Defines the analytical approach for nowcasting and forecasting bunker fuel prices across global ports, aligning model development with commercial priorities and market needs.
   - Transforms fragmented market data, economic indicators and pricing signals into actionable intelligence for commercial planning, risk assessment and strategic decision-making.
   - Develops robust statistical and machine learning frameworks for complex, data-sparse markets, balancing analytical accuracy with business applicability.
   - Communicates model outputs, assumptions and market implications in a clear and decision-oriented format for business stakeholders.
   - Contributes specialist knowledge to the evolution of data products and pricing capabilities, connecting quantitative development with long-term business value.

2. Data & AI Lead | Subject Matter Expert - DataJuicers and Simia-Tech (Madrid, Oporto & Remote) [Nov 2019 - Mar 2026]
   - Defined/implemented end-to-end AI/ML/data science solutions for high-profile clients across utilities, chemicals and energy-related domains.
   - Processed/structured large datasets.
   - Acted as business translator between technical teams and stakeholders.
   - Led cross-functional teams of more than 10 professionals (data scientists, engineers, and analysts).
   - Expertise: Market analysis, pricing strategies, demand forecasting, process optimization.

3. Quantitative Analyst - Arfima Trading (Madrid) [Apr 2019 - Oct 2019]
   - Designed/deployed automated trading strategies (futures, EOS to HFT).
   - Analyzed financial data for trading signals.
   - Implemented ML models for commodities.
   - Developed backtesting frameworks and risk management protocols.

4. Data Scientist - DataJuicers (Madrid) [Jun 2017 - Mar 2019]
   - Specialized in Business Solutions, Time Series Forecasting, ML.
   - Sectors: Luxury, retail, services, industry.
   - Directed "Dress Recommendation System" (recognized by Google for TensorFlow/CV application).
   - Hedge fund projects (financial analysis/modeling).

5. Researcher/Lecturer - Universidad Autónoma de Madrid [2009 - Jun 2017]
   - Teaching Physics/Informatics Engineering.
   - Research in Computational Physics, Electrodynamics, Mathematical Methods.

EDUCATION:
- MBA (Católica Porto Business School - CPBS) [Oct 2024 - Expected Oct 2026]
- PhD in Theoretical Physics (Universidad Autónoma de Madrid) [Sep 2010 - Oct 2014]. Cum Laude.
  - Thesis: 'Light scattering in disordered and nonreciprocal media'.
  - Link: https://sirena.csic.es/wp-content/uploads/2024/07/Tesis-Nuno.pdf
- Master in Photonics (UAM) [Sep 2009 - Jun 2010]. GPA 8.8/10.
- Licentiate Degree in Physics (Universidade do Porto).

SKILLS:
- Quantitative Modelling: Pricing models, time-series forecasting (ARIMA, ETS, state space, Prophet), Bayesian modelling, simulation, optimization, survival analysis, customer lifetime value.
- Machine Learning & AI: scikit-learn, XGBoost, TensorFlow, LLM applications, RAG, model evaluation, agentic workflows.
- Data & Production Systems: Python, SQL, pandas, NumPy, statsmodels, Docker, Git, Azure, workflow orchestration (n8n).
- Business Applications: Pricing optimization, demand forecasting, inventory planning, market intelligence, quantitative trading.
- Leadership & Management: Data & AI strategy, solution architecture, prioritization and delivery of analytics initiatives, business–technology alignment, leadership of multidisciplinary teams of more than 10 professionals, cross-functional coordination, technical direction, executive stakeholder communication, strategic advisory, pre-sales, and client-facing solution design.
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
