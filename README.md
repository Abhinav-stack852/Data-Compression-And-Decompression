# CompressFlow - Advanced File Compression Application

![CompressFlow Banner](https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&fit=crop)

## 🚀 Project Overview

CompressFlow is a modern, web-based file compression and decompression application built with React and TypeScript. It implements three powerful compression algorithms from scratch: **Huffman Coding**, **Run-Length Encoding (RLE)**, and **LZ77**. The application provides an intuitive interface for users to compress files, analyze compression statistics, and manage their compression history.

### ✨ Key Features

- **🔄 Dual Mode Operation**: Seamlessly switch between compression and decompression modes
- **🧮 Multiple Algorithms**: Choose from three industry-standard compression algorithms
- **📊 Real-time Statistics**: View compression ratios, file sizes, and processing times
- **📁 Drag & Drop Upload**: Modern file upload interface with validation
- **📈 Processing History**: Track and compare compression results over time
- **💾 Download Management**: Download processed files with proper naming conventions
- **🎨 Beautiful UI**: Production-ready interface with smooth animations
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⚡ Client-side Processing**: No server required - all processing happens in the browser

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── algorithms/          # Compression algorithm implementations
│   ├── huffman.ts      # Huffman Coding algorithm
│   ├── rle.ts          # Run-Length Encoding algorithm
│   ├── lz77.ts         # LZ77 compression algorithm
│   └── index.ts        # Algorithm orchestration
├── components/         # React components
│   ├── FileUpload.tsx  # File upload interface
│   ├── AlgorithmSelector.tsx # Algorithm selection
│   ├── ProcessingPanel.tsx   # Processing controls
│   ├── StatisticsPanel.tsx   # Results display
│   └── HistoryPanel.tsx      # History management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

### Algorithm Implementations

#### 1. Huffman Coding
- **Complexity**: O(n log n)
- **Best For**: Text files, source code, CSV data
- **Method**: Variable-length prefix-free encoding based on character frequency
- **Features**: Optimal compression for data with uneven character distribution

#### 2. Run-Length Encoding (RLE)
- **Complexity**: O(n)
- **Best For**: Images with solid areas, binary data, simple graphics
- **Method**: Replaces consecutive identical bytes with count-value pairs
- **Features**: Simple and fast compression for repetitive data

#### 3. LZ77
- **Complexity**: O(n²)
- **Best For**: Mixed content, general purpose, large files
- **Method**: Dictionary-based compression using sliding window technique
- **Features**: Foundation of ZIP and GZIP formats

## 🛠️ Technology Stack

### Core Dependencies

#### Production Dependencies
```json
{
  "react": "^18.3.1",           // UI framework
  "react-dom": "^18.3.1",      // DOM rendering
  "lucide-react": "^0.344.0"   // Icon library
}
```

#### Development Dependencies
```json
{
  "@types/react": "^18.3.5",              // React TypeScript types
  "@types/react-dom": "^18.3.0",          // React DOM TypeScript types
  "@vitejs/plugin-react": "^4.3.1",       // Vite React plugin
  "typescript": "^5.5.3",                 // TypeScript compiler
  "typescript-eslint": "^8.3.0",          // TypeScript ESLint
  "vite": "^5.4.2",                       // Build tool
  "tailwindcss": "^3.4.1",               // CSS framework
  "autoprefixer": "^10.4.18",            // CSS post-processor
  "postcss": "^8.4.35",                  // CSS processor
  "eslint": "^9.9.1",                    // Code linting
  "eslint-plugin-react-hooks": "^5.1.0-rc.0", // React hooks linting
  "eslint-plugin-react-refresh": "^0.4.11",   // React refresh linting
  "globals": "^15.9.0"                   // Global variables
}
```

### Technology Choices Explained

#### **React 18.3.1**
- **Why**: Latest stable version with concurrent features
- **Features Used**: Hooks (useState, useCallback), StrictMode
- **Benefits**: Component reusability, virtual DOM, large ecosystem

#### **TypeScript 5.5.3**
- **Why**: Type safety and better developer experience
- **Features Used**: Interfaces, generics, strict mode
- **Benefits**: Compile-time error checking, better IDE support

#### **Vite 5.4.2**
- **Why**: Fast development server and optimized builds
- **Features Used**: Hot module replacement, TypeScript support
- **Benefits**: Lightning-fast development, optimized production builds

#### **Tailwind CSS 3.4.1**
- **Why**: Utility-first CSS framework for rapid UI development
- **Features Used**: Responsive design, hover states, animations
- **Benefits**: Consistent design system, small bundle size

#### **Lucide React 0.344.0**
- **Why**: Modern, customizable icon library
- **Features Used**: File, processing, and UI icons
- **Benefits**: Tree-shakable, consistent design, TypeScript support

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### Checking Prerequisites
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd compressflow
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install

# Start the development server
npm run dev



To run the Application
refer
https://abhinav-stack852.github.io/Data-Compression-And-Decompression/
as deploy link 





