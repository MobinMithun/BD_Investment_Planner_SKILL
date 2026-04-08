# Bangladesh Investment Planner 🇧🇩 💸

A premium, highly interactive dashboard designed for the Bangladesh market, allowing users to strategize investments, calculate ROIs, and visualize long-term financial growth. 

![Screenshot of the App](./media/Screenshot_8-4-2026_14547_localhost.jpeg)

## ✨ Features

* **High-End UI/UX**: A gorgeous glassmorphism design with immersive background animations.
* **Real-time Audio Visualizer**: Click "Mic Sync" to make the background and floating money particles dynamically scale and pulse to the ambient bass/volume in your room using the Web Audio API.
* **Comprehensive BD Instruments**: Compare Sanchaypatra, FDRs, Dhaka Stock Exchange (DSE) stocks, Real Estate, Gold, and modern Agrotech startups (iFarmer, WeGro).
* **Tax Rebate Calculator**: Ensure tax-efficient investments via government-approved instruments. 
* **Export Strategy**: Download your current portfolio projection cleanly as a PDF securely generated on-client using `html2canvas` and `jsPDF`.
* **AI Advisor Ready**: Set your `VITE_ANTHROPIC_API_KEY` to simulate smart financial advice.

## 🛠️ Tech Stack

* **Core**: React.js 18 + Vite
* **Styling**: Vanilla CSS with comprehensive CSS Variables for dynamic state handling.
* **Visualization**: `recharts` for rich line and area charts.
* **Audio Interactivity**: Native browser `Web Audio API` for microphone input analysis.
* **Exporting**: `html2canvas` and `jspdf`.
* **Icons**: `lucide-react`.

## 🚀 Quick Start Guide

Follow these simple steps to run this application locally on your machine.

### Prerequisites

Ensure you have **Node.js** (v16.0 or higher) and **npm** installed on your machine. If not, download and install Node from [their official site](https://nodejs.org/).

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-link-here>
   cd BD_Investment_Planner_SKILL
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment variables**. Create a `.env` file in the root directory (optional but recommended for full AI access):
   ```env
   VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open the App**:
   Navigate to `http://localhost:5173` in your favorite web browser (we recommend Chrome or Edge).

## 🪩 Testing the Mic Sync Visualizer

1. Click on the **Mic Beat Sync** button in the top right.
2. Allow microphone permissions in your browser.
3. Play music on your loud speakers or speak directly into your microphone.
4. Watch the entire background pulse, shift colors, and floating money expand instantly to the beat amplitude. 

## 📝 License

Designed and developed exclusively for the Bangladesh Investment ecosystem. Open-sourced under the MIT license.