// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'ahndev';
export const SITE_DESCRIPTION = 'A developer portfolio and blog by ahndev.';

export const CONTACT_EMAIL = 'hello@ahndev.com';

export type Project = {
  name: string;
  description: string;
  url: string;
  image?: string;
};

export const PROJECTS: Project[] = [];

export type SocialLink = {
  label: string;
  url: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/agw76638' },
  { label: 'Email', url: `mailto:${CONTACT_EMAIL}` },
];
