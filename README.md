# Excel to Flashcard

This React app allows users to convert Excel spreadsheets into interactive flashcards for studying. Flashcards can be sorted, randomized, and tracked with a customizable progress system.

## 📦 Features

- 📁 Upload Excel files (.xls, .xlsx)
- 📄 Select one or more sheets
- 🪪 Choose front/back headers for flashcards
- 🔁 Sort flashcards by any column
- 🎲 Shuffle for random practice
- 📈 Track progress levels 
- 🔊 Text-to-Speech (TTS) support for Chinese and English
- 💾 Save updated Excel file with progress changes

## 🛠️ Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/beatrixvv/excel-to-flashcard.git
   cd excel-to-flashcard

2. Install dependencies 
   ```bash 
   npm install

3. Start the app
   ```bash
   npm start

## 🧾 Usage
1. Upload an Excel file
2. Select sheets you want to study
3. Pick headers for front and back of the flashcards
4. Click "Random" for shuffled order or sort by any column
5. Use arrow buttons to navigate
6. Update your understanding using the progress buttons
7. Click the TTS button 🔊 to hear the text read aloud
8. Save your progress by downloading the updated file

## 📋 Excel Format
- First row should contain headers
- A "Status" column is automatically added or fixed
- All entries without valid status are set to "almost unknown" by default.

## 💬 Languages Supported for TTS
- English (default voice)
- Chinese (auto-detected using browser's SpeechSynthesis capabilities)
