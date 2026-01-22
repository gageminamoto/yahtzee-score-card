# Yahtzee Score Tracker

A bold, design-forward web application for tracking Yahtzee scores. Built with React and inspired by CMYK Games' Swiss-style aesthetic.

## ✨ Features

- **Single Device Mode**: Track scores for 2-6 players on one device
- **Bold Design**: High-contrast colors, oversized typography, and minimal UI
- **Score Tracking**: Complete Yahtzee scorecard with automatic calculations
- **Upper Section Bonus**: Automatic tracking of 35-point bonus (≥63 points)
- **Responsive**: Works on mobile, tablet, and desktop
- **100% Free**: No ads, no tracking, no monetization

## 🎨 Design Philosophy

This app follows a bold CMYK-inspired design system:

- **Typography**: Instrument Serif for headlines, Albert Sans for UI
- **Colors**: Electric blue, hot magenta, bright yellow, vivid orange, deep purple
- **Style**: Swiss-inspired, high contrast, geometric shapes
- **Interaction**: Large tap targets, clear visual states, smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/yahtzee-score-card.git
cd yahtzee-score-card

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build
```

## 🎮 How to Play

1. **Select Mode**: Choose "Single Device" on the home screen
2. **Add Players**: Enter 2-6 player names (colors assigned automatically)
3. **Start Game**: Tap "Start Game" to begin
4. **Score Entry**:
   - Tap any available category on your turn
   - Enter score using the number pad
   - Scores are validated automatically
5. **Track Progress**: View all player scores in the leaderboard
6. **Winner**: After 13 rounds, see the winner announcement

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   ├── Scorecard.jsx
│   └── ScoreEntryModal.jsx
├── pages/              # Main screens
│   ├── Home.jsx
│   ├── SingleDeviceSetup.jsx
│   ├── GameBoard.jsx
│   └── Winner.jsx
├── utils/              # Helper functions
│   ├── colors.js       # Color palette
│   ├── gameConstants.js # Yahtzee rules
│   └── scoring.js      # Score calculations
├── App.jsx             # Main app component
└── index.css           # Global styles
```

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Fonts**: Google Fonts (Instrument Serif, Albert Sans)
- **State**: React Hooks (useState)

## 📋 Yahtzee Rules

### Upper Section
- **Ones - Sixes**: Sum of matching dice
- **Bonus**: +35 points if upper section ≥ 63 points

### Lower Section
- **3 of a Kind**: Sum of all dice (3+ matching)
- **4 of a Kind**: Sum of all dice (4+ matching)
- **Full House**: 25 points (3 of one, 2 of another)
- **Small Straight**: 30 points (4 consecutive)
- **Large Straight**: 40 points (5 consecutive)
- **Yahtzee**: 50 points (all 5 match)
- **Chance**: Sum of all dice

## 🎯 Roadmap

### MVP (Current)
- ✅ Single device mode
- ✅ Score tracking and validation
- ✅ Bold CMYK design system
- ✅ Responsive layout
- ✅ Winner screen

### Phase 2 (Future)
- [ ] Multi-device mode with session codes
- [ ] Undo last entry
- [ ] Game history
- [ ] Illustrations for categories
- [ ] PWA support (offline mode)
- [ ] Dark mode toggle
- [ ] QR code joining
- [ ] Sound effects

## 🤝 Contributing

Contributions are welcome! This is an open source project built for learning and fun.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for anything!

## 🙏 Credits

- **Design Inspiration**: [CMYK Games](https://www.cmyk.games)
- **Fonts**: [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) & [Albert Sans](https://fonts.google.com/specimen/Albert+Sans) by Google Fonts
- **Game**: Hasbro's Yahtzee

## 💡 Why This Project?

This app was built to:
- Explore bold graphic design in web applications
- Learn React and modern web development
- Create a beautiful, free tool for game night
- Prove that utility apps can be art

---

**Made with ❤️ for board game enthusiasts**
