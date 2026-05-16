# Biblioteca Web

A comprehensive web component library built with Next.js and TypeScript.

## Project Structure

```
biblioteca-web/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Next.js pages
│   ├── styles/            # Global styles
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── .storybook/            # Storybook configuration
├── public/                # Static assets
└── package.json           # Project dependencies
```

## Getting Started

### Prerequisites
- Node.js 16+ or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Create a production build:

```bash
npm run build
npm start
```

### Storybook

View and develop components in Storybook:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.

## Features

- ✅ Next.js 14+ with TypeScript
- ✅ Component Library with Storybook
- ✅ ESLint Configuration
- ✅ Type Safety with strict TypeScript
- ✅ Path Aliases for clean imports

## Component Development

Create components in `src/components/` with the following structure:

```
ComponentName/
├── ComponentName.tsx      # Component implementation
├── ComponentName.module.css # Component styles (optional)
└── ComponentName.stories.tsx # Storybook stories
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Storybook Documentation](https://storybook.js.org)

## License

MIT
