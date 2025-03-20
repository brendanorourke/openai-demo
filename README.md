
# RetailNext: AI Fashion Recommendation Assistant

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://lovable.dev/projects/71e142ac-20b3-477f-9bbb-339967b63624)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

RetailNext is an AI-powered shopping assistant that revolutionizes how users discover and match clothing items. The application allows users to upload images of clothing items and receives AI-powered recommendations for complementary pieces.

## Architecture Overview

### Core Components

The application follows a modular architecture with these key components:

1. **Image Analysis Pipeline**
   - User uploads an image via `UploadStep.tsx`
   - The image is analyzed using OpenAI's GPT-4o model via `imageAnalysisService.ts`
   - Analysis results include item category, gender, and recommended items

2. **Recommendation Engine**
   - `useImageAnalysis.ts` hook orchestrates the recommendation process
   - `embeddingService.ts` generates vector embeddings for items
   - `similarityService.ts` and `vectorOperations.ts` calculate semantic similarity
   - `recommendationFilters.ts` filters results by gender and category

3. **Data Management**
   - `csvDatabase.ts` loads product data from CSV
   - `useCSVDatabase.ts` hook provides data access throughout the app
   - `mockData.ts` provides fallback when CSV data is unavailable

4. **UI Components**
   - Multi-step workflow: Upload → Analysis → Recommendations
   - Responsive design with Tailwind CSS
   - UI components from shadcn/ui library

### Data Flow

1. Image uploaded by user
2. Image converted to base64 and sent to OpenAI API
3. AI analysis extracts category, gender, and potential matches
4. System filters product database based on these attributes
5. Embeddings compared to find best matches
6. Results displayed to user with match indicators

## Project Setup

### Prerequisites

- Node.js 16+ and npm

### Local Development

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd outfit-assistant

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`.

### Build for Production

```sh
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

### API Key Setup

The application requires an OpenAI API key for image analysis features:

1. Obtain an API key from the [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. In the application, navigate to Settings and add your API key
3. The key will be stored securely in your browser's local storage

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- OpenAI API for image analysis
- TanStack Query for data management

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/71e142ac-20b3-477f-9bbb-339967b63624) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
