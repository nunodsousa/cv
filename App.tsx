/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Download, 
  Github, 
  Linkedin, 
  Globe, 
  Calendar,
  Code2,
  Database,
  Terminal,
  BrainCircuit,
  GraduationCap,
  Menu,
  X,
  FileText,
  ExternalLink,
  Users,
  Mic,
  Briefcase
} from 'lucide-react';
import ParticleBanner from './components/ParticleBanner';
import { Job, Education, SkillCategory } from './types';

// Publications Data
const PUBLICATIONS = [
  {
    id: 20,
    text: 'Diego R Abujetas, N de Sousa, A García-Martín, JM Llorens, JA Sánchez-Gil, "Active angular tuning and switching of Brewster quasi bound states in the continuum in magneto-optic metasurfaces", Active Photonic Platforms, PC121961Q (2022).',
    impact: '8.449'
  },
  {
    id: 19,
    text: 'Alexey Kimel, Anatoly Zvezdin, Sangeeta Sharma, Samuel Shallcross, Nuno De Sousa, Antonio García-Martín, Georgeta Salvan, Jaroslav Hamrle, Ondřej Stejskal, Jeffrey McCord, Silvia Tacchi, Giovanni Carlotti, Pietro Gambardella, Gian Salis, Markus Münzenberg, Martin Schultze, Vasily Temnov, Igor V Bychkov, Leonid N Kotov, Nicolò Maccaferri, Daria Ignatyeva, Vladimir Belotelov, Claire Donnelly, Aurelio Hierro Rodriguez, Iwao Matsuda, Thierry Ruchon, Mauro Fanciulli, Maurizio Sacchi, Chunhui Rita Du, Hailong Wang, N Peter Armitage, Mathias Schubert, Vanya Darakchieva, Bilu Liu, Ziyang Huang, Baofu Ding, Andreas Berger, Paolo Vavassori, "The 2022 magneto-optics roadmap", Journal of Physics D: Applied Physics 55 (46), 463003 (2022).',
    impact: '3.1'
  },
  {
    id: 18,
    text: 'DR Abujetas, N de Sousa, A García-Martín, JM Llorens, JA Sánchez-Gil, "Active angular tuning and switching of Brewster quasi bound states in the continuum in magneto-optic metasurfaces", Nanophotonics 10 (17), 4223-4232 (2021).',
    impact: '8.449'
  },
  {
    id: 17,
    text: 'Jorge Olmos-Trigo, Diego R Abujetas, Cristina Sanz-Fernández, Xavier Zambrana-Puyalto, Nuno de Sousa, José A Sánchez-Gil, Juan José Sáenz, "Multiple Kerker anapoles in dielectric microspheres", Laser and Photonics Reviews 2100035 (2021).',
    impact: '10.655'
  },
  {
    id: 16,
    text: 'Jorge Olmos-Trigo, Diego R Abujetas, Cristina Sanz-Fernández, Xavier Zambrana-Puyalto, Nuno de Sousa, José A Sánchez-Gil, Juan José Sáenz, "Unveiling dipolar spectral regimes of large dielectric Mie spheres from helicity conservation", Phys. Rev. Research 2 043021 (2020).',
    impact: '6.8'
  },
  {
    id: 15,
    text: 'Jorge Olmos-Trigo, Cristina Sanz-Fernández, Diego R Abujetas, Jon Lasa-Alonso, Nuno de Sousa, Aitzol García-Etxarri, José A Sánchez-Gil, Gabriel Molina-Terriza, Juan José Sáenz, "Kerker conditions upon lossless, absorption, and optical gain regimes", Phys. Rev. Lett. 125 073205 (2020).',
    impact: '9.161'
  },
  {
    id: 14,
    text: 'J. Luis-Hita, M.I. Marqués, R. Delgado-Buscalioni, N. de Sousa, L.S. Froufe-Pérez, F. Scheffold, and J.J. Sáenz, "Light Induced Inverse-Square Law Interactions between Nanoparticles: Mock Gravity at the Nanoscale", Phys. Rev. Lett. 123 143201 (2019).',
    impact: '9.227'
  },
  {
    id: 13,
    text: 'M.I. Marqués, J. Luis-Hita, V.J.L. Pastor, N. de Sousa, L.S. Froufe-Pérez, F. Scheffold, and J.J. Sáenz, "Analysis of the dynamics of electric dipoles in fluctuating electromagnetic fields", Optical Trapping and Optical Micromanipulation XV 10723, 107230Y (2018).',
    impact: null
  },
  {
    id: 12,
    text: 'P. Rodríguez-Sevilla, Y. Zhang, N. de Sousa, M.I. Marqués; F. Sanz-Rodríguez, D. Jaque, X. Liu, P. Haro-González, "Microrheometric upconversion-based techniques for intracellular viscosity measurements", Optical Trapping and Optical Micromanipulation XIV 10347, 103471S (2017).',
    impact: 'Conference proceeding'
  },
  {
    id: 11,
    text: '"Optical torques on upconverting nanoparticles", P. Rodríguez-Sevilla, Y. Zhang, N. de Sousa, M.I. Marqués; F. Sanz-Rodríguez, D. Jaque, X. Liu, P. Haro-González, Nanoletters 16, 8005 (2016).',
    impact: '13.779'
  },
  {
    id: 10,
    text: 'N. de Sousa, L.S. Froufe-Pérez, J.J. Sáenz and A. García-Martín, "Magneto-Optical Activity in High Index Dielectric Nanoantennas", Sci. Rep. 6, 30803 (2016).',
    impact: '5.228'
  },
  {
    id: 9,
    text: 'G. Armelles, A. Cebollada, A. García-Martín, F. García, and N. de Sousa, "Far and near field broad-band magneto-optical functionalities using magnetoplasmonic nanorods", ACS Photonics 3, 2427.',
    impact: '5.404'
  },
  {
    id: 8,
    text: 'M. Castro-Lopez, N. de Sousa, A. García-Martín, F.Y. Gardes, R. Sapienza, "Scattering of a plasmonic nanoantenna embedded in a silicon waveguide", Optics express 23, 28108 (2015).',
    impact: '3.148'
  },
  {
    id: 7,
    text: 'N. de Sousa, J.J. Sáenz, F. Scheffold, A. García-Martín, and L.S. Froufe-Pérez, "Fluctuations of the Electromagnetic Local Density of States as a Probe for Structural Phase Switching", Phys. Rev. A 94, 043832.',
    impact: '2.765'
  },
  {
    id: 6,
    text: 'N. de Sousa, J.J. Sáenz, F. Scheffold, A. García-Martín, and L. S. Froufe-Pérez, "Self-diffusion and dynamic coexistence in confined fluids", Journal of Physics: Condensed Matter 28, 135101 (2016).',
    impact: '2.209'
  },
  {
    id: 5,
    text: 'N. de Sousa, J.J. Sáenz, A. García-Martín, L.S. Froufe-Pérez and M. I. Marqués, "Light emission statistics in a 2D Ising lattice", Phys. Rev. A 89, 063830 (2014).',
    impact: '3.042'
  },
  {
    id: 4,
    text: 'N. de Sousa, G. Armelles, A. Cebollada, M.U. González, F. García, D. Meneses-Rodríguez, L.S. Froufe-Pérez and A. García-Martín, "Interaction Effects on the Magneto-optical Response of Magnetoplasmonic Dimers", Phys. Rev. B 89, 205419 (2014).',
    impact: '3.767'
  },
  {
    id: 3,
    text: 'G. Armelles, A. Cebollada, A. García-Martín, M.U. González, F. García, D. Meneses-Rodríguez, N. de Sousa, L.S. Froufe-Pérez, "Mimicking electromagnetically induced transparency in the magneto-optical activity of magnetoplasmonic nanoresonators", Optics Express 21, 27356 (2013).',
    impact: '3.587'
  },
  {
    id: 2,
    text: 'D.S. Schmool, F. Gonçalves, N. de Sousa, A. Apolinário, N.A. Sobolev , F. Casoli, F. Albertini, R.L. Stamps and C. Hu, "Modelling exchange-spring layered systems with perpendicular anisotropy using ferromagnetic resonance measurements", IEEE Transactions on Magnetics, IEEE Transactions on 48 11, 4081 (2012).',
    impact: '1.363'
  },
  {
    id: 1,
    text: 'N. de Sousa, A. Apolinário, P.M.S. Monteiro, D.S. Schmool, F.Vernay, H. Kachkachi, F. Casoli, F. Albertini, "Determination of the equilibrium state of an exchange spring system with perpendicular anisotropy", Phys. Rev. B 82, 104433 (2010).',
    impact: '3.772'
  }
];

const SUPERVISION_DATA = [
  { id: 5, text: 'Degree Thesis (Informatics Engineering): "Sistema Inteligente de Análise e Sumarização de Notícias de Matérias-Primas", Mário Pinto - June 2025.' },
  { id: 4, text: 'Master thesis (Telecommunication Engineering): "Machine learning applied to nanophotonics", Edurne Sáenz Párraga - September 2022.' },
  { id: 3, text: 'Degree Thesis (Informatics Engineering): "Paralelización del Proyecto Eris", Borja Leandro - October 2020.' },
  { id: 2, text: 'Master thesis (Physics): "Light scattering in diluted lattices under percolation", Cristina Sanz Fernández - June 2016.' },
  { id: 1, text: 'Master thesis (Physics): "Dynamics of a dimer in light", Jorge Olmos Trigo - June 2016.' },
];

const CONFERENCE_PROCEEDINGS = [
  { id: 5, text: 'N. de Sousa, J.J. Sáenz and A. García-Martín, "Magneto-optical activity in high-index dielectric materials", META2016, Torremolinos, Spain, 25-29 July 2016.' },
  { id: 4, text: 'G. Armelles, A. Cebollada, F. García, A. García-Martín, M.U. González, D. Meneses-Rodríguez, N. de Sousa, L.S. Froufe-Pérez, "Magneto-optical activity in interacting magneto-plasmonic nanodisks", TNT2013, Sevilla, Spain, 09 - 13 September 2013.' },
  { id: 3, text: 'D.S. Schmool, N. de Sousa, A. Apolinário, P.M.S. Monteiro, F. Casoli, F. Albertini, H. Kachkachi and F. Vernay, "Static and dynamic properties of exchange-spring systems with perpendicular anisotropy", Spin and Charge at the Nanoscale 2010, Vancouver, Canada, 01 - 04 August 2010.' },
  { id: 2, text: 'D.S. Schmool, N. de Sousa and H. Kachkachi, "Spin dynamic studies in ferromagnetic nanoparticles", International Conference on Nanomaterials: Synthesis, Characterization and Applications (ICN-2010), Kottayam, Kerala, India, 27 - 29 April, 2010.' },
  { id: 1, text: 'D.S. Schmool, N. de Sousa, H. Kachkachi, "Ferromagnetic Resonance Study in Magnetic Nanoparticles", International Conference on Microwave Magnetics, Fort Collins, Colorado USA, 12 - 14 September 2008.' }
];

const ORAL_COMMUNICATIONS = [
  { id: 32, text: 'Jose Angel Pariente, Farzaneh Bayat, Carlos Pecharomán, Manuel Marqués, Nuno Sousa, Alvaro Blanco, Antonio García-Martín and Cefe López "Fano resonance reveals Percolation in photonic crystals", CEN2016, Valencia, Spain, 20 - 22 June 2016.' },
  { id: 31, text: 'Manuel I. Marqués, Jorge Luis-Hita, N. de Sousa, Luis S. Froufe-Pérez, Frank Scheffold and Juan José Sáenz, "Dynamics of electric dipoles in fluctuating random electromagnetic fields.", CEN2016, Valencia, Spain, 20 - 22 June 2016.' },
  { id: 30, text: 'N. de Sousa, J.J. Sáenz, F. Scheffold, A. García-Martín and L.S. Froufe-Pérez, "Fluctuations of the Electromagnetic Local Density of States as a Probe for Structural Phase Switching", CEN2016, Valencia, Spain, 20 - 22 June 2016.' },
  { id: 29, text: 'N. de Sousa, L.S. Froufe-Pérez, J.J. Sáenz, A. García-Martín, M. Marqués, "Effect of long range spatial correlations on the lifetime statistics of an emitter in a two-dimensional disordered lattice", Dinamo2015, El Chaltén, Argentina, 8 - 12 April 2015. (Flash Poster)' },
  { id: 28, text: 'N. de Sousa, L.S. Froufe-Pérez, J.J. Sáenz, A. García-Martín, M. Marqués, "Effect of long range spatial correlations on the lifetime statistics of an emitter in a two-dimensional disordered lattice" Young Researchers Meeting, Madrid, Spain, 19 December 2014.' },
  { id: 27, text: 'L.S. Froufe-Pérez, N. de Sousa, J.J. Sáenz, A. García-Martín, "Light emission statistics in correlated random photonic nanostructures" Summer school "Waves and disorder",Cargese, France, 30 - 12 July 2014.' },
  { id: 26, text: 'M. Marqués, L.S. Froufe-Pérez, N. de Sousa, J.J. Sáenz, A. García-Martín "Effect of long range spatial correlations on the lifetime statistics of an emitter in a two-dimensional disordered lattice" Summer school "Waves and disorder",Cargese, France, 30 - 12 July 2014.' },
  { id: 25, text: 'A. García-Martín, N. de Sousa, L.S. Froufe-Pérez, "Magnetically controlled optical nanoantennas" CEN2014, Santander, Spain, 14 - 16 May 2014.' },
  { id: 24, text: 'N. de Sousa, L.S. Froufe-Pérez, A. García-Martín, "Control of light emission with magneto-optical particles", DPG Frühjahrstagung (Spring Meeting) 14, Dresden, Germany, 30 - 4 April 2014.' },
  { id: 23, text: 'N. de Sousa, L.S. Froufe-Pérez, A. García-Martín, "Magnetically controlled optical nanoantennas", Laboratoire PROMES CNRS, Perpignan, 06 March 2014.' },
  { id: 22, text: 'G. Armelles, A. Cebollada, F. García, , A. García-Martín, M. Ujué González, D. Meneses-Rodríguez, N. de Sousa, L.S. Froufe-Pérez, "Magneto-optical activity in interacting magnetoplasmonic nanodisks, SPP6-2013, Ottawa, Canada, 26 - 31 May 2013.' },
  { id: 21, text: 'N. de Sousa, J.J. Sáenz, A. García-Martín, L.S. Froufe-Pérez, "Light emission statistics in correated random photonic nanostructures", Complex Nanophotonics Science Camp, Windsor Great Park, United Kingdom, 27 - 30 August 2013.' },
  { id: 20, text: 'N. de Sousa, G. Armelles, A. Cebollada, F. García, M. Ujué González, D. Meneses-Rodríguez, L.S. Froufe-Pérez, A. García-Martín, "Magneto-optical response in interacting magnetoplasmonic nanodisks", 3rd Early Stage Researchers Workshop-IMDEA, Madrid, Spain, 27 - 28 June 2013.' },
  { id: 19, text: 'N. de Sousa, G. Armelles, A. Cebollada, F. García, M. Ujué González, D. Meneses-Rodríguez, L.S. Froufe-Pérez, A. García-Martín, "Theoretical study of magneto-optical activity in Au/Co/Au disks, ImagineNano2013, Bilbao, Spain, April 23 - 26 2013.' },
  { id: 18, text: 'L.S. Froufe-Pérez, N. de Sousa, J.J. Sáenz, A. García-Martín, "Light emission statistics as a local probe for structural phase switching", TNT2012, Madrid, Spain, 10 - 14 September 2012.' },
  { id: 17, text: 'N. de Sousa, J.J. Sáenz, A. García-Martín, L.S. Froufe-Pérez, "Light emission statistics in correated random photonic nanostructures", CEN2012, Carmona-Sevilla, Spain, 01 - 04 October 2012.' },
  { id: 16, text: 'N. de Sousa, J.J. Sáenz, A. García-Martín, L.S. Froufe-Pérez, "Light emission statistics in correated random photonic nanostructures", EOS Annual Meeting (EOSAM 2012), Aberdeen, Scotland, 25 - 28 September 2012.' },
  { id: 15, text: 'D.S. Schmool, F. Goncalves, N. de Sousa, A. Apolinário, N. A. Sobolev , F. Casoli, F. Albertini, R. L. Stamps and C. Hu, "Modelling exchange-spring layered systems with perpendicular anisotropy using ferromagnetic resonance measurements ", JEMS 2012, Parma, Italy, 09 - 14 September 2012.' },
  { id: 14, text: 'D.S. Schmool, F. Goncalves, N. de Sousa, A. Apolinário, N. A. Sobolev , F. Casoli, F. Albertini, R. L. Stamps and C. Hu, "Modelling exchange-spring layered systems with perpendicular anisotropy using ferromagnetic resonance measurements", Intermag 2012, Vancouver, Canada, 07 - 11 May 2012.' },
  { id: 13, text: 'D.S. Schmool, F. Goncalves, J, G. Teixeira, N. de Sousa, A. Apolinário, N. A. Sobolev, F. Casoli, F. Albertini, R. L. Stamps and C. Hu, "Spin dynamic behaviour in exchange-spring layered systems with perpendicular anisotropy ", Dynamics of Nanomagnets, Perpignan, France, 21 - 24 November 2011.' },
  { id: 12, text: 'D.S. Schmool, N. de Sousa, A. Apolinário, P. M. S. Monteiro, F. Casoli, F. Albertini, H. Kachkachi and F. Vernay, "Static and dynamic properties of exchange-spring systems with perpendicular anisotropy", MORIS 2011, Nijmegen, Netherlands, 21 - 24 June 2011.' },
  { id: 11, text: 'N. de Sousa, A. García-Martín, L.S. Froufe-Pérez, "Local density of states statistics in correlated disordered media", Transport of electrons and photons through nanoscale sized systems (TEP2010), Palencia, Spain, 18-20 April, 2010.' },
  { id: 10, text: 'D.S. Schmool, N. de Sousa, A. Apolinário, P. Monteiro, F. Casoli, F. Albertini, "Static and dynamic properties of exchange-spring systems with perpendicular anisotropy", International Conference on Nanomaterials: Synthesis, Characterization and Applications, (ICN-2010), Kottayam, Kerala, India, 27 - 29 April, 2010.' },
  { id: 9, text: 'A. Apolinário, N. de Sousa, D.S. Schmool, H. Kachkachi, F. Casoli, F. Albertini, "Ferromagnetic resonance in exchange-spring systems: magnetic anisotropies and exchange coupling in hard and soft coupled ferromagnets ", 16th Workshop on Magnetism and Intermetallics, Porto, Portugal, 04 - 06 March 2010.' },
  { id: 8, text: 'A. Apolinário, N. de Sousa, F. Casoli, F. Albertini, H. Kachkachi and D.S. Schmool, "Static properties of exchange-spring systems with perpendicular anisotropy", 16th Workshop on Magnetism and Intermetallics, Porto, Portugal, February 2010.' },
  { id: 7, text: 'D.S. Schmool, N. de Sousa, A. Apolinário, P. Monteiro, F. Casoli, F. Albertini, "Static and dynamic properties of exchange-spring systems with perpendicular anisotropy", Encontro Nacional de Física da Matéria Condensada, Lisbon 18 - 19 February 2010.' },
  { id: 6, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Theoretical study of magnetodynamics in BCC iron nanoparticles", Zaragoza, Spain, 09 - 12 March 2009.' },
  { id: 5, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Theoretical study of magnetodynamics in BCC iron nanoparticles" - Lisboa, Portugal, 15th Workshop on magnetism and intermetallics, 12 - 13 February 2009.' },
  { id: 4, text: 'A. Apolinário, D.S. Schmool, N. de Sousa ,F. Casoli, F. Albertini and H. Kachkachi, "Ferromagnetic resonance study of Fe/FePt coupled films with perpendicular anisotropy" - 15th Workshop on magnetism and intermetallics, Lisboa, Portugal, 12 - 13 February 2009.' },
  { id: 3, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Estudo teórico de magnetodinâmica em nanopartículas ferromagnéticas", Quartas Jornadas do IFIMUP - Porto, Portugal, 15 June 2008.' },
  { id: 2, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Theoretical study of magnetodynamics in ferromagnetic nanoparticles", 14th Workshop on Magnetism and Intermetallics - Coimbra, Portugal, February 2008.' },
  { id: 1, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Ressonância Ferromagnética em Nanopartículas", Terceiras Jornadas do IFIMUP - Porto, Portugal, May 2007.' },
];

const POSTER_COMMUNICATIONS = [
  { id: 17, text: 'N. de Sousa and J.J. Saenz, "Near-field effects in Anderson Localization", Dinamo - Discussions in Nanophotonics II, Siglufjörður - Iceland May 2017.' },
  { id: 16, text: 'N. de Sousa and J.J. Saenz, "Near-field effects in Anderson Localization", Spatio-temporal control of waves: from imaging to sensing 2017, Cargèse, Corsica, France April 24th-28th 2017.' },
  { id: 15, text: 'L.S. Froufe-Pérez, N. de Sousa, J.J. Saenz and A. García-Martín, "Magneto-Optical Activity in High Index Dielectric Nanoantennas", TNT2016, Fribourg, Switzerland, 5-9 September 2016.' },
  { id: 14, text: 'N. de Sousa, L.S. Froufe-Pérez, J.J. Saenz and A. García-Martín, "Magneto-Optical Activity in High Index Dielectric Nanoantennas", CEN2016, Valencia, Spain, June 2016.' },
  { id: 13, text: 'N. de Sousa, Juan José Saenz 1,2 , A. García-Martín, L. S. Froufe-Pérez, M. I. Marqués, "Effect of long-range spatial correlations on the lifetime statistics of an emitter in a two-dimensional disordered lattice", Dinamo - Discussions in Nanophotonics I, El Chalten - Argentina, May 2015.' },
  { id: 12, text: 'N. de Sousa, J.J. Saenz, A. García-Martín and L.S. Froufe-Pérez, "Light emission statistics in correlated random photonic nanostructures", Imaginenano 2011, Bilbao, Spain, 11-14 April 2011.' },
  { id: 11, text: 'I. Suárez-Lacalle, N. de Sousa, L. Froufe-Pérez, J.J. Sáenz, "Fluorescence lifetime near resonant nanoparticles", Imaginenano2011, Bilbao, Spain, 11 - 14 April 2011.' },
  { id: 10, text: 'N. de Sousa, J.J. Saenz, A. García-Martín and L.S. Froufe-Pérez, "Light emission statistics in correlated random photonic nanostructures, Nanolight meeting 2011, La Cristalera, Spain, 28 - 01 March 2011.' },
  { id: 9, text: 'D.S. Schmool, N. de Sousa, A. Apolinário, P. Monteiro and H. Kachkachi, "Theoretical study of Exchange-spring systems", Encontro Nacional de Física da Matéria Condensada, Lisbon, 18-19 February 2010.' },
  { id: 8, text: 'A. Apolinário, D.S. Schmool, N. de Sousa, F. Casoli, F. Albertini and H. Kachkachi, "Ferromagnetic resonance study of Fe/FePt coupled films with perpendicular anisotropy", Zaragoza, Spain, 09 - 12 March 2009.' },
  { id: 7, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Theoretical study of magnetodynamics in BCC iron nanoparticles", Zaragoza, Spain, 09 - 12 March 2009.' },
  { id: 6, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Theoretical study of magnetodynamics in BCC iron nanoparticles" - Porto, Portugal, 06 February 2009 IN Advisery board IFIMUP Meeting.' },
  { id: 5, text: 'A. Apolinário, D.S. Schmool, N. de Sousa, F. Casoli, F. Albertini and H. Kachkachi, "Ferromagnetic resonance study of Fe/FePt coupled films with perpendicular anisotropy" - Porto, Portugal, 06 February 2009 IN Advisery board IFIMUP Meeting.' },
  { id: 4, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Estudo teórico de magnetodinâmica em nanopartículas ferromagnéticas", Quartas Jornadas do IFIMUP - Porto, Portugal, 18 June 2008.' },
  { id: 3, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Theoretical study of magnetodynamics in ferromagnetic nanoparticles (iron)", Ninth International Workshop on Non-Crystalline Solids - Porto, Portugal, 27 - 30 April 2008.' },
  { id: 2, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Many spin approach to ferromagnetic resonance in magnetic nanostructures", International Conference on Fine Particle Magnetism, Rome, Italy, 09 - 12 October 2007.' },
  { id: 1, text: 'N. de Sousa, D.S. Schmool, H. Kachkachi, "Theoretical study of magnetodynamics in ferromagnetic nanoparticles (cobalt)", DyProSo XXXI - Porto, Portugal, 25 - 29 Setembro 2007.' }
];

const SCIENCE_PROJECTS = [
  { id: 8, period: "2023 - 2026", title: "Explorando Interacción y Fuerzas Luz-Materia en redes complejas de partículas.", ref: "PID2022-137569NB-C43" },
  { id: 7, period: "2016 - 2019", title: "Haces estruturados de Luz y Electrones: Efectos mecanicos y magneto-electricos en materia.", ref: "FIS2015-69295-C3-3-P" },
  { id: 6, period: "2013 - 2016", title: "Interacciones mecánicas en nanoestruturas inducidas por electrones y fotones.", ref: "FIS2012-36113-C03-01" },
  { id: 5, period: "2012 - 2013", title: "Microsistemas Opticos Sensores Resonantes (MICROSERES)", ref: "S2009/TIC-1476", details: "Realización de trabajos teóricos, modelado y simulación numérica en Nanofotónica aplicada al desarrollo y optimización de sensores, concretamente estudio de processos de dispersión de luz por pequeñas partículas (scattering de Rayleigh) y fuerzas ópticas inducidas" },
  { id: 4, period: "2011 - 2012", title: "Microsistemas Opticos Sensores Resonantes (MICROSERES)", ref: "S2009/TIC-1476", details: "Realización de trabajos teóricos, modelado y simulación numérica en Nanofotónica aplicada al desarrollo y optimización de sensores, concretamente estudio de processos de dispersión de luz por pequeñas partículas (scattering de Rayleigh) y fuerzas ópticas inducidas" },
  { id: 3, period: "2009 - 2010", title: "Hacia una nueva generación de cristales fotónicos sintonizables (CRIMAFOT)", ref: "Instituto de Microelectronica de Madrid, Spain", details: "Desarrollo de herramientas teóricas y su posterior utilización para la simulación de las propriedades ópticas y magneto-ópticas de cristales fotónicos con propriedades sintonizables" },
  { id: 2, period: "2007 - 2008", title: "Magnetic Damping mechanisms in coupled monodisperse FePt nanocrystals", ref: "GRICES, FCT-DAAD", details: "with the Universität Duisburg-Essen, Germany" },
  { id: 1, period: "2006 - 2007", title: "High frequency magnetic and magneto-transport properties in magnetic oxide films and all magnetic multilayers and magnetic properties", ref: "FCT, POCTi/CTM/56274/2004" }
];

const AI_PROJECTS = [
  { 
    id: 1, 
    title: "Dress recommendation system", 
    period: "2017",
    links: [
      { url: "https://www.elbierzodigital.com/una-empresa-ponferradina-seleccionada-google-referencia-internacional-inteligencia-artificial/", text: "El Bierzo Digital" },
      { url: "https://www.eleconomista.es/emprendedores-innova/noticias/8728738/11/17/Datajuicers-el-robot-que-lo-mismo-ayuda-a-comprar-ropa-que-a-ganar-dinero-con-bitcoins.html", text: "El Economista" }
    ]
  }
];

const CERTIFICATIONS = [
  {
    id: 7,
    date: "07/2018",
    title: "Python for Financial Analysis and Algorithmic Trading",
    organization: "Udemy — www.udemy.com",
    topics: "Python and Python libraries, Quantopian, Hedging",
    license: "UC-L3GCPAQX"
  },
  {
    id: 6,
    date: "2016/2017",
    title: "Specialization in Machine Learning",
    organization: "University of Washington — Coursera.org",
    topics: "Machine Learning, python, pandas, sklearn, graphlab; Regression, Classification, Clustering and Retrieval; Artificial Neural Networks; supervised and unsupervised learning.",
    license: "KWFLG6Q37ZHH (Specialization), Y8DCLRLWQN3S (Foundations), JU6QCYV9MAXR (Regression), SN4XX43P4GJQ (Classification), V7BF87M336AS (Clustering and Retrieval)"
  },
  {
    id: 5,
    date: "03/2017",
    title: "Applied Plotting, Charting and Data Representation in Python",
    organization: "University of Michigan — Coursera.org",
    duration: "4 weeks of study, 5–8 hours/week",
    license: "F33QPLFQQLPX"
  },
  {
    id: 4,
    date: "02/2017",
    title: "Inferential Statistics",
    organization: "Duke University — Coursera.org",
    duration: "5 weeks of study, 5–7 hours/week",
    license: "69HNZWNZ4DBN"
  },
  {
    id: 3,
    date: "01/2017",
    title: "Introduction to Probability and Data",
    organization: "Duke University — Coursera.org",
    duration: "5 weeks of study, 5–7 hours/week",
    license: "A6ZNE9TCY4QX"
  },
  {
    id: 2,
    date: "12/2016",
    title: "Introduction to Data Science in Python",
    organization: "University of Michigan — Coursera.org",
    duration: "4 weeks of study, 5–8 hours/week",
    license: "RGRJG5J9HGLX"
  }
];

// CV Data
const CV_DATA = {
  personal: {
    name: "Nuno MST de Sousa",
    shortName: "Nuno de Sousa",
    title: "Expert in Data Science & AI",
    summary: "Expert in Data Science and AI with over 10 years of experience and a Ph.D. in Theoretical Physics, specializing in Python-based development of advanced pricing models, business analytics, technology-driven financial systems, and machine learning algorithms. MBA candidate at CPBS.",
    emails: ["hidden for safety reasons"],
    phones: ["hidden for safety reasons"],
    location: "Oporto, Portugal",
    nationality: "Portuguese",
    birthdate: "July 28th 1982",
    gender: "Male",
    links: {
      github: "https://github.com/nunodsousa",
      linkedin: "https://www.linkedin.com/in/nunodsousa/",
      orcid: "https://orcid.org/0000-0002-3226-9683"
    }
  },
  skills: [
    { category: "Programming", skills: "Python (pandas, scikit-learn, statsmodels, NumPy), SQL (PostgreSQL, SQLAlchemy), C" },
    { category: "Modeling", skills: "Monte Carlo methods, GLM/GAM, Bayesian modeling, Survival analysis, Customer Lifetime Value (CLV)" },
    { category: "AI & Cloud", skills: "OpenAI, LangChain" },
    { category: "DevOps", skills: "Git, Docker" },
    { category: "Techniques", skills: "Deep Learning (Keras, TensorFlow), Random Forest, XGBoost, SVM, KNN, Naïve Bayes, k-Means, Hierarchical Clustering" },
    { category: "Time Series", skills: "Prophet, ARIMA, ETS, State Space, Structural Models" },
    { category: "Stats", skills: "Simulation, Optimization, Bootstrap, Monte Carlo, Hypothesis Testing, ANOVA" },
  ] as SkillCategory[],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Certified C1+" },
    { name: "Spanish", level: "Lived in Spain for 12 years" },
  ],
  experience: [
    {
      id: "1",
      role: "Expert in Data Science & AI",
      company: "DataJuicers (Remote)",
      period: "NOVEMBER 2019 — PRESENT",
      description: "Led the design, delivery, and scaling of end-to-end AI/ML and advanced analytics solutions for high-profile international clients. Acted as technical lead and strategic advisor, driving data-driven transformation across utilities, healthcare, chemicals, and energy-related domains, while supporting pre-sales, solution architecture, and executive decision-making.",
      highlights: [
        <span>
          Architected and deployed <b>production-grade data science and AI pipelines</b>, transforming <b>large, heterogeneous datasets</b> into reliable <b>analytical and forecasting platforms</b>.
        </span>,
        <span>
          Designed and implemented <b>advanced models</b> for <b>pricing optimization</b>, <b>demand forecasting</b>, <b>inventory planning</b>, and <b>market intelligence</b>, directly supporting <b>commercial and strategic decisions</b>.
        </span>,
        <span>
          Served as a key <b>business–technology interface</b>, translating complex analytical outputs into clear, actionable insights for <b>senior stakeholders</b> and non-technical audiences.
        </span>,
        <span>
          Provided <b>technical leadership</b> across <b>cross-functional teams</b>, ensuring alignment between <b>business objectives</b>, analytical rigor, and timely delivery of client solutions.
        </span>,
        <span>
          Contributed to <b>pre-sales activities</b>, including <b>solution design</b>, <b>technical validation</b>, and <b>client-facing presentations</b>, helping secure and expand long-term engagements.
        </span>,
        <span>
          <b>Key Expertise:</b> Data Science (<b>pricing</b>, <b>demand & inventory forecasting</b>, <b>market analytics</b>), <b>AI/ML systems design</b>, and <b>Business Analytics for executive decision support</b>.
        </span>
      ]
    },
    {
      id: "2",
      role: "Quantitative Analyst",
      company: "Arfima Trading (Madrid)",
      period: "APRIL 2019 — OCTOBER 2019",
      description: "Designed and deployed automated trading strategies with a focus on financial analysis and the development of robust risk management frameworks.",
      highlights: [
        "Designed, tested, and deployed automated trading strategies across futures markets, from end-of-session (EOS) to high-frequency trading.",
        "Analyzed and preprocessed financial data to identify robust trading signals.",
        "Implemented statistical and machine learning models tailored for commodity markets.",
        "Developed a custom backtesting framework to evaluate strategy performance under varying market conditions.",
        "Integrated comprehensive risk management protocols into the trading infrastructure."
      ]
    },
    {
      id: "3",
      role: "Data Scientist",
      company: "DataJuicers (Madrid)",
      period: "JUNE 2017 — MARCH 2019",
      description: "Specialized in Business Solutions, Time Series Forecasting, and Machine Learning.",
      highlights: [
        "Designed and delivered business and industry solutions using big data, time series forecasting, and machine learning methods.",
        "Applied advanced analytics to sectors including luxury, retail, services, and industry.",
        "Directed the 'Dress Recommendation System' project, recognized by Google for exemplary application of TensorFlow and computer vision in recommendation systems.",
        "Contributed to hedge fund projects through co-location, providing financial analysis and quantitative modeling services."
      ]
    },
    {
      id: "4",
      role: "Researcher/Lecturer",
      company: "Universidad Autónoma de Madrid & Donostia International Physics Center",
      period: "2009 — JUNE 2017",
      // Location for this role: Madrid and Donostia, Spain
      highlights: [
        "Teaching: Taught courses in Physics and Informatics Engineering degree programs.",
        "Supervision: Mentored students on master's theses in Condensed Matter Physics.",
        "Research: Conducted research in Computational Physics, Electrodynamics, and Mathematical Methods."
      ]
    }
  ] as Job[],
  education: [
    {
      id: "mba",
      degree: "Executive MBA",
      institution: "Católica Porto Business School - CPBS",
      period: "OCTOBER 2024 — ON GOING (JULY 2026)",
      details: ["Ongoing, with in-person sessions held three consecutive working days per month."]
    },
    {
      id: "phd",
      degree: "PhD in Theoretical Physics",
      institution: "Universidad Autónoma de Madrid",
      period: "SEPTEMBER 2010 — OCTOBER 2014",
      link: "https://sirena.csic.es/wp-content/uploads/2024/07/Tesis-Nuno.pdf",
      details: [
        "Program in Condensed Matter Physics and Nanotechnology.",
        "Dissertation: 'Light scattering in disordered and nonreciprocal media'.",
        "Degree Awarded: 'Sobresaliente Cum Laude' (maximum classification)."
      ]
    },
    {
      id: "master",
      degree: "Master in Photonics",
      institution: "Universidad Autónoma de Madrid",
      period: "SEPTEMBER 2009 — JUNE 2010",
      details: [
        "GPA of 8.8 on a linear scale from 0 to 10.",
        "Thesis on light emission statistics in correlated random photonic nanostructures."
      ]
    },
    {
      id: "licenciate",
      degree: "Licenciate in Physics",
      institution: "Universidade do Porto",
      period: "",
      details: []
    }
  ] as Education[],
  achievements: [
    { text: "Published 20 peer-reviewed journal papers.", type: 'publications', icon: FileText },
    { text: "Delivered approx. 50 oral presentations at international conferences.", type: 'presentations', icon: Mic },
    { text: "Supervision of 3 master's theses and 2 degree's Dissertations.", type: 'supervision', icon: Users },
    { text: "Research projects in Science and Artificial Intelligence.", type: 'projects', icon: Briefcase },
    { text: "Courses and Certifications.", type: 'certifications', icon: GraduationCap }
  ]
};

const SidebarItem: React.FC<{ icon?: React.ReactNode; label: string; value?: string | React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 mb-4">
    {icon && <div className="text-slate-400 mt-1 shrink-0">{icon}</div>}
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</h4>
      <div className="text-sm text-slate-100 font-medium leading-tight">{value}</div>
    </div>
  </div>
);

// Animation variants for icons
const iconAnim: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.2, 
    rotate: 15, 
    transition: { type: "spring", stiffness: 400, damping: 10 } 
  }
};

type ModalType = 'publications' | 'supervision' | 'presentations' | 'projects' | 'certifications' | null;

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const getModalContent = () => {
    switch(activeModal) {
      case 'publications':
        return {
          title: "Publications List",
          subtitle: "Peer-reviewed journal papers and conference proceedings",
          icon: <FileText className="w-5 h-5 text-blue-600" />,
          content: (
            <div className="space-y-4">
              {PUBLICATIONS.map((pub) => (
                <div key={pub.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <span className="text-blue-500 font-bold text-lg w-8 shrink-0 text-right">{pub.id}.</span>
                  <div className="flex-1">
                    <p className="text-slate-700 text-sm leading-relaxed mb-2">
                      {pub.text}
                    </p>
                    {pub.impact && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                         Impact Factor: {pub.impact}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        };
      case 'supervision':
        return {
          title: "Supervision Experience",
          subtitle: "Master's theses and degree dissertations",
          icon: <Users className="w-5 h-5 text-blue-600" />,
          content: (
             <div className="space-y-4">
               {SUPERVISION_DATA.map((item) => (
                 <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                   <span className="text-blue-500 font-bold text-lg w-8 shrink-0 text-right">{item.id}.</span>
                   <div className="flex-1">
                     <p className="text-slate-700 text-sm leading-relaxed font-medium">
                       {item.text}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
          )
        };
      case 'presentations':
        return {
          title: "Oral Presentations",
          subtitle: "Conference proceedings and international communications",
          icon: <Mic className="w-5 h-5 text-blue-600" />,
          content: (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 px-4">Oral Communications by invitation</h3>
                <div className="space-y-4">
                  {CONFERENCE_PROCEEDINGS.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                      <span className="text-blue-500 font-bold text-lg w-8 shrink-0 text-right">{item.id}.</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 px-4 border-t border-slate-200 pt-6">Oral Communications</h3>
                <div className="space-y-4">
                  {ORAL_COMMUNICATIONS.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                      <span className="text-blue-500 font-bold text-lg w-8 shrink-0 text-right">{item.id}.</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

               <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 px-4 border-t border-slate-200 pt-6">Poster Communications</h3>
                <div className="space-y-4">
                  {POSTER_COMMUNICATIONS.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                      <span className="text-blue-500 font-bold text-lg w-8 shrink-0 text-right">{item.id}.</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        };
      case 'projects':
        return {
          title: "Research Projects",
          subtitle: "Science and Artificial Intelligence projects",
          icon: <Briefcase className="w-5 h-5 text-blue-600" />,
          content: (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 px-4">Science</h3>
                <div className="space-y-4">
                  {SCIENCE_PROJECTS.map((project) => (
                    <div key={project.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                      <span className="text-blue-500 font-bold text-lg w-8 shrink-0 text-right">{project.id}.</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm leading-relaxed font-medium mb-1">
                          {project.title}
                        </p>
                        <p className="text-slate-600 text-xs mb-1">
                          <span className="font-semibold">{project.period}</span> - {project.ref}
                        </p>
                        {project.details && (
                          <p className="text-slate-600 text-xs italic mt-1">
                            {project.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 px-4 border-t border-slate-200 pt-6">Artificial Intelligence</h3>
                <div className="space-y-4">
                  {AI_PROJECTS.map((project) => (
                    <div key={project.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                      <span className="text-blue-500 font-bold text-lg w-8 shrink-0 text-right">{project.id}.</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm leading-relaxed font-medium mb-1">
                          {project.title}
                        </p>
                        <p className="text-slate-600 text-xs mb-2">
                          <span className="font-semibold">{project.period}</span>
                        </p>
                        {project.links && project.links.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                              >
                                {link.text}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        };
      case 'certifications':
        return {
          title: "Courses and Certifications",
          subtitle: "Professional development and training",
          icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
          content: (
            <div className="space-y-4">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <span className="text-blue-500 font-bold text-lg w-8 shrink-0 text-right">{cert.id}.</span>
                  <div className="flex-1">
                    <p className="text-slate-700 text-sm leading-relaxed font-medium mb-1">
                      {cert.title}
                    </p>
                    <p className="text-slate-600 text-xs mb-1">
                      <span className="font-semibold">{cert.date}</span> - {cert.organization}
                    </p>
                    {cert.duration && (
                      <p className="text-slate-600 text-xs mb-1">
                        Duration: {cert.duration}
                      </p>
                    )}
                    {cert.topics && (
                      <p className="text-slate-600 text-xs mb-1 italic">
                        Topics: {cert.topics}
                      </p>
                    )}
                    {cert.license && (
                      <p className="text-slate-500 text-xs mt-1">
                        License: <span className="font-mono">{cert.license}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        };
      default:
        return null;
    }
  };

  const modalData = getModalContent();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AIChat />
      
      {/* Top Animation Banner */}
      <ParticleBanner />

      <div className="flex flex-col md:flex-row flex-1">
        
        {/* Mobile Header / Navigation Bar */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800">
                <img 
                  src={`${import.meta.env.BASE_URL}photos/Nuno_2023.jpg`}
                  alt={CV_DATA.personal.shortName} 
                  className="w-full h-full object-cover grayscale"
                />
             </div>
             <div>
                <h1 className="font-serif font-bold text-base leading-tight">{CV_DATA.personal.shortName}</h1>
                <p className="text-blue-400 text-[10px] uppercase tracking-wider font-bold">Expert in Data Science & AI</p>
             </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-slate-300 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Sidebar - Left Column */}
        <aside className="w-full md:w-[350px] lg:w-[400px] bg-slate-900 text-white shrink-0 relative transition-all duration-300 ease-in-out md:block">
          {/* Subtle pattern background - always present */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
          </div>

          {/* Collapsible Content Wrapper for Mobile */}
          <div className={`
             relative z-10 overflow-hidden transition-all duration-500 ease-in-out
             ${isMobileMenuOpen ? 'max-h-[3500px] opacity-100 border-b border-slate-800' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100 md:border-b-0'}
             print:max-h-none print:opacity-100 print:block
          `}>
            <div className="p-8 md:p-10 flex flex-col h-full">
              {/* Profile Header (Hidden on mobile if collapsed, but visible when open) */}
              <div className="mb-10 text-center md:text-left">
                  <div className="w-32 h-32 mx-auto md:mx-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full border-4 border-slate-800 shadow-xl mb-6 overflow-hidden relative">
                    <img 
                      src={`${import.meta.env.BASE_URL}photos/Nuno_2023.jpg`}
                      alt={CV_DATA.personal.name} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h1 className="text-3xl font-serif font-bold mb-2 leading-tight">Nuno <br/> de Sousa</h1>
                  <p className="text-blue-400 font-medium text-sm tracking-wide uppercase">Expert in Data Scientist & AI</p>
              </div>

              {/* Contact Details */}
              <div className="mb-8 space-y-4">
                <motion.div 
                  className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors group cursor-default"
                  initial="rest" whileHover="hover" animate="rest"
                >
                  <motion.div variants={iconAnim} className="mt-1">
                    <Mail className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  </motion.div>
                  <div className="flex flex-col gap-1">
                    {CV_DATA.personal.emails.map((email, i) => (
                      <a key={i} href={`mailto:${email}`} className="text-sm hover:text-blue-300 transition-colors block">{email}</a>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors group cursor-default"
                  initial="rest" whileHover="hover" animate="rest"
                >
                  <motion.div variants={iconAnim} className="mt-1">
                    <Phone className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  </motion.div>
                  <div className="flex flex-col gap-1">
                    {CV_DATA.personal.phones.map((phone, i) => (
                      <span key={i} className="text-sm block">{phone}</span>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors group cursor-default"
                  initial="rest" whileHover="hover" animate="rest"
                >
                  <motion.div variants={iconAnim} className="mt-1">
                    <MapPin className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  </motion.div>
                  <span className="text-sm max-w-[200px]">{CV_DATA.personal.location}</span>
                </motion.div>

                <div className="flex items-center gap-4 pt-2">
                   <a href={CV_DATA.personal.links.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                     <Github className="w-5 h-5 hover:scale-110 transition-transform" />
                   </a>
                   <a href={CV_DATA.personal.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                     <Linkedin className="w-5 h-5 hover:scale-110 transition-transform" />
                   </a>
                   <a href={CV_DATA.personal.links.orcid} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold border border-slate-600 rounded px-1 hover:border-white">
                     ID ORCID
                   </a>
                </div>
              </div>

              {/* Download Button Sidebar */}
              <button 
                onClick={() => window.print()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 mb-10 group"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download CV</span>
              </button>

              <div className="w-full h-px bg-slate-800 mb-10" />

              {/* Personal Details */}
              <div className="mb-10">
                <SidebarItem label="Full Name" value={CV_DATA.personal.name} />
                <SidebarItem label="Nationality" value={CV_DATA.personal.nationality} />
                <SidebarItem label="Birthdate" value={CV_DATA.personal.birthdate} />
                <SidebarItem label="Gender" value={CV_DATA.personal.gender} />
              </div>

              {/* Skills Section */}
              <div className="mb-10">
                <motion.h3 
                  className="text-lg font-bold mb-6 flex items-center gap-2 cursor-default group"
                  initial="rest" whileHover="hover" animate="rest"
                >
                  <motion.div variants={iconAnim}>
                    <Terminal className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  Skills
                </motion.h3>
                <div className="space-y-6">
                    {CV_DATA.skills.map((skill, idx) => (
                      <div key={idx}>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{skill.category}</h4>
                        <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-slate-700 pl-3">{skill.skills}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <motion.h3 
                  className="text-lg font-bold mb-6 flex items-center gap-2 cursor-default group"
                  initial="rest" whileHover="hover" animate="rest"
                >
                  <motion.div variants={iconAnim}>
                    <Globe className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  Languages
                </motion.h3>
                <ul className="space-y-3">
                  {CV_DATA.languages.map((lang, idx) => (
                    <li key={idx} className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                      <span className="text-sm font-medium">{lang.name}</span>
                      <span className="text-xs text-slate-400">{lang.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Right Column */}
        <main className="flex-1 p-6 md:p-12 lg:p-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Summary */}
            <section className="mb-16">
              <motion.h2 
                className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-3 cursor-default group"
                initial="rest" whileHover="hover" animate="rest"
              >
                <motion.div variants={iconAnim}>
                  <BrainCircuit className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </motion.div>
                Profile
              </motion.h2>
              <p className="text-lg text-slate-700 leading-relaxed font-serif">
                <strong>Expert in Data Science and AI</strong> with over <strong>10 years of experience</strong> and a <strong>Ph.D. in Theoretical Physics</strong>, specializing in <strong>Python</strong>-based development of advanced <strong>pricing models</strong>, <strong>business analytics</strong>, technology-driven <strong>financial systems</strong>, and <strong>machine learning algorithms</strong>. <strong>MBA candidate</strong> at <strong>CPBS</strong>.
              </p>
            </section>

            {/* Employment History */}
            <section className="mb-16">
              <motion.h2 
                className="text-2xl font-bold text-slate-900 mb-8 uppercase tracking-wider flex items-center gap-3 cursor-default group"
                initial="rest" whileHover="hover" animate="rest"
              >
                <motion.div variants={iconAnim}>
                  <Code2 className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </motion.div>
                Employment History
              </motion.h2>
              
              <div className="space-y-12 relative">
                {/* Timeline Line */}
                <div className="absolute left-0 md:-left-8 top-2 bottom-0 w-px bg-slate-200 hidden md:block" />

                {CV_DATA.experience.map((job, idx) => (
                  <div 
                    key={job.id} 
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute md:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-blue-600 border-4 border-white shadow-sm hidden md:block" />

                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{job.role}</h3>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">{job.period}</span>
                    </div>
                    
                    <p className="text-base font-semibold text-slate-600 mb-4 flex items-center gap-2">
                      {job.company} 
                      {job.location && <span className="text-xs font-normal text-slate-400">• {job.location}</span>}
                    </p>
                    
                    {job.description && (
                      <p className="text-slate-600 mb-4 italic text-sm">{job.description}</p>
                    )}

                    <ul className="space-y-2">
                      {job.highlights.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Education */}
              <section>
                <motion.h2 
                  className="text-2xl font-bold text-slate-900 mb-8 uppercase tracking-wider flex items-center gap-3 cursor-default group"
                  initial="rest" whileHover="hover" animate="rest"
                >
                  <motion.div variants={iconAnim}>
                    <GraduationCap className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </motion.div>
                  Education
                </motion.h2>
                <div className="space-y-8">
                  {CV_DATA.education.map((edu, idx) => (
                    <div key={idx} className="group">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{edu.degree}</h3>
                      <p className="text-sm font-medium text-slate-600 mb-1">{edu.institution}</p>
                      {edu.period && <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">{edu.period}</p>}
                      {edu.details.length > 0 && (
                        <ul className="space-y-1 mt-2">
                          {edu.details.map((detail, i) => (
                            <li key={i} className="text-xs text-slate-500">• {detail}</li>
                          ))}
                        </ul>
                      )}
                      {edu.link && (
                        <a href={edu.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 font-medium">
                          <ExternalLink className="w-3 h-3" />
                          View Thesis
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section>
                <motion.h2 
                  className="text-2xl font-bold text-slate-900 mb-8 uppercase tracking-wider flex items-center gap-3 cursor-default group"
                  initial="rest" whileHover="hover" animate="rest"
                >
                  <motion.div variants={iconAnim}>
                    <Database className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </motion.div>
                  Achievements
                </motion.h2>
                <ul className="space-y-4">
                  {CV_DATA.achievements.map((achievement, idx) => (
                    <li 
                      key={idx} 
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-700 flex gap-3 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
                      onClick={() => setActiveModal(achievement.type as ModalType)}
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <achievement.icon className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex-1">
                        {achievement.text}
                        <div className="mt-2 text-xs text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                           <achievement.icon className="w-3 h-3" />
                           Click to view full list
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
              <p>© {new Date().getFullYear()} Nuno de Sousa. All rights reserved.</p>
              <div className="flex gap-4 mt-6 md:mt-0">
                <button 
                  onClick={() => window.print()} 
                  className="bg-slate-900 text-white hover:bg-blue-600 px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md font-medium"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>

          </motion.div>
        </main>
      </div>

      {/* Dynamic Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {modalData?.icon}
                    {modalData?.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">{modalData?.subtitle}</p>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="overflow-y-auto p-6">
                {modalData?.content}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;