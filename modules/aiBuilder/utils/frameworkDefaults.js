const frameworkDefaults = {
  'Next.js': {
    buildCommand: 'next build',
    outputDirectory: '.next',
    installCommand: 'npm install',
    devCommand: 'next dev',
    nodeVersion: '16.x',
  },
  React: {
    buildCommand: 'react-scripts build',
    outputDirectory: 'build',
    installCommand: 'npm install',
    devCommand: 'react-scripts start',
    nodeVersion: '16.x',
  },
  Angular: {
    buildCommand: 'ng build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    devCommand: 'ng serve',
    nodeVersion: '16.x',
  },
  'Node.js': {
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    devCommand: 'npm run start',
    nodeVersion: '16.x',
  },
  'Vue.js': {
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    devCommand: 'npm run serve',
    nodeVersion: '16.x',
  },
  SvelteKit: {
    buildCommand: 'npm run build',
    outputDirectory: 'build',
    installCommand: 'npm install',
    devCommand: 'npm run dev',
    nodeVersion: '16.x',
  },
  'Nuxt.js': {
    buildCommand: 'nuxt build',
    outputDirectory: '.nuxt',
    installCommand: 'npm install',
    devCommand: 'nuxt dev',
    nodeVersion: '16.x',
  },
  Gatsby: {
    buildCommand: 'gatsby build',
    outputDirectory: 'public',
    installCommand: 'npm install',
    devCommand: 'gatsby develop',
    nodeVersion: '16.x',
  },
  Docusaurus: {
    buildCommand: 'npm run build',
    outputDirectory: 'build',
    installCommand: 'npm install',
    devCommand: 'npm run start',
    nodeVersion: '16.x',
  },
  'Eleventy (11ty)': {
    buildCommand: 'eleventy',
    outputDirectory: '_site',
    installCommand: 'npm install',
    devCommand: 'eleventy --serve',
    nodeVersion: '16.x',
  },
  Remix: {
    buildCommand: 'npm run build',
    outputDirectory: 'public/build',
    installCommand: 'npm install',
    devCommand: 'npm run dev',
    nodeVersion: '16.x',
  },
  'Express.js': {
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    devCommand: 'node app.js',
    nodeVersion: '16.x',
  },
  NestJS: {
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    devCommand: 'npm run start:dev',
    nodeVersion: '16.x',
  },
  'Python (Django)': {
    buildCommand: null,
    outputDirectory: null,
    installCommand: 'pip install -r requirements.txt',
    devCommand: 'python manage.py runserver',
    nodeVersion: null,
  },
  Flask: {
    buildCommand: null,
    outputDirectory: null,
    installCommand: 'pip install -r requirements.txt',
    devCommand: 'flask run',
    nodeVersion: null,
  },
  'Go (Static)': {
    buildCommand: 'go build -o main',
    outputDirectory: '.',
    installCommand: 'go mod download',
    devCommand: './main',
    nodeVersion: null,
  },
  'Ruby on Rails': {
    buildCommand: null,
    outputDirectory: null,
    installCommand: 'bundle install',
    devCommand: 'rails server',
    nodeVersion: null,
  },
  'Unsupported Framework': {
    buildCommand: null,
    outputDirectory: null,
    installCommand: null,
    devCommand: null,
    nodeVersion: null,
  },
};

export const supportedFrameworks = Object.keys(frameworkDefaults);

export const getFrameworkDefaults = (frameworkName) => {
  return frameworkDefaults[frameworkName] || frameworkDefaults['Unsupported Framework'];
};

export default frameworkDefaults;
