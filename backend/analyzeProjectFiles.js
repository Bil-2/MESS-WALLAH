#!/usr/bin/env node
/**
 * MESS-WALLAH Project File Usage Analyzer
 * Identifies unused files by analyzing import statements
 */

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const backendDir = projectRoot;
const frontendDir = path.join(projectRoot, '../frontend/src');

// Files to analyze
const backendFiles = [];
const frontendFiles = [];

// Store all import relationships
const imports = new Map(); // key: file, value: Set of imported files
const importedBy = new Map(); // key: file, value: Set of files that import it

/**
 * Recursively find all JS/JSX files
 */
function findFiles(dir, fileList = [], baseDir = dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        findFiles(filePath, fileList, baseDir);
      }
    } else if (file.match(/\.(js|jsx)$/)) {
      fileList.push(path.relative(baseDir, filePath));
    }
  });

  return fileList;
}

/**
 * Extract import statements from a file
 */
function extractImports(filePath, baseDir) {
  const content = fs.readFileSync(path.join(baseDir, filePath), 'utf8');
  const importSet = new Set();

  // Match various import patterns
  const patterns = [
    /require\(['"]([^'"]+)['"]\)/g,        // require('...')
    /import\s+.*\s+from\s+['"]([^'"]+)['"]/g,  // import ... from '...'
    /import\(['"]([^'"]+)['"]\)/g,         // import('...')
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let importPath = match[1];

      // Skip node_modules
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        continue;
      }

      // Resolve relative path
      const dir = path.dirname(filePath);
      let resolvedPath = path.join(dir, importPath);

      // Try different extensions
      const extensions = ['', '.js', '.jsx', '/index.js', '/index.jsx'];
      for (const ext of extensions) {
        const testPath = resolvedPath + ext;
        if (fs.existsSync(path.join(baseDir, testPath))) {
          importSet.add(path.normalize(testPath));
          break;
        }
      }
    }
  });

  return importSet;
}

/**
 * Build import graph
 */
function buildImportGraph(files, baseDir) {
  files.forEach(file => {
    const fileImports = extractImports(file, baseDir);
    imports.set(file, fileImports);

    // Build reverse mapping
    fileImports.forEach(importedFile => {
      if (!importedBy.has(importedFile)) {
        importedBy.set(importedFile, new Set());
      }
      importedBy.get(importedFile).add(file);
    });
  });
}

/**
 * Find entry points
 */
function findEntryPoints(files) {
  const entryPoints = new Set();

  files.forEach(file => {
    // Backend entry points
    if (file.includes('server.js') || file.includes('main.jsx') || file.includes('App.jsx')) {
      entryPoints.add(file);
    }

    // Seed scripts (temporary files)
    if (file.includes('seed') || file.includes('download') || file.includes('update')) {
      // These are utility scripts, mark separately
    }
  });

  return entryPoints;
}

/**
 * Find all reachable files from entry points
 */
function findReachableFiles(entryPoints) {
  const reachable = new Set();
  const queue = [...entryPoints];

  while (queue.length > 0) {
    const file = queue.shift();
    if (reachable.has(file)) continue;

    reachable.add(file);

    const fileImports = imports.get(file) || new Set();
    fileImports.forEach(importedFile => {
      if (!reachable.has(importedFile)) {
        queue.push(importedFile);
      }
    });
  }

  return reachable;
}

/**
 * Categorize files
 */
function categorizeFiles(allFiles, reachableFiles) {
  const categories = {
    core: new Set(),           // Used by main app
    utilities: new Set(),      // Seed scripts, one-off tools
    tests: new Set(),          // Test files
    unused: new Set(),         // Not imported anywhere
    temporary: new Set()       // Scripts that can be deleted after use
  };

  allFiles.forEach(file => {
    const fileName = path.basename(file);

    // Test files
    if (fileName.includes('.test.') || fileName.includes('.spec.') || file.includes('/test/')) {
      categories.tests.add(file);
    }
    // Seed and utility scripts
    else if (fileName.match(/^(seed|download|update|fix)/i)) {
      categories.utilities.add(file);

      // Mark as temporary if it's a one-time script
      if (fileName.match(/^(download|update|seed)/i)) {
        categories.temporary.add(file);
      }
    }
    // Core application files
    else if (reachableFiles.has(file)) {
      categories.core.add(file);
    }
    // Unused files
    else {
      categories.unused.add(file);
    }
  });

  return categories;
}

/**
 * Generate report
 */
function generateReport() {
  console.log('🔍 MESS-WALLAH Project File Analysis\n');
  console.log('='.repeat(60));

  // Backend analysis
  console.log('\n📦 BACKEND ANALYSIS');
  console.log('-'.repeat(60));
  const bFiles = findFiles(backendDir);
  buildImportGraph(bFiles, backendDir);

  const backendEntryPoints = new Set(['server.js']);
  const backendReachable = findReachableFiles(backendEntryPoints);
  const backendCategories = categorizeFiles(bFiles, backendReachable);

  console.log(`\n✅ Core Application Files: ${backendCategories.core.size}`);
  console.log(`🛠️  Utility Scripts: ${backendCategories.utilities.size}`);
  console.log(`🗑️  Temporary Scripts (can delete): ${backendCategories.temporary.size}`);
  console.log(`❌ Unused Files: ${backendCategories.unused.size}`);

  if (backendCategories.temporary.size > 0) {
    console.log('\n📝 Temporary Scripts (Safe to Delete After Use):\n');
    backendCategories.temporary.forEach(file => {
      console.log(`   - ${file}`);
    });
  }

  if (backendCategories.unused.size > 0) {
    console.log('\n⚠️  Unused Files (Review Before Deleting):\n');
    backendCategories.unused.forEach(file => {
      console.log(`   - ${file}`);
    });
  }

  // Frontend analysis
  console.log('\n\n📦 FRONTEND ANALYSIS');
  console.log('-'.repeat(60));

  if (fs.existsSync(frontendDir)) {
    imports.clear();
    importedBy.clear();

    const fFiles = findFiles(frontendDir);
    buildImportGraph(fFiles, frontendDir);

    const frontendEntryPoints = new Set(['main.jsx', 'App.jsx']);
    const frontendReachable = findReachableFiles(frontendEntryPoints);
    const frontendCategories = categorizeFiles(fFiles, frontendReachable);

    console.log(`\n✅ Core Application Files: ${frontendCategories.core.size}`);
    console.log(`🛠️  Utility Scripts: ${frontendCategories.utilities.size}`);
    console.log(`❌ Unused Files: ${frontendCategories.unused.size}`);

    if (frontendCategories.unused.size > 0) {
      console.log('\n⚠️  Unused Files (Review Before Deleting):\n');
      frontendCategories.unused.forEach(file => {
        console.log(`   - ${file}`);
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Analysis Complete!\n');
}

// Run analysis
try {
  generateReport();
} catch (error) {
  console.error('Error during analysis:', error);
}
