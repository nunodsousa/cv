/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { GraduationCap, FileText, Users, Mic, Briefcase } from 'lucide-react';
import { Job, Education, SkillCategory } from './types';

// Publications Data
export const PUBLICATIONS = [
  {
    id: 21,
    text: 'SC Silva, GT Elena, N de Sousa, "Dark Patterns: Reclaiming Autonomy in Online Shopping in the Age of AI", Encyclopedia of Artificial Intelligence in Marketing, 1-13 (2026).',
    impact: 'Encyclopedia entry',
    url: 'https://link.springer.com/rwe/10.1007/978-3-031-75316-9_108-1'
  },
  {
    id: 20,
    text: 'Diego R Abujetas, N de Sousa, A García-Martín, JM Llorens, JA Sánchez-Gil, "Active angular tuning and switching of Brewster quasi bound states in the continuum in magneto-optic metasurfaces", Active Photonic Platforms, PC121961Q (2022).',
    impact: '8.449',
    url: 'https://doi.org/10.1117/12.2632711'
  },
  {
    id: 19,
    text: 'Alexey Kimel, Anatoly Zvezdin, Sangeeta Sharma, Samuel Shallcross, Nuno De Sousa, Antonio García-Martín, Georgeta Salvan, Jaroslav Hamrle, Ondřej Stejskal, Jeffrey McCord, Silvia Tacchi, Giovanni Carlotti, Pietro Gambardella, Gian Salis, Markus Münzenberg, Martin Schultze, Vasily Temnov, Igor V Bychkov, Leonid N Kotov, Nicolò Maccaferri, Daria Ignatyeva, Vladimir Belotelov, Claire Donnelly, Aurelio Hierro Rodriguez, Iwao Matsuda, Thierry Ruchon, Mauro Fanciulli, Maurizio Sacchi, Chunhui Rita Du, Hailong Wang, N Peter Armitage, Mathias Schubert, Vanya Darakchieva, Bilu Liu, Ziyang Huang, Baofu Ding, Andreas Berger, Paolo Vavassori, "The 2022 magneto-optics roadmap", Journal of Physics D: Applied Physics 55 (46), 463003 (2022).',
    impact: '3.1',
    url: 'https://iopscience.iop.org/article/10.1088/1361-6463/ac8da0'
  },
  {
    id: 18,
    text: 'DR Abujetas, N de Sousa, A García-Martín, JM Llorens, JA Sánchez-Gil, "Active angular tuning and switching of Brewster quasi bound states in the continuum in magneto-optic metasurfaces", Nanophotonics 10 (17), 4223-4232 (2021).',
    impact: '8.449',
    url: 'https://doi.org/10.1515/nanoph-2021-0412'
  },
  {
    id: 17,
    text: 'Jorge Olmos-Trigo, Diego R Abujetas, Cristina Sanz-Fernández, Xavier Zambrana-Puyalto, Nuno de Sousa, José A Sánchez-Gil, Juan José Sáenz, "Multiple Kerker anapoles in dielectric microspheres", Laser and Photonics Reviews 2100035 (2021).',
    impact: '10.655',
    url: 'https://doi.org/10.1002/lpor.202100035'
  },
  {
    id: 16,
    text: 'Jorge Olmos-Trigo, Diego R Abujetas, Cristina Sanz-Fernández, Xavier Zambrana-Puyalto, Nuno de Sousa, José A Sánchez-Gil, Juan José Sáenz, "Unveiling dipolar spectral regimes of large dielectric Mie spheres from helicity conservation", Phys. Rev. Research 2 043021 (2020).',
    impact: '6.8',
    url: 'https://doi.org/10.1103/PhysRevResearch.2.043021'
  },
  {
    id: 15,
    text: 'Jorge Olmos-Trigo, Cristina Sanz-Fernández, Diego R Abujetas, Jon Lasa-Alonso, Nuno de Sousa, Aitzol García-Etxarri, José A Sánchez-Gil, Gabriel Molina-Terriza, Juan José Sáenz, "Kerker conditions upon lossless, absorption, and optical gain regimes", Phys. Rev. Lett. 125 073205 (2020).',
    impact: '9.161',
    url: 'https://doi.org/10.1103/PhysRevLett.125.073205'
  },
  {
    id: 14,
    text: 'J. Luis-Hita, M.I. Marqués, R. Delgado-Buscalioni, N. de Sousa, L.S. Froufe-Pérez, F. Scheffold, and J.J. Sáenz, "Light Induced Inverse-Square Law Interactions between Nanoparticles: Mock Gravity at the Nanoscale", Phys. Rev. Lett. 123 143201 (2019).',
    impact: '9.227',
    url: 'https://doi.org/10.1103/PhysRevLett.123.143201'
  },
  {
    id: 13,
    text: 'M.I. Marqués, J. Luis-Hita, V.J.L. Pastor, N. de Sousa, L.S. Froufe-Pérez, F. Scheffold, and J.J. Sáenz, "Analysis of the dynamics of electric dipoles in fluctuating electromagnetic fields", Optical Trapping and Optical Micromanipulation XV 10723, 107230Y (2018).',
    impact: 'Conference proceeding',
    url: 'https://doi.org/10.1117/12.2320575'
  },
  {
    id: 12,
    text: 'P. Rodríguez-Sevilla, Y. Zhang, N. de Sousa, M.I. Marqués; F. Sanz-Rodríguez, D. Jaque, X. Liu, P. Haro-González, "Microrheometric upconversion-based techniques for intracellular viscosity measurements", Optical Trapping and Optical Micromanipulation XIV 10347, 103471S (2017).',
    impact: 'Conference proceeding',
    url: 'https://doi.org/10.1117/12.2275944'
  },
  {
    id: 11,
    text: '"Optical torques on upconverting nanoparticles", P. Rodríguez-Sevilla, Y. Zhang, N. de Sousa, M.I. Marqués; F. Sanz-Rodríguez, D. Jaque, X. Liu, P. Haro-González, Nanoletters 16, 8005 (2016).',
    impact: '13.779',
    url: 'https://doi.org/10.1021/acs.nanolett.6b04583'
  },
  {
    id: 10,
    text: 'N. de Sousa, L.S. Froufe-Pérez, J.J. Sáenz and A. García-Martín, "Magneto-Optical Activity in High Index Dielectric Nanoantennas", Sci. Rep. 6, 30803 (2016).',
    impact: '5.228',
    url: 'https://doi.org/10.1038/srep30803'
  },
  {
    id: 9,
    text: 'G. Armelles, A. Cebollada, A. García-Martín, F. García, and N. de Sousa, "Far and near field broad-band magneto-optical functionalities using magnetoplasmonic nanorods", ACS Photonics 3, 2427.',
    impact: '5.404',
    url: 'https://doi.org/10.1021/acsphotonics.6b00670'
  },
  {
    id: 8,
    text: 'M. Castro-Lopez, N. de Sousa, A. García-Martín, F.Y. Gardes, R. Sapienza, "Scattering of a plasmonic nanoantenna embedded in a silicon waveguide", Optics express 23, 28108 (2015).',
    impact: '3.148',
    url: 'https://doi.org/10.1364/OE.23.028108'
  },
  {
    id: 7,
    text: 'N. de Sousa, J.J. Sáenz, F. Scheffold, A. García-Martín, and L.S. Froufe-Pérez, "Fluctuations of the Electromagnetic Local Density of States as a Probe for Structural Phase Switching", Phys. Rev. A 94, 043832.',
    impact: '2.765',
    url: 'https://doi.org/10.1103/PhysRevA.94.043832'
  },
  {
    id: 6,
    text: 'N. de Sousa, J.J. Sáenz, F. Scheffold, A. García-Martín, and L. S. Froufe-Pérez, "Self-diffusion and dynamic coexistence in confined fluids", Journal of Physics: Condensed Matter 28, 135101 (2016).',
    impact: '2.209',
    url: 'https://doi.org/10.1088/0953-8984/28/13/135101'
  },
  {
    id: 5,
    text: 'N. de Sousa, J.J. Sáenz, A. García-Martín, L.S. Froufe-Pérez and M. I. Marqués, "Light emission statistics in a 2D Ising lattice", Phys. Rev. A 89, 063830 (2014).',
    impact: '3.042',
    url: 'https://doi.org/10.1103/PhysRevA.89.063830'
  },
  {
    id: 4,
    text: 'N. de Sousa, G. Armelles, A. Cebollada, M.U. González, F. García, D. Meneses-Rodríguez, L.S. Froufe-Pérez and A. García-Martín, "Interaction Effects on the Magneto-optical Response of Magnetoplasmonic Dimers", Phys. Rev. B 89, 205419 (2014).',
    impact: '3.767',
    url: 'https://doi.org/10.1103/PhysRevB.89.205419'
  },
  {
    id: 3,
    text: 'G. Armelles, A. Cebollada, A. García-Martín, M.U. González, F. García, D. Meneses-Rodríguez, N. de Sousa, L.S. Froufe-Pérez, "Mimicking electromagnetically induced transparency in the magneto-optical activity of magnetoplasmonic nanoresonators", Optics Express 21, 27356 (2013).',
    impact: '3.587',
    url: 'https://doi.org/10.1364/OE.21.027356'
  },
  {
    id: 2,
    text: 'D.S. Schmool, F. Gonçalves, N. de Sousa, A. Apolinário, N.A. Sobolev , F. Casoli, F. Albertini, R.L. Stamps and C. Hu, "Modelling exchange-spring layered systems with perpendicular anisotropy using ferromagnetic resonance measurements", IEEE Transactions on Magnetics, IEEE Transactions on 48 11, 4081 (2012).',
    impact: '1.363',
    url: 'https://doi.org/10.1109/TMAG.2012.2195645'
  },
  {
    id: 1,
    text: 'N. de Sousa, A. Apolinário, P.M.S. Monteiro, D.S. Schmool, F.Vernay, H. Kachkachi, F. Casoli, F. Albertini, "Determination of the equilibrium state of an exchange spring system with perpendicular anisotropy", Phys. Rev. B 82, 104433 (2010).',
    impact: '3.772',
    url: 'https://doi.org/10.1103/PhysRevB.82.104433'
  }
];

export const SUPERVISION_DATA = [
  { id: 5, text: 'Degree Thesis (Informatics Engineering): "Sistema Inteligente de Análise e Sumarização de Notícias de Matérias-Primas", Mário Pinto - June 2025.' },
  { id: 4, text: 'Master thesis (Telecommunication Engineering): "Machine learning applied to nanophotonics", Edurne Sáenz Párraga - September 2022.' },
  { id: 3, text: 'Degree Thesis (Informatics Engineering): "Paralelización del Proyecto Eris", Borja Leandro - October 2020.' },
  { id: 2, text: 'Master thesis (Physics): "Light scattering in diluted lattices under percolation", Cristina Sanz Fernández - June 2016.' },
  { id: 1, text: 'Master thesis (Physics): "Dynamics of a dimer in light", Jorge Olmos Trigo - June 2016.' },
];

export const CONFERENCE_PROCEEDINGS = [
  { id: 5, text: 'N. de Sousa, J.J. Sáenz and A. García-Martín, "Magneto-optical activity in high-index dielectric materials", META2016, Torremolinos, Spain, 25-29 July 2016.' },
  { id: 4, text: 'G. Armelles, A. Cebollada, F. García, A. García-Martín, M.U. González, D. Meneses-Rodríguez, N. de Sousa, L.S. Froufe-Pérez, "Magneto-optical activity in interacting magneto-plasmonic nanodisks", TNT2013, Sevilla, Spain, 09 - 13 September 2013.' },
  { id: 3, text: 'D.S. Schmool, N. de Sousa, A. Apolinário, P.M.S. Monteiro, F. Casoli, F. Albertini, H. Kachkachi and F. Vernay, "Static and dynamic properties of exchange-spring systems with perpendicular anisotropy", Spin and Charge at the Nanoscale 2010, Vancouver, Canada, 01 - 04 August 2010.' },
  { id: 2, text: 'D.S. Schmool, N. de Sousa and H. Kachkachi, "Spin dynamic studies in ferromagnetic nanoparticles", International Conference on Nanomaterials: Synthesis, Characterization and Applications (ICN-2010), Kottayam, Kerala, India, 27 - 29 April, 2010.' },
  { id: 1, text: 'D.S. Schmool, N. de Sousa, H. Kachkachi, "Ferromagnetic Resonance Study in Magnetic Nanoparticles", International Conference on Microwave Magnetics, Fort Collins, Colorado USA, 12 - 14 September 2008.' }
];

export const ORAL_COMMUNICATIONS = [
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

export const POSTER_COMMUNICATIONS = [
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

export const SCIENCE_PROJECTS = [
  { id: 8, period: "2023 - 2026", title: "Explorando Interacción y Fuerzas Luz-Materia en redes complejas de partículas.", ref: "PID2022-137569NB-C43" },
  { id: 7, period: "2016 - 2019", title: "Haces estruturados de Luz y Electrones: Efectos mecanicos y magneto-electricos en materia.", ref: "FIS2015-69295-C3-3-P" },
  { id: 6, period: "2013 - 2016", title: "Interacciones mecánicas en nanoestruturas inducidas por electrones y fotones.", ref: "FIS2012-36113-C03-01" },
  { id: 5, period: "2012 - 2013", title: "Microsistemas Opticos Sensores Resonantes (MICROSERES)", ref: "S2009/TIC-1476", details: "Realización de trabajos teóricos, modelado y simulación numérica en Nanofotónica aplicada al desarrollo y optimización de sensores, concretamente estudio de processos de dispersión de luz por pequeñas partículas (scattering de Rayleigh) y fuerzas ópticas inducidas" },
  { id: 4, period: "2011 - 2012", title: "Microsistemas Opticos Sensores Resonantes (MICROSERES)", ref: "S2009/TIC-1476", details: "Realización de trabajos teóricos, modelado y simulación numérica en Nanofotónica aplicada al desarrollo y optimización de sensores, concretamente estudio de processos de dispersión de luz por pequeñas partículas (scattering de Rayleigh) y fuerzas ópticas inducidas" },
  { id: 3, period: "2009 - 2010", title: "Hacia una nueva generación de cristales fotónicos sintonizables (CRIMAFOT)", ref: "Instituto de Microelectronica de Madrid, Spain", details: "Desarrollo de herramientas teóricas y su posterior utilización para la simulación de las propriedades ópticas y magneto-ópticas de cristales fotónicos con propriedades sintonizables" },
  { id: 2, period: "2007 - 2008", title: "Magnetic Damping mechanisms in coupled monodisperse FePt nanocrystals", ref: "GRICES, FCT-DAAD", details: "with the Universität Duisburg-Essen, Germany" },
  { id: 1, period: "2006 - 2007", title: "High frequency magnetic and magneto-transport properties in magnetic oxide films and all magnetic multilayers and magnetic properties", ref: "FCT, POCTi/CTM/56274/2004" }
];

export const AI_PROJECTS = [
  { 
    id: 1, 
    title: "Dress Recommendation System", 
    period: "2017",
    details: "Led the Dress Recommendation System project, which was recognized by Google for its exemplary application of TensorFlow and computer vision technologies in recommendation systems.",
    links: [
      { url: "https://www.elbierzodigital.com/una-empresa-ponferradina-seleccionada-google-referencia-internacional-inteligencia-artificial/", text: "El Bierzo Digital" },
      { url: "https://www.eleconomista.es/emprendedores-innova/noticias/8728738/11/17/Datajuicers-el-robot-que-lo-mismo-ayuda-a-comprar-ropa-que-a-ganar-dinero-con-bitcoins.html", text: "El Economista" }
    ]
  }
];

export const CERTIFICATIONS = [
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
export const CV_DATA = {
  personal: {
    name: "Nuno MST de Sousa",
    shortName: "Nuno de Sousa",
    title: "Data Scientist & Subject Matter Expert | Quantitative Strategy, Forecasting & AI",
    summary: "Data Science and AI leader with over 10 years of experience combining quantitative expertise with business strategy and organizational leadership. Currently works as a Data Scientist and Subject Matter Expert, developing pricing and forecasting solutions for complex, data-sparse markets. Has led multidisciplinary teams of more than 10 professionals and delivered strategic analytics and AI initiatives for international clients across energy, finance, chemicals and industrial sectors. Holds a PhD in Theoretical Physics and is completing an Executive MBA, bringing together analytical rigor, executive communication and a growing focus on strategy, management and business leadership.",
    // Same sentence, with the load-bearing phrases marked. Kept alongside the
    // plain string above, which still feeds the page description and any
    // context that needs unformatted text.
    summaryRich: (
      <>
        <b>Data Science and AI leader</b> with <b>over 10 years of experience</b>{' '}
        combining <b>quantitative expertise</b> with <b>business strategy</b> and{' '}
        <b>organizational leadership</b>. Currently works as a <b>Data Scientist
        and Subject Matter Expert</b>, developing <b>pricing and forecasting
        solutions</b> for <b>complex, data-sparse markets</b>. Has led{' '}
        <b>multidisciplinary teams of more than 10 professionals</b> and delivered{' '}
        <b>strategic analytics and AI initiatives</b> for <b>international
        clients</b> across energy, finance, chemicals and industrial sectors.
        Holds a <b>PhD in Theoretical Physics</b> and is completing an{' '}
        <b>Executive MBA</b>, bringing together analytical rigor,{' '}
        <b>executive communication</b> and a growing focus on <b>strategy,
        management and business leadership</b>.
      </>
    ),
    emails: ["(hidden)"],
    phones: ["(hidden)"],
    location: "Oporto, Portugal",
    nationality: "Portuguese",
    birthdate: "(hidden)",
    gender: "Male",
    links: {
      github: "https://github.com/nunodsousa",
      linkedin: "https://www.linkedin.com/in/nunodsousa/",
      orcid: "https://orcid.org/0000-0002-3226-9683",
      scholar: "https://scholar.google.com/citations?user=IDuNw5EAAAAJ&hl=pt-PT"
    }
  },
  // Organised by what the work *is*, not by what tool happens to do it. A long
  // roll-call of algorithms reads as coursework at this level; capability —
  // "I can price a market with sparse data" — is what carries.
  skills: [
    { category: "Quantitative Modelling", skills: "Pricing models, time-series forecasting (ARIMA, ETS, state space, Prophet), Bayesian modelling, simulation, optimization, survival analysis, customer lifetime value" },
    { category: "Machine Learning & AI", skills: "scikit-learn, XGBoost, TensorFlow, LLM applications, RAG, model evaluation, agentic workflows" },
    { category: "Data & Production Systems", skills: "Python, SQL, pandas, NumPy, statsmodels, Docker, Git, Azure, workflow orchestration (n8n)" },
    { category: "Business Applications", skills: "Pricing optimization, demand forecasting, inventory planning, market intelligence, quantitative trading" },
    { category: "Strategy & Delivery", skills: "Data & AI strategy, solution architecture, prioritization and delivery of analytics initiatives, business–technology alignment" },
    { category: "People Leadership", skills: "Leadership of multidisciplinary teams of more than 10 professionals, cross-functional coordination, technical direction" },
    { category: "Stakeholders & Growth", skills: "Executive stakeholder communication, strategic advisory, pre-sales, client-facing solution design" },
  ] as SkillCategory[],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Certified C1+ (cert. 08/2024)" },
    { name: "Spanish", level: "Lived in Spain for 12 years" },
  ],
  experience: [
    {
      id: "0",
      role: "Data Scientist | Subject Matter Expert in Quantitative Modelling, Pricing & Forecasting",
      company: "AuctionConnect (Oporto/Remote)",
      period: "Mar 2026 - Present",
      description: "Serves as a subject matter expert at the intersection of data science, pricing strategy and market intelligence, developing quantitative capabilities that improve price transparency and support decision-making in the global marine fuels market.",
      highlights: [
        <span>
          Defines the <b>analytical approach</b> for nowcasting and forecasting bunker fuel prices across global ports, aligning model development with <b>commercial priorities and market needs</b>.
        </span>,
        <span>
          Transforms fragmented market data, economic indicators and pricing signals into <b>actionable intelligence</b> for commercial planning, risk assessment and <b>strategic decision-making</b>.
        </span>,
        <span>
          Develops robust statistical and machine learning frameworks for <b>complex, data-sparse markets</b>, balancing analytical accuracy with <b>business applicability</b>.
        </span>,
        <span>
          Communicates model outputs, assumptions and market implications in a clear and <b>decision-oriented format</b> for business stakeholders.
        </span>,
        <span>
          Contributes specialist knowledge to the evolution of data products and pricing capabilities, connecting quantitative development with <b>long-term business value</b>.
        </span>
      ]
    },
    {
      id: "1",
      role: "Data & AI Lead | Subject Matter Expert",
      company: "DataJuicers and Simia-Tech (Madrid, Oporto & Remote)",
      companyUrl: "https://www.datajuicers.com",
      period: "Nov 2019 - Mar 2026",
      description: "Led multidisciplinary teams of more than 10 professionals delivering and scaling end-to-end AI/ML and advanced analytics solutions for high-profile international clients. Acted as Data & AI lead, subject matter expert and strategic advisor, driving data-driven transformation across utilities, chemicals and energy-related domains, while supporting pre-sales, solution architecture and executive decision-making.",
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
          <b>Led cross-functional teams of more than 10 professionals</b> — data scientists, engineers, and analysts — providing <b>technical leadership</b> and ensuring alignment between <b>business objectives</b>, analytical rigor, and timely delivery of client solutions.
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
      companyUrl: "https://www.arfima.com",
      period: "Apr 2019 - Oct 2019",
      description: "Designed and deployed automated trading strategies with a focus on financial analysis and the development of robust risk management frameworks.",
      highlights: [
        <span>
          Designed, tested, and deployed <b>automated trading strategies</b> across <b>futures markets</b>, from <b>end-of-session (EOS)</b> to <b>high-frequency trading</b>.
        </span>,
        <span>
          Analyzed and preprocessed <b>financial data</b> to identify robust <b>trading signals</b>.
        </span>,
        <span>
          Implemented <b>statistical and machine learning models</b> tailored for <b>commodity markets</b>.
        </span>,
        <span>
          Developed a custom <b>backtesting framework</b> to evaluate <b>strategy performance</b> under varying market conditions.
        </span>,
        <span>
          Integrated comprehensive <b>risk management protocols</b> into the <b>trading infrastructure</b>.
        </span>
      ]
    },
    {
      id: "3",
      role: "Data Scientist",
      company: "DataJuicers (Madrid)",
      companyUrl: "https://www.datajuicers.com",
      period: "Jun 2017 - Mar 2019",
      description: "Specialized in Business Solutions, Time Series Forecasting, and Machine Learning.",
      highlights: [
        <span>
          Designed and delivered <b>business and industry solutions</b> using <b>big data</b>, <b>time series forecasting</b>, and <b>machine learning</b> methods.
        </span>,
        <span>
          Applied <b>advanced analytics</b> to sectors including <b>luxury, retail, services, and industry</b>.
        </span>,
        <span>
          Led the <b>Dress Recommendation System</b> project, which was <b>recognized by Google</b> for its exemplary application of <b>TensorFlow</b> and <b>computer vision</b> technologies in <b>recommendation systems</b>.
        </span>,
        <span>
          Contributed to <b>hedge fund projects</b> through <b>co-location</b>, providing <b>financial analysis</b> and <b>quantitative modeling</b> services.
        </span>
      ]
    },
    {
      id: "4",
      role: "Researcher/Lecturer",
      company: "Universidad Autónoma de Madrid & Donostia International Physics Center",
      period: "2009 - Jun 2017",
      // Location for this role: Madrid and Donostia, Spain
      highlights: [
        <span>
          <b>Teaching:</b> Taught courses in <b>Physics</b> and <b>Informatics Engineering</b> degree programs.
        </span>,
        <span>
          <b>Supervision:</b> Mentored students on <b>master&apos;s theses</b> in <b>Condensed Matter Physics</b>.
        </span>,
        <span>
          <b>Research:</b> Conducted research in <b>Computational Physics</b>, <b>Electrodynamics</b>, and <b>Mathematical Methods</b>.
        </span>
      ]
    }
  ] as Job[],
  education: [
    {
      id: "mba",
      degree: "Executive MBA",
      institution: "Católica Porto Business School - CPBS",
      institutionUrl: "https://catolicabs.porto.ucp.pt",
      period: "Oct 2024 - Expected Oct 2026",
      details: [
        "Strategic Leadership and Decision-Making: Executive decision-making, competitive strategy formulation, and business model innovation in complex environments.",
        "Corporate Finance and Risk Management: Financial analysis, valuation, capital allocation, and enterprise risk management.",
        "Operations and Organizational Performance: Operational excellence, performance management, and large-scale change and transformation initiatives.",
        "Executive Communication and Governance: High-level communication, negotiation, stakeholder management, and corporate governance frameworks."
      ]
    },
    {
      id: "phd",
      degree: "PhD in Theoretical Physics",
      institution: "Universidad Autónoma de Madrid",
      institutionUrl: "https://www.uam.es/uam/inicio",
      period: "Sep 2010 - Oct 2014",
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
      institutionUrl: "https://www.uam.es/uam/inicio",
      period: "Sep 2009 - Jun 2010",
      details: [
        "GPA of 8.8 on a linear scale from 0 to 10.",
        "Thesis on light emission statistics in correlated random photonic nanostructures."
      ]
    },
    {
      id: "licenciate",
      degree: "Licentiate Degree in Physics",
      institution: "Universidade do Porto",
      institutionUrl: "https://www.up.pt/portal/en/",
      period: "",
      details: []
    }
  ] as Education[],
  achievements: [
    { text: "Author or co-author of 21 peer-reviewed publications.", type: 'publications', icon: FileText },
    { text: "Delivered approx. 50 oral presentations at international conferences.", type: 'presentations', icon: Mic },
    { text: "Supervision of three master's theses and two bachelor's dissertations.", type: 'supervision', icon: Users },
    { text: "Research projects in Science and Artificial Intelligence.", type: 'projects', icon: Briefcase },
    { text: "Courses and Certifications.", type: 'certifications', icon: GraduationCap },
    { text: <span>Director of the program <em>AI for Marketing</em> at Católica Porto Business School.</span>, type: null, icon: GraduationCap, url: 'https://catolicabs.porto.ucp.pt/executive-immersive-weeks/ai-marketing' }
  ]
};
