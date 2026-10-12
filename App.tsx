/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  Briefcase,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  Mic,
  Users,
} from 'lucide-react';
import AcademicCV from './components/AcademicCV';
import PhysicsBanner from './components/PhysicsBanner';
import Sheet from './components/Sheet';
import {
  AI_PROJECTS,
  CERTIFICATIONS,
  CONFERENCE_PROCEEDINGS,
  CV_DATA,
  ORAL_COMMUNICATIONS,
  POSTER_COMMUNICATIONS,
  PUBLICATIONS,
  SCIENCE_PROJECTS,
  SUPERVISION_DATA,
} from './cvData';

type ModalType =
  | 'publications'
  | 'supervision'
  | 'presentations'
  | 'projects'
  | 'certifications'
  | null;

const SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'research', label: 'Research' },
] as const;

/** Minimal hash routing: the academic CV is the only second page. */
const useHashRoute = () => {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  );

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return hash;
};

/* ============================================================
   MOTION
   Critically damped by default. Bounce is reserved for motion the
   user's own gesture set going — it would read as noise anywhere else.
   ============================================================ */
const SPRING = { type: 'spring' as const, bounce: 0, duration: 0.4 };

/**
 * A section that settles into place on load.
 *
 * This deliberately animates on mount rather than on scroll. A viewport-driven
 * reveal (whileInView) leaves every block below the fold at opacity 0 until the
 * page is scrolled — so a card sitting on the fold, or reached by an anchor
 * jump, by the browser restoring a scroll position, or by Cmd+F, can be found
 * blank. Settling everything once on load costs nothing and cannot strand
 * content in the invisible state.
 */
const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Anything you can press responds on pointer-down, not on release.
 * Waiting for the click to acknowledge the press is what makes an
 * interface feel dead.
 */
const Pressable: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  ariaLabel?: string;
}> = ({ children, className = '', onClick, as = 'button', href, ariaLabel }) => {
  const reduceMotion = useReducedMotion();
  const Component = as === 'a' ? motion.a : motion.button;

  return (
    <Component
      className={className}
      onClick={onClick}
      href={href}
      aria-label={ariaLabel}
      {...(as === 'a' ? { target: '_blank', rel: 'noopener noreferrer' } : { type: 'button' })}
      whileTap={reduceMotion ? undefined : { scale: 0.975 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.18 }}
    >
      {children}
    </Component>
  );
};

/* ============================================================
   NAVIGATION
   A translucent layer the page scrolls under, not an opaque strip
   that eats a band of the screen.
   ============================================================ */
const Nav: React.FC<{ active: string; onNavigate: (id: string) => void }> = ({
  active,
  onNavigate,
}) => {
  const { scrollY } = useScroll();
  // The material thickens slightly once content is behind it — before that
  // there is nothing to separate from, so it stays invisible.
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  return (
    <nav className="portfolio-nav material-chrome fixed inset-x-0 top-0 z-50 print:hidden">
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px bg-separator"
        style={{ opacity: borderOpacity }}
      />
      {/* Matches the sidebar's gutter so the wordmark sits directly above it. */}
      <div className="mx-auto flex h-12 max-w-[88rem] items-center gap-4 px-4 sm:h-14 sm:px-6 lg:px-7">
        <button
          onClick={() => onNavigate('top')}
          className="type-headline on-material shrink-0 text-[0.9375rem] text-label"
        >
          Nuno de Sousa
        </button>

        <div className="thin-scroll -mx-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              aria-current={active === section.id ? 'location' : undefined}
              onClick={() => onNavigate(section.id)}
              className="relative shrink-0 rounded-full px-3 py-1.5 text-[0.8125rem] transition-colors duration-150"
            >
              {/* The pill travels between items rather than cutting — the
                  eye follows one object instead of tracking a jump. */}
              {active === section.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-fill"
                  transition={SPRING}
                />
              )}
              <span
                className={`relative on-material ${
                  active === section.id ? 'text-label' : 'text-secondary hover:text-label'
                }`}
              >
                {section.label}
              </span>
            </button>
          ))}
        </div>

      </div>
    </nav>
  );
};

/* ============================================================
   SIDEBAR
   The persistent identity column: who this is, how to reach them,
   and what they work with. It stays put while the record scrolls,
   so the reader never loses the thread of whose CV this is.
   ============================================================ */
const SidebarContent: React.FC = () => {
  const { personal, skills, languages } = CV_DATA;
  const technicalSkills = skills.filter(
    (skill) =>
      skill.category === 'Quantitative Modelling' ||
      skill.category === 'Machine Learning & AI' ||
      skill.category === 'Data & Production Systems',
  );
  const businessSkills = skills.filter((skill) => skill.category === 'Business Applications');
  const leadershipSkills = skills.filter(
    (skill) =>
      skill.category === 'Strategy & Delivery' ||
      skill.category === 'People Leadership' ||
      skill.category === 'Stakeholders & Growth',
  );

  const link = (href: string, icon: React.ReactNode, label: string) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.875rem]
                 text-secondary transition-colors duration-150 hover:bg-fill hover:text-label"
    >
      <span className="shrink-0 text-tertiary">{icon}</span>
      {label}
    </a>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Identity */}
      <div>
        <img
          src={`${import.meta.env.BASE_URL}photos/nuno_2026.jpg`}
          alt={personal.shortName}
          width={112}
          height={112}
          className="mb-5 h-24 w-24 rounded-full object-cover
                     shadow-[0_1px_3px_rgb(0_0_0/0.08),0_10px_28px_rgb(0_0_0/0.12)]"
        />
        <h2 className="type-title text-[1.375rem] text-label">{personal.shortName}</h2>
        <p className="type-caption mt-2 text-[0.8125rem] text-secondary">PhD · Executive MBA</p>
        <p className="type-eyebrow type-eyebrow-cased mt-2 text-accent">
          <span className="block">{personal.title}</span>
          <span className="mt-1 block">{personal.specialisation}</span>
        </p>
      </div>

      {/* Reach */}
      <div className="flex flex-col">
        <div className="-mx-2 flex items-center gap-2.5 px-2 py-1.5 text-[0.875rem] text-secondary">
          <MapPin className="h-4 w-4 shrink-0 text-tertiary" strokeWidth={2} />
          Based in {personal.location}
        </div>
        {link(personal.links.linkedin, <Linkedin className="h-4 w-4" strokeWidth={2} />, 'LinkedIn')}
        {link(personal.links.github, <Github className="h-4 w-4" strokeWidth={2} />, 'GitHub')}
        {link(personal.links.orcid, <ExternalLink className="h-4 w-4" strokeWidth={2} />, 'ORCID')}
        {link(
          personal.links.scholar,
          <GraduationCap className="h-4 w-4" strokeWidth={2} />,
          'Google Scholar',
        )}
      </div>

      <div className="h-px bg-separator" />

      {/* Leadership and management */}
      <div>
        <h3 className="type-eyebrow mb-4 text-tertiary">Leadership &amp; Management</h3>
        <div className="flex flex-col gap-4">
          {leadershipSkills.map((skill) => (
            <div key={skill.category}>
              <p className="type-headline text-[0.8125rem] text-label">{skill.category}</p>
              <p className="type-caption mt-1 text-[0.8125rem] text-secondary">{skill.skills}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-separator" />

      {/* Business applications */}
      <div>
        <h3 className="type-eyebrow mb-4 text-tertiary">Business Applications</h3>
        {businessSkills.map((skill) => (
          <p key={skill.category} className="type-caption text-[0.8125rem] text-secondary">
            {skill.skills}
          </p>
        ))}
      </div>

      <div className="h-px bg-separator" />

      {/* Technical skills */}
      <div>
        <h3 className="type-eyebrow mb-4 text-tertiary">Technical Skills</h3>
        <div className="flex flex-col gap-4">
          {technicalSkills.map((skill) => (
            <div key={skill.category}>
              <p className="type-headline text-[0.8125rem] text-label">{skill.category}</p>
              <p className="type-caption mt-1 text-[0.8125rem] text-secondary">{skill.skills}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-separator" />

      {/* Languages */}
      <div>
        <h3 className="type-eyebrow mb-4 text-tertiary">Languages</h3>
        <div className="flex flex-col gap-3">
          {languages.map((lang) => (
            <div key={lang.name}>
              <p className="type-headline text-[0.8125rem] text-label">{lang.name}</p>
              <p className="type-caption mt-0.5 text-[0.8125rem] text-secondary">{lang.level}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => (
  <aside
    className="hidden shrink-0 border-r border-separator bg-grouped lg:block lg:w-[21rem]"
    aria-label="Profile summary"
  >
    {/* Sticks below the nav and scrolls independently when it outgrows the viewport. */}
    <div className="thin-scroll scroll-edge-bottom sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto px-7 py-10">
      <SidebarContent />
    </div>
  </aside>
);

/* ============================================================
   HERO
   ============================================================ */
const Hero: React.FC = () => {
  const { personal } = CV_DATA;

  return (
    <header id="top" className="portfolio-hero">
      <PhysicsBanner />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-line" />
          Quantitative modelling · Pricing · Forecasting
        </div>
        <div className="mt-7 flex items-center gap-4">
          <img
            src={`${import.meta.env.BASE_URL}photos/nuno_2026.jpg`}
            alt={personal.shortName}
            width={64}
            height={64}
            className="h-14 w-14 rounded-full object-cover ring-1 ring-white/25 lg:hidden"
          />
          <h1 className="type-display text-[clamp(2.5rem,6vw,5rem)] text-white">
            {personal.shortName}
          </h1>
        </div>
        <p className="hero-role">Subject Matter Expert &amp; Data Scientist</p>
        <p className="hero-description">
          Turning complex market data into clearer decisions.
          <span className="block">Physics, business strategy and applied AI.</span>
        </p>
        <div className="hero-credentials">
          <span>PhD in Theoretical Physics</span>
          <span>Executive MBA</span>
          <span>15+ years of experience</span>
        </div>
        <div className="hero-actions print:hidden">
          <a href="#experience" className="hero-action-primary">
            Explore experience <ArrowUpRight size={16} />
          </a>
          <a href="#academic" className="hero-action-secondary">
            Full academic CV <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="hero-index" aria-hidden="true">
        <span>01 / Wave interference</span>
        <span>From physics to market intelligence</span>
      </div>
    </header>
  );
};

/* ============================================================
   SECTION SCAFFOLDING
   ============================================================ */
const Section: React.FC<{
  id: string;
  title: string;
  children: React.ReactNode;
}> = ({ id, title, children }) => (
  <section id={id} className="mx-auto max-w-4xl scroll-mt-20 px-5 py-12 sm:px-6 sm:py-16">
    <Reveal>
      <h2 className="type-title mb-8 text-[clamp(1.5rem,3.5vw,2rem)] text-label">{title}</h2>
    </Reveal>
    {children}
  </section>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div data-print="block" className={`rounded-card bg-grouped p-6 sm:p-8 ${className}`}>
    {children}
  </div>
);

/* ============================================================
   APP
   ============================================================ */
const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeSection, setActiveSection] = useState<string>('profile');
  const reduceMotion = useReducedMotion();
  const hash = useHashRoute();

  /* Scroll spy — the nav always answers "where am I?" */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [hash]);

  const navigate = useCallback(
    (id: string) => {
      const el = id === 'top' ? document.body : document.getElementById(id);
      el?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [reduceMotion],
  );

  /* ---------- Sheet contents ---------- */
  const entryRow = (index: React.ReactNode, body: React.ReactNode) => (
    <div className="flex gap-4 border-b border-separator/50 py-4 last:border-0">
      <span className="w-6 shrink-0 text-right text-[0.8125rem] font-semibold tabular-nums text-tertiary">
        {index}
      </span>
      <div className="min-w-0 flex-1">{body}</div>
    </div>
  );

  const linkChip = (href: string, text: React.ReactNode) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1
                 text-[0.75rem] font-medium text-accent transition-colors hover:bg-accent/20"
    >
      {text}
      <ExternalLink className="h-3 w-3" />
    </a>
  );

  const groupHeading = (text: string) => (
    <h3 className="type-eyebrow sticky top-0 z-10 -mx-5 bg-grouped/80 px-5 py-2.5 text-secondary backdrop-blur-md sm:-mx-7 sm:px-7">
      {text}
    </h3>
  );

  const modal = useMemo(() => {
    switch (activeModal) {
      case 'publications':
        return {
          title: 'Publications',
          subtitle: `${PUBLICATIONS.length} peer-reviewed papers and proceedings`,
          icon: <FileText className="h-5 w-5" />,
          content: (
            <div>
              {PUBLICATIONS.map((pub) =>
                <React.Fragment key={pub.id}>
                  {entryRow(
                    pub.id,
                    <>
                      <p className="type-body text-[0.875rem] text-secondary">{pub.text}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {pub.impact && (
                          <span className="rounded-full bg-fill px-2.5 py-1 text-[0.75rem] font-medium text-secondary">
                            {/^[\d.]+$/.test(pub.impact) ? `Impact factor ${pub.impact}` : pub.impact}
                          </span>
                        )}
                        {pub.url && linkChip(pub.url, 'Paper')}
                      </div>
                    </>,
                  )}
                </React.Fragment>,
              )}
            </div>
          ),
        };

      case 'supervision':
        return {
          title: 'Supervision',
          subtitle: "Master's theses and degree dissertations",
          icon: <Users className="h-5 w-5" />,
          content: (
            <div>
              {SUPERVISION_DATA.map((item) => (
                <React.Fragment key={item.id}>
                  {entryRow(
                    item.id,
                    <p className="type-body text-[0.875rem] text-secondary">{item.text}</p>,
                  )}
                </React.Fragment>
              ))}
            </div>
          ),
        };

      case 'presentations':
        return {
          title: 'Presentations',
          subtitle: `${
            CONFERENCE_PROCEEDINGS.length + ORAL_COMMUNICATIONS.length + POSTER_COMMUNICATIONS.length
          } international communications`,
          icon: <Mic className="h-5 w-5" />,
          content: (
            <div className="space-y-6">
              {(
                [
                  ['By invitation', CONFERENCE_PROCEEDINGS],
                  ['Oral communications', ORAL_COMMUNICATIONS],
                  ['Poster communications', POSTER_COMMUNICATIONS],
                ] as const
              ).map(([heading, items]) => (
                <div key={heading}>
                  {groupHeading(heading)}
                  {items.map((item) => (
                    <React.Fragment key={item.id}>
                      {entryRow(
                        item.id,
                        <p className="type-body text-[0.875rem] text-secondary">{item.text}</p>,
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          ),
        };

      case 'projects':
        return {
          title: 'Research projects',
          subtitle: 'Science and artificial intelligence',
          icon: <Briefcase className="h-5 w-5" />,
          content: (
            <div className="space-y-6">
              <div>
                {groupHeading('Science')}
                {SCIENCE_PROJECTS.map((project) => (
                  <React.Fragment key={project.id}>
                    {entryRow(
                      project.id,
                      <>
                        <p className="type-body text-[0.875rem] font-medium text-label">
                          {project.title}
                        </p>
                        <p className="type-caption mt-1 text-[0.8125rem] text-tertiary">
                          {project.period} · {project.ref}
                        </p>
                        {project.details && (
                          <p className="type-caption mt-2 text-[0.8125rem] text-secondary">
                            {project.details}
                          </p>
                        )}
                      </>,
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div>
                {groupHeading('Artificial intelligence')}
                {AI_PROJECTS.map((project) => (
                  <React.Fragment key={project.id}>
                    {entryRow(
                      project.id,
                      <>
                        <p className="type-body text-[0.875rem] font-medium text-label">
                          {project.title}
                        </p>
                        <p className="type-caption mt-1 text-[0.8125rem] text-tertiary">
                          {project.period}
                        </p>
                        {project.details && (
                          <p className="type-caption mt-2 text-[0.8125rem] text-secondary">
                            {project.details}
                          </p>
                        )}
                        {project.links && project.links.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {project.links.map((link, i) => (
                              <React.Fragment key={i}>
                                {linkChip(link.url, link.text)}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </>,
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ),
        };

      case 'certifications':
        return {
          title: 'Courses and certifications',
          subtitle: 'Professional development and training',
          icon: <GraduationCap className="h-5 w-5" />,
          content: (
            <div>
              {CERTIFICATIONS.map((cert) => (
                <React.Fragment key={cert.id}>
                  {entryRow(
                    cert.id,
                    <>
                      <p className="type-body text-[0.875rem] font-medium text-label">
                        {cert.title}
                      </p>
                      <p className="type-caption mt-1 text-[0.8125rem] text-tertiary">
                        {cert.date} · {cert.organization}
                      </p>
                      {cert.duration && (
                        <p className="type-caption mt-1 text-[0.8125rem] text-secondary">
                          {cert.duration}
                        </p>
                      )}
                      {cert.topics && (
                        <p className="type-caption mt-1 text-[0.8125rem] text-secondary">
                          {cert.topics}
                        </p>
                      )}
                      {cert.license && (
                        <p className="type-caption mt-1 text-[0.75rem] text-tertiary">
                          License {cert.license}
                        </p>
                      )}
                    </>,
                  )}
                </React.Fragment>
              ))}
            </div>
          ),
        };

      default:
        return null;
    }
  }, [activeModal]);

  // The academic CV is a document of its own, not a longer version of this one.
  if (hash === '#academic') return <AcademicCV />;

  return (
    <div className="min-h-screen bg-canvas">
      <Nav active={activeSection} onNavigate={navigate} />

      <Hero />

      <div className="mx-auto flex max-w-[88rem]">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <main>
        {/* ---------- PROFILE ---------- */}
        <Section id="profile" title="Profile">
          <Reveal>
            <Card>
              {/* The emphasised phrases carry the claim; the rest is connective
                  tissue. Weight alone does the work — no highlight box needed. */}
              <p
                className="type-body max-w-measure text-left text-[1.0625rem]
                           text-secondary sm:text-[1.125rem]
                           [&_b]:font-semibold [&_b]:text-label"
              >
                {CV_DATA.personal.summaryRich}
              </p>
            </Card>
          </Reveal>
        </Section>

        {/* ---------- EXPERIENCE ---------- */}
        <Section id="experience" title="Experience">
          <div className="space-y-3">
            {CV_DATA.experience.map((job, i) => (
              <Reveal key={job.id} delay={i * 0.04}>
                <Card>
                  <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                      <h3 className="type-headline text-[1.125rem] text-label">{job.role}</h3>
                      <p className="mt-0.5 text-[0.9375rem] text-secondary">
                        {job.companyUrl ? (
                          <a
                            href={job.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 transition-colors hover:text-accent"
                          >
                            {job.company}
                            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                          </a>
                        ) : (
                          job.company
                        )}
                      </p>
                    </div>
                    <p className="type-caption shrink-0 text-[0.75rem] tracking-wide text-tertiary">
                      {job.period}
                    </p>
                  </div>

                  {job.description && (
                    <p className="type-body mb-4 max-w-measure text-[0.9375rem] text-secondary">
                      {job.description}
                    </p>
                  )}

                  <ul className="space-y-2.5">
                    {job.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span
                          className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-tertiary"
                          aria-hidden="true"
                        />
                        <span className="type-body text-[0.9375rem] text-secondary [&_b]:font-semibold [&_b]:text-label">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ---------- EDUCATION ---------- */}
        <Section id="education" title="Education">
          <div className="grid gap-3 sm:grid-cols-2">
            {CV_DATA.education.map((edu, i) => (
              <Reveal key={edu.id} delay={i * 0.04}>
                <Card className="h-full">
                  <h3 className="type-headline text-[1.0625rem] text-label">{edu.degree}</h3>
                  <p className="mt-0.5 text-[0.9375rem] text-secondary">
                    {edu.institutionUrl ? (
                      <a
                        href={edu.institutionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 transition-colors hover:text-accent"
                      >
                        {edu.institution}
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                      </a>
                    ) : (
                      edu.institution
                    )}
                  </p>
                  {edu.period && (
                    <p className="type-caption mt-2 text-[0.75rem] tracking-wide text-tertiary">
                      {edu.period}
                    </p>
                  )}

                  {edu.details.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {edu.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span
                            className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-tertiary"
                            aria-hidden="true"
                          />
                          <span className="type-body text-[0.875rem] text-secondary">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {edu.link && (
                    <a
                      href={edu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-[0.875rem] font-medium text-accent hover:underline"
                    >
                      Read the dissertation
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </a>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ---------- EXPERTISE ----------
            Desktop shows this in the sidebar, where it stays visible against
            every role you scroll past. Below lg there is no sidebar, so it
            takes its place in the main flow rather than disappearing. */}
        <div className="lg:hidden">
        <Section id="expertise" title="Expertise">
          <div className="grid gap-3 sm:grid-cols-2">
            {CV_DATA.skills.map((skill, i) => (
              <Reveal key={skill.category} delay={i * 0.03}>
                <Card className="h-full">
                  <h3 className="type-eyebrow mb-3 text-accent">{skill.category}</h3>
                  <p className="type-body text-[0.9375rem] text-secondary">{skill.skills}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Card className="mt-3">
              <h3 className="type-eyebrow mb-4 text-accent">Languages</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {CV_DATA.languages.map((lang) => (
                  <div key={lang.name}>
                    <p className="type-headline text-[0.9375rem] text-label">{lang.name}</p>
                    <p className="type-caption mt-0.5 text-[0.8125rem] text-secondary">
                      {lang.level}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </Section>
        </div>

        {/* ---------- RESEARCH & RECOGNITION ---------- */}
        <Section id="research" title="Research &amp; recognition">
          <Reveal>
            <a
              href={PUBLICATIONS[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="latest-publication group mb-5 block rounded-card p-6 sm:p-8"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="type-eyebrow text-accent">Latest publication · 2026</span>
                <ArrowUpRight size={20} className="shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h3 className="type-title max-w-measure text-[clamp(1.25rem,3vw,1.65rem)] text-label">
                Simplicity over sophistication?
              </h3>
              <p className="type-body mt-2 max-w-measure text-[1rem] text-secondary">
                Rule-based chatbots lead to higher return rates than LLMs in retail.
              </p>
              <p className="type-caption mt-5 text-[0.8125rem] text-tertiary">
                A. P. V. Oliveira · S. C. Silva · N. de Sousa
                <span className="mt-1 block">The International Review of Retail, Distribution and Consumer Research</span>
              </p>
            </a>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {CV_DATA.achievements.map((achievement, i) => {
              const Icon = achievement.icon;
              const isSheet = Boolean(achievement.type);

              const inner = (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-tertiary transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      strokeWidth={2}
                    />
                  </div>
                  <p className="type-body text-left text-[0.9375rem] text-label">
                    {achievement.text}
                  </p>
                </>
              );

              const className =
                'group block h-full w-full rounded-card bg-grouped p-6 text-left transition-colors duration-150 hover:bg-fill sm:p-7';

              return (
                <Reveal key={i} delay={i * 0.03}>
                  {isSheet ? (
                    <Pressable
                      className={className}
                      onClick={() => setActiveModal(achievement.type as ModalType)}
                    >
                      {inner}
                    </Pressable>
                  ) : (
                    <Pressable as="a" href={(achievement as { url?: string }).url} className={className}>
                      {inner}
                    </Pressable>
                  )}
                </Reveal>
              );
            })}
          </div>
        </Section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="mt-8 border-t border-separator">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
          <Reveal>
            <h2 className="type-title text-[clamp(1.5rem,3.5vw,2rem)] text-label">Get in touch</h2>
            <p className="type-body mt-3 max-w-measure text-[1.0625rem] text-secondary">
              Based in {CV_DATA.personal.location}. Available
              for advisory, technical leadership, and executive-level data and AI work.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Pressable
                as="a"
                href={CV_DATA.personal.links.linkedin}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5
                           text-[0.9375rem] font-medium text-white hover:bg-accent-hover"
              >
                <Linkedin className="h-4 w-4" strokeWidth={2.2} />
                LinkedIn
              </Pressable>
              <Pressable
                as="a"
                href={CV_DATA.personal.links.github}
                className="inline-flex items-center gap-2 rounded-full bg-fill px-5 py-2.5
                           text-[0.9375rem] font-medium text-label transition-colors hover:bg-separator/50"
              >
                <Github className="h-4 w-4" strokeWidth={2.2} />
                GitHub
              </Pressable>
              <Pressable
                as="a"
                href={CV_DATA.personal.links.orcid}
                className="inline-flex items-center gap-2 rounded-full bg-fill px-5 py-2.5
                           text-[0.9375rem] font-medium text-label transition-colors hover:bg-separator/50"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={2.2} />
                ORCID
              </Pressable>
              <Pressable
                as="a"
                href={CV_DATA.personal.links.scholar}
                className="inline-flex items-center gap-2 rounded-full bg-fill px-5 py-2.5
                           text-[0.9375rem] font-medium text-label transition-colors hover:bg-separator/50"
              >
                <GraduationCap className="h-4 w-4" strokeWidth={2.2} />
                Google Scholar
              </Pressable>
              <a
                href="#academic"
                className="inline-flex items-center gap-2 rounded-full bg-fill px-5 py-2.5
                           text-[0.9375rem] font-medium text-label transition-colors hover:bg-separator/50"
              >
                <FileText className="h-4 w-4" strokeWidth={2.2} />
                View Full Academic CV
              </a>
            </div>

            <p className="type-caption mt-12 text-[0.8125rem] text-tertiary">
              © {new Date().getFullYear()} {CV_DATA.personal.name}
            </p>
          </Reveal>
        </div>
      </footer>
        </div>
      </div>

      <Sheet
        open={Boolean(modal)}
        onClose={() => setActiveModal(null)}
        title={modal?.title ?? ''}
        subtitle={modal?.subtitle}
        icon={modal?.icon}
      >
        {modal?.content}
      </Sheet>
    </div>
  );
};

export default App;
