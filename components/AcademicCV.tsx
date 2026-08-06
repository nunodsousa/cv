/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ExternalLink, Printer } from 'lucide-react';
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
} from '../cvData';

/**
 * The full academic record, as a document rather than a set of sheets.
 *
 * The main page is the executive read: five roles, a summary, and counts. This
 * is the other document — every publication, talk, project, thesis and
 * certification, in one linear page that prints as an academic CV. Both are
 * generated from the same data in cvData.tsx, so neither can drift.
 */

const Entry: React.FC<{ index?: React.ReactNode; children: React.ReactNode }> = ({
  index,
  children,
}) => (
  <div
    data-print="block"
    className="flex gap-4 border-b border-separator/50 py-3 last:border-0"
  >
    {index !== undefined && (
      <span className="w-6 shrink-0 text-right text-[0.8125rem] font-semibold tabular-nums text-tertiary">
        {index}
      </span>
    )}
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

const Block: React.FC<{ title: string; count?: number; children: React.ReactNode }> = ({
  title,
  count,
  children,
}) => (
  <section className="mt-12 first:mt-0">
    <h2 className="type-title mb-1 text-[1.25rem] text-label">{title}</h2>
    {count !== undefined && (
      <p className="type-caption mb-4 text-[0.8125rem] text-tertiary">{count} entries</p>
    )}
    <div className={count === undefined ? 'mt-4' : ''}>{children}</div>
  </section>
);

const AcademicCV: React.FC = () => {
  const { personal } = CV_DATA;
  const talks =
    CONFERENCE_PROCEEDINGS.length + ORAL_COMMUNICATIONS.length + POSTER_COMMUNICATIONS.length;

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
        {/* Chrome — never part of the printed document. */}
        <div className="print:hidden mb-10 flex flex-wrap items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-fill px-4 py-2
                       text-[0.875rem] font-medium text-label transition-colors hover:bg-separator/50"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
            Back to CV
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2
                       text-[0.875rem] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Printer className="h-3.5 w-3.5" strokeWidth={2.2} />
            Download this page
          </button>
        </div>

        {/* Masthead */}
        <header className="border-b border-separator pb-8">
          <h1 className="type-display text-[clamp(1.75rem,5vw,2.5rem)] text-label">
            {personal.shortName}
          </h1>
          <p className="type-eyebrow type-eyebrow-cased mt-2 text-accent">Full Academic CV</p>
          <p className="type-body mt-4 max-w-measure text-[0.9375rem] text-secondary">
            PhD in Theoretical Physics (Universidad Autónoma de Madrid, <em>Cum Laude</em>).{' '}
            {PUBLICATIONS.length} peer-reviewed publications, {talks} international communications,{' '}
            {SUPERVISION_DATA.length} supervised theses and {SCIENCE_PROJECTS.length} funded
            research projects.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-[0.875rem]">
            <a
              href={personal.links.orcid}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent"
            >
              ORCID <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={personal.links.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent"
            >
              Google Scholar <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </header>

        <div className="mt-12">
          <Block title="Education">
            {CV_DATA.education.map((edu) => (
              <Entry key={edu.id}>
                <p className="type-headline text-[0.9375rem] text-label">{edu.degree}</p>
                <p className="text-[0.875rem] text-secondary">{edu.institution}</p>
                {edu.period && (
                  <p className="type-caption mt-1 text-[0.8125rem] text-tertiary">{edu.period}</p>
                )}
              </Entry>
            ))}
          </Block>

          <Block title="Publications" count={PUBLICATIONS.length}>
            {PUBLICATIONS.map((pub) => (
              <Entry key={pub.id} index={pub.id}>
                <p className="type-body text-[0.875rem] text-secondary">{pub.text}</p>
                <p className="type-caption mt-1 text-[0.75rem] text-tertiary">
                  {/^[\d.]+$/.test(pub.impact) ? `Impact factor ${pub.impact}` : pub.impact}
                  {pub.url && (
                    <>
                      {' · '}
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent"
                      >
                        Paper
                      </a>
                    </>
                  )}
                </p>
              </Entry>
            ))}
          </Block>

          <Block title="Conference presentations" count={talks}>
            {(
              [
                ['By invitation', CONFERENCE_PROCEEDINGS],
                ['Oral communications', ORAL_COMMUNICATIONS],
                ['Poster communications', POSTER_COMMUNICATIONS],
              ] as const
            ).map(([heading, items]) => (
              <div key={heading} className="mt-6 first:mt-0">
                <h3 className="type-eyebrow mb-2 text-secondary">{heading}</h3>
                {items.map((item) => (
                  <Entry key={item.id} index={item.id}>
                    <p className="type-body text-[0.875rem] text-secondary">{item.text}</p>
                  </Entry>
                ))}
              </div>
            ))}
          </Block>

          <Block title="Research projects" count={SCIENCE_PROJECTS.length + AI_PROJECTS.length}>
            {SCIENCE_PROJECTS.map((project) => (
              <Entry key={`sci-${project.id}`} index={project.id}>
                <p className="type-body text-[0.875rem] text-label">{project.title}</p>
                <p className="type-caption mt-1 text-[0.8125rem] text-tertiary">
                  {project.period} · {project.ref}
                </p>
                {'details' in project && project.details && (
                  <p className="type-body mt-1 text-[0.8125rem] text-secondary">{project.details}</p>
                )}
              </Entry>
            ))}
            {AI_PROJECTS.map((project) => (
              <Entry key={`ai-${project.id}`}>
                <p className="type-body text-[0.875rem] text-label">{project.title}</p>
                <p className="type-caption mt-1 text-[0.8125rem] text-tertiary">{project.period}</p>
                <p className="type-body mt-1 text-[0.8125rem] text-secondary">{project.details}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-[0.8125rem]">
                  {project.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent"
                    >
                      {l.text}
                    </a>
                  ))}
                </div>
              </Entry>
            ))}
          </Block>

          <Block title="Supervision" count={SUPERVISION_DATA.length}>
            {SUPERVISION_DATA.map((item) => (
              <Entry key={item.id} index={item.id}>
                <p className="type-body text-[0.875rem] text-secondary">{item.text}</p>
              </Entry>
            ))}
          </Block>

          <Block title="Courses and certifications" count={CERTIFICATIONS.length}>
            {CERTIFICATIONS.map((cert) => (
              <Entry key={cert.id} index={cert.id}>
                <p className="type-headline text-[0.9375rem] text-label">{cert.title}</p>
                <p className="text-[0.875rem] text-secondary">
                  {cert.organization} · {cert.date}
                </p>
                {cert.topics && (
                  <p className="type-body mt-1 text-[0.8125rem] text-secondary">{cert.topics}</p>
                )}
                {cert.license && (
                  <p className="type-caption mt-1 text-[0.75rem] text-tertiary">
                    Licence {cert.license}
                  </p>
                )}
              </Entry>
            ))}
          </Block>
        </div>
      </div>
    </div>
  );
};

export default AcademicCV;
