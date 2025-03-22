# Druta CLI (drt)

A command-line interface (CLI) tool for quickly generating and removing components for React Native, Expo, and Next.js projects.

## Features

- Create components for React Native, Expo, and Next.js
- Remove components from your projects
- Simple and minimal file structure generation
- Creates components exactly where you run the command

## Installation

### Global Installation

```bash
npm install -g druta-cli
```

### Using with npx

```bash
npx druta-cli expo add login
# or with the shorthand
npx drt expo add login
```

## Usage

```bash
drt <platform> <action> <name>
```

### Platforms

- `expo` - For Expo projects
- `next` - For Next.js projects
- `react-native` - For React Native projects

### Actions

- `add` - Create a new component or page
- `remove` - Remove an existing component or page

### Examples

```bash
# Create components for a login screen in Expo
drt expo add login

# Create a Next.js page with page.tsx and layout.tsx
drt next add dashboard

# Add a component to React Native
drt react-native add profile

# Remove components
drt expo remove login
drt next remove dashboard
```

### Interactive Mode

Just run `drt` without any arguments to enter interactive mode with a friendly UI.

## Generated File Structure

### Next.js

```
componentName/
├── page.tsx
└── layout.tsx
```

### Expo

```
componentName/
├── index.tsx
└── styles.js
```

### React Native

```
componentName/
├── index.jsx
└── styles.js
```

## Requirements

- Node.js >= 14.16

## Local Development

To test locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/druta-cli.git
cd druta-cli

# Install dependencies
npm install

# Link the package locally
npm link

# Now you can use the command
drt next add login
```

## License

MIT
