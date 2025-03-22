#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Display welcome banner
function welcome() {
    const title = figlet.textSync("DRUTA CLI", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
    });

    console.log(gradient.pastel.multiline(title));
    console.log(`${chalk.blue("A CLI tool for React Native, Expo, and Next.js components")}\n`);
}

// Sleep function for animations
const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// Main arguments parser
async function parseArguments() {
    const args = process.argv.slice(2);

    // If no arguments, show interactive CLI
    if (args.length === 0) {
        welcome();
        await sleep(500);
        await interactiveCLI();
        return;
    }

    // If arguments provided, run command directly
    if (args.length < 3) {
        console.log(chalk.red("Not enough arguments provided"));
        displayHelp();
        process.exit(1);
    }

    const [platform, action, componentName] = args;

    // Validate platform
    if (!["expo", "next", "react-native"].includes(platform)) {
        console.log(chalk.red(`Invalid platform: ${platform}`));
        displayHelp();
        process.exit(1);
    }

    // Validate action
    if (!["add", "remove"].includes(action)) {
        console.log(chalk.red(`Invalid action: ${action}`));
        displayHelp();
        process.exit(1);
    }

    // Execute the appropriate command
    if (action === "add") {
        await addComponent(platform, componentName);
    } else if (action === "remove") {
        await removeComponent(platform, componentName);
    }
}

// Interactive CLI mode
async function interactiveCLI() {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "platform",
            message: "Select platform:",
            choices: ["next", "expo", "react-native"],
        },
        {
            type: "list",
            name: "action",
            message: "What do you want to do?",
            choices: ["add", "remove"],
        },
        {
            type: "input",
            name: "componentName",
            message: "Enter component/page name:",
            validate: (input) => input.trim() !== "" ? true : "Name cannot be empty",
        },
    ]);

    if (answers.action === "add") {
        await addComponent(answers.platform, answers.componentName);
    } else if (answers.action === "remove") {
        await removeComponent(answers.platform, answers.componentName);
    }
}

// Display help information
function displayHelp() {
    console.log(`
${chalk.blue("USAGE:")}
  drt <platform> <action> <name>

${chalk.blue("PLATFORMS:")}
  expo         - For Expo projects
  next         - For Next.js projects
  react-native - For React Native projects

${chalk.blue("ACTIONS:")}
  add    - Add a new component/page
  remove - Remove an existing component/page

${chalk.blue("EXAMPLES:")}
  drt expo add login    - Create a login component for Expo
  drt next remove about - Remove about page from Next.js project
  `);
}

// Add a component/page based on platform
async function addComponent(platform, componentName) {
    try {
        if (platform === "next") {
            await createNextComponents(componentName);
        } else if (platform === "expo") {
            await createExpoComponents(componentName);
        } else if (platform === "react-native") {
            await createReactNativeComponents(componentName);
        }

        console.log(chalk.green(`✓ Successfully created ${componentName} for ${platform}!`));
    } catch (error) {
        console.log(chalk.red(`✗ Error creating component: ${error.message}`));
        process.exit(1);
    }
}

// Remove a component/page based on platform
async function removeComponent(platform, componentName) {
    try {
        if (platform === "next") {
            await removeNextComponents(componentName);
        } else if (platform === "expo") {
            await removeExpoComponents(componentName);
        } else if (platform === "react-native") {
            await removeReactNativeComponents(componentName);
        }

        console.log(chalk.green(`✓ Successfully removed ${componentName} from ${platform}!`));
    } catch (error) {
        console.log(chalk.red(`✗ Error removing component: ${error.message}`));
        process.exit(1);
    }
}

// Create components for Next.js
async function createNextComponents(componentName) {
    // Create in current directory
    const basePath = path.join(process.cwd(), componentName);

    // Check if directory already exists
    if (fs.existsSync(basePath)) {
        throw new Error(`Component/page "${componentName}" already exists`);
    }

    // Create the directory
    fs.mkdirSync(basePath, { recursive: true });

    // Create page.tsx
    const pagePath = path.join(basePath, "page.tsx");
    const pageContent = `export default function ${componentName.charAt(0).toUpperCase() + componentName.slice(1)}Page() {
  return (
    <div>
      <h1>${componentName.charAt(0).toUpperCase() + componentName.slice(1)} Page</h1>
      <p>This is the ${componentName} page</p>
    </div>
  );
}
`;
    fs.writeFileSync(pagePath, pageContent);

    // Create layout.tsx
    const layoutPath = path.join(basePath, "layout.tsx");
    const layoutContent = `export default function ${componentName.charAt(0).toUpperCase() + componentName.slice(1)}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* ${componentName} layout */}
      {children}
    </section>
  );
}
`;
    fs.writeFileSync(layoutPath, layoutContent);
}

// Remove components for Next.js
async function removeNextComponents(componentName) {
    const basePath = path.join(process.cwd(), componentName);

    // Check if directory exists
    if (!fs.existsSync(basePath)) {
        throw new Error(`Component/page "${componentName}" doesn't exist`);
    }

    // Remove the directory recursively
    fs.rmSync(basePath, { recursive: true, force: true });
}

// Create components for Expo
async function createExpoComponents(componentName) {
    // Create directory in current path
    const componentDir = path.join(process.cwd(), componentName);

    // Check if directory already exists
    if (fs.existsSync(componentDir)) {
        throw new Error(`Component "${componentName}" already exists`);
    }

    // Create the directory
    fs.mkdirSync(componentDir, { recursive: true });

    // Create index.tsx file
    const indexPath = path.join(componentDir, "index.tsx");
    const indexContent = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ${componentName}Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${componentName} Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
`;
    fs.writeFileSync(indexPath, indexContent);

    // Create styles.js file
    const stylesPath = path.join(componentDir, "styles.js");
    const stylesContent = `import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
});
`;
    fs.writeFileSync(stylesPath, stylesContent);
}

// Remove components for Expo
async function removeExpoComponents(componentName) {
    const componentDir = path.join(process.cwd(), componentName);

    // Check if directory exists
    if (!fs.existsSync(componentDir)) {
        throw new Error(`Component "${componentName}" doesn't exist`);
    }

    // Remove the directory recursively
    fs.rmSync(componentDir, { recursive: true, force: true });
}

// Create components for React Native
async function createReactNativeComponents(componentName) {
    // Create directory in current path
    const componentDir = path.join(process.cwd(), componentName);

    // Check if directory already exists
    if (fs.existsSync(componentDir)) {
        throw new Error(`Component "${componentName}" already exists`);
    }

    // Create the directory
    fs.mkdirSync(componentDir, { recursive: true });

    // Create index.jsx file
    const indexPath = path.join(componentDir, "index.jsx");
    const indexContent = `import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const ${componentName} = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${componentName} Component</Text>
    </View>
  );
};

export default ${componentName};
`;
    fs.writeFileSync(indexPath, indexContent);

    // Create styles.js file
    const stylesPath = path.join(componentDir, "styles.js");
    const stylesContent = `import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
`;
    fs.writeFileSync(stylesPath, stylesContent);
}

// Remove components for React Native
async function removeReactNativeComponents(componentName) {
    const componentDir = path.join(process.cwd(), componentName);

    // Check if directory exists
    if (!fs.existsSync(componentDir)) {
        throw new Error(`Component "${componentName}" doesn't exist`);
    }

    // Remove the directory recursively
    fs.rmSync(componentDir, { recursive: true, force: true });
}

// Run the CLI
parseArguments().catch((error) => {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
});