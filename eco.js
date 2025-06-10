// Game Data and State
const gameState = {
  currentGame: null,
  scores: {
    total: 0,
    recycling: 0,
    energy: 0,
    quiz: 0,
    trees: 0
  },
  level: 1,
  achievements: [],
  stats: {
    itemsRecycled: 0,
    energySaved: 0,
    treesPlanted: 0,
    co2Absorbed: 0
  }
};

// Recycling Game Data
const recyclingItems = [
  { name: 'Plastic Bottle', icon: '🥤', type: 'plastic', fact: 'Recycling one plastic bottle saves enough energy to power a light bulb for 3 hours!' },
  { name: 'Newspaper', icon: '📰', type: 'paper', fact: 'Recycling paper saves 60% of the energy needed to make new paper!' },
  { name: 'Glass Jar', icon: '🫙', type: 'glass', fact: 'Glass can be recycled infinitely without losing quality!' },
  { name: 'Apple Core', icon: '🍎', type: 'organic', fact: 'Composting organic waste reduces methane emissions from landfills!' },
  { name: 'Candy Wrapper', icon: '🍬', type: 'trash', fact: 'Many candy wrappers cannot be recycled and must go to landfill.' },
  { name: 'Cardboard Box', icon: '📦', type: 'paper', fact: 'Cardboard can be recycled 5-7 times before the fibers become too short!' },
  { name: 'Soda Can', icon: '🥫', type: 'plastic', fact: 'Aluminum cans can be recycled and back on shelves in just 60 days!' },
  { name: 'Wine Bottle', icon: '🍷', type: 'glass', fact: 'Making new glass from recycled glass uses 40% less energy!' },
  { name: 'Banana Peel', icon: '🍌', type: 'organic', fact: 'Banana peels make excellent compost and are rich in potassium!' },
  { name: 'Chip Bag', icon: '🥖', type: 'trash', fact: 'Most chip bags are made of mixed materials and cannot be recycled.' }
];

// Quiz Questions
const quizQuestions = [
  {
    question: "How long does it take for a plastic bottle to decompose?",
    options: ["1-5 years", "10-20 years", "50-80 years", "450+ years"],
    correct: 3,
    explanation: "Plastic bottles can take 450+ years to decompose, which is why recycling is so important!"
  },
  {
    question: "What percentage of energy can be saved by recycling aluminum cans?",
    options: ["25%", "50%", "75%", "95%"],
    correct: 3,
    explanation: "Recycling aluminum cans saves 95% of the energy needed to make new cans from raw materials!"
  },
  {
    question: "How much water does it take to produce one cotton t-shirt?",
    options: ["100 liters", "700 liters", "1,500 liters", "2,700 liters"],
    correct: 3,
    explanation: "It takes approximately 2,700 liters of water to produce one cotton t-shirt!"
  },
  {
    question: "Which transportation method produces the least CO₂ emissions?",
    options: ["Car", "Bus", "Train", "Bicycle"],
    correct: 3,
    explanation: "Bicycles produce zero CO₂ emissions and are the most environmentally friendly transportation!"
  },
  {
    question: "What percentage of the world's electricity comes from renewable sources?",
    options: ["12%", "26%", "35%", "48%"],
    correct: 1,
    explanation: "About 26% of global electricity comes from renewable sources, and this number is growing!"
  }
];

// Tree types for planting game
const treeTypes = [
  { name: 'Oak Tree', icon: '🌳', co2: 22, type: 'oak' },
  { name: 'Pine Tree', icon: '🌲', co2: 18, type: 'pine' },
  { name: 'Fruit Tree', icon: '🌳', co2: 15, type: 'fruit' }
];

// Screen Management
function showScreen(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    gameState.currentGame = screenId;
  }
}

// Utility Functions
function updateScore(game, points) {
  gameState.scores[game] += points;
  gameState.scores.total += points;
  
  // Update level based on total score
  const newLevel = Math.floor(gameState.scores.total / 1000) + 1;
  if (newLevel > gameState.level) {
    gameState.level = newLevel;
    showAchievement(`Level Up! You're now Eco Level ${newLevel}! 🌱`);
  }
  
  updateUI();
}

function showAchievement(message) {
  const achievement = document.createElement('div');
  achievement.className = 'achievement-popup';
  achievement.textContent = message;
  achievement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #2ECC71, #27AE60);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.5s ease-out;
    font-weight: 600;
  `;
  
  document.body.appendChild(achievement);
  
  setTimeout(() => {
    achievement.style.animation = 'slideOut 0.5s ease-out forwards';
    setTimeout(() => achievement.remove(), 500);
  }, 3000);
}

function updateUI() {
  const totalScoreEl = document.getElementById('total-score');
  const ecoLevelEl = document.getElementById('eco-level');
  
  if (totalScoreEl) totalScoreEl.textContent = gameState.scores.total;
  if (ecoLevelEl) ecoLevelEl.textContent = gameState.level;
  
  // Update best scores
  const recyclingBest = document.getElementById('recycling-best');
  const energyBest = document.getElementById('energy-best');
  const quizBest = document.getElementById('quiz-best');
  const treesBest = document.getElementById('trees-best');
  
  if (recyclingBest) recyclingBest.textContent = gameState.scores.recycling;
  if (energyBest) energyBest.textContent = Math.round(gameState.stats.energySaved * 0.12);
  if (quizBest) quizBest.textContent = gameState.scores.quiz;
  if (treesBest) treesBest.textContent = gameState.stats.treesPlanted;
}

// Main Menu Functions
function initMainMenu() {
  const gameCards = document.querySelectorAll('.game-card');
  
  gameCards.forEach(card => {
    card.addEventListener('click', () => {
      const game = card.dataset.game;
      showScreen(`${game}-game`);
      initGame(game);
    });
  });
}

// Back Button Handler
function initBackButtons() {
  const backButtons = document.querySelectorAll('.back-btn');
  
  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showScreen('main-menu');
      resetCurrentGame();
    });
  });
}

function resetCurrentGame() {
  if (window.gameTimer) {
    clearInterval(window.gameTimer);
    window.gameTimer = null;
  }
}

// Game Initialization
function initGame(gameType) {
  switch (gameType) {
    case 'recycling':
      initRecyclingGame();
      break;
    case 'energy':
      initEnergyGame();
      break;
    case 'quiz':
      initQuizGame();
      break;
    case 'trees':
      initTreeGame();
      break;
  }
}

// Recycling Game
function initRecyclingGame() {
  let currentItem = 0;
  let score = 0;
  let level = 1;
  let timeLeft = 60;
  let gameActive = true;
  
  function updateRecyclingUI() {
    const scoreEl = document.getElementById('recycling-score');
    const levelEl = document.getElementById('recycling-level');
    const timeEl = document.getElementById('recycling-time');
    
    if (scoreEl) scoreEl.textContent = score;
    if (levelEl) levelEl.textContent = level;
    if (timeEl) timeEl.textContent = timeLeft;
  }
  
  function showNextItem() {
    if (currentItem >= recyclingItems.length) {
      currentItem = 0;
      level++;
      timeLeft += 30;
    }
    
    const item = recyclingItems[currentItem];
    const itemElement = document.getElementById('current-item');
    
    if (itemElement) {
      const iconEl = itemElement.querySelector('.item-icon');
      const nameEl = itemElement.querySelector('.item-name');
      
      if (iconEl) iconEl.textContent = item.icon;
      if (nameEl) nameEl.textContent = item.name;
    }
    
    const factEl = document.getElementById('recycling-fact');
    if (factEl) {
      factEl.innerHTML = `<p>💡 ${item.fact}</p>`;
    }
    
    updateRecyclingUI();
  }
  
  function handleBinClick(binType) {
    if (!gameActive) return;
    
    const currentItemData = recyclingItems[currentItem];
    const bin = document.querySelector(`[data-type="${binType}"]`);
    
    if (!bin) return;
    
    if (currentItemData.type === binType) {
      bin.classList.add('correct');
      score += 100 * level;
      gameState.stats.itemsRecycled++;
      updateScore('recycling', 100 * level);
      
      setTimeout(() => {
        bin.classList.remove('correct');
        currentItem++;
        showNextItem();
      }, 600);
    } else {
      bin.classList.add('incorrect');
      score = Math.max(0, score - 50);
      
      setTimeout(() => {
        bin.classList.remove('incorrect');
      }, 500);
    }
  }
  
  document.querySelectorAll('.bin').forEach(bin => {
    bin.addEventListener('click', () => {
      handleBinClick(bin.dataset.type);
    });
  });
  
  window.gameTimer = setInterval(() => {
    timeLeft--;
    updateRecyclingUI();
    
    if (timeLeft <= 0) {
      gameActive = false;
      clearInterval(window.gameTimer);
      endGame('recycling', score);
    }
  }, 1000);
  
  showNextItem();
  updateRecyclingUI();
}

// Enhanced Energy Game
function initEnergyGame() {
  let energySaved = 0;
  let moneySaved = 0;
  let timeLeft = 90;
  let gameActive = true;
  let totalSavingsPerSecond = 0;
  
  // Reset all appliances to ON state
  document.querySelectorAll('.appliance').forEach(appliance => {
    appliance.classList.add('active');
  });
  
  function calculateCurrentUsage() {
    let totalUsage = 0;
    document.querySelectorAll('.appliance.active').forEach(appliance => {
      totalUsage += parseInt(appliance.dataset.consumption);
    });
    return totalUsage;
  }
  
  function calculateSavingsPerSecond() {
    let totalSavings = 0;
    document.querySelectorAll('.appliance:not(.active)').forEach(appliance => {
      const consumption = parseInt(appliance.dataset.consumption);
      totalSavings += consumption / 1000 / 3600; // Convert to kWh per second
    });
    return totalSavings;
  }
  
  function updateEnergyUI() {
    const energySavedEl = document.getElementById('energy-saved');
    const moneySavedEl = document.getElementById('money-saved');
    const timeEl = document.getElementById('energy-time');
    const usageEl = document.getElementById('current-usage');
    const meterEl = document.getElementById('energy-meter');
    
    if (energySavedEl) energySavedEl.textContent = energySaved.toFixed(2);
    if (moneySavedEl) moneySavedEl.textContent = moneySaved.toFixed(2);
    if (timeEl) timeEl.textContent = timeLeft;
    
    const currentUsage = calculateCurrentUsage();
    if (usageEl) usageEl.textContent = currentUsage;
    
    // Update meter with color coding
    const maxUsage = 6400;
    const meterPercent = Math.min((currentUsage / maxUsage) * 100, 100);
    if (meterEl) {
      meterEl.style.width = `${meterPercent}%`;
      
      // Color coding based on usage
      if (meterPercent > 75) {
        meterEl.style.background = 'linear-gradient(90deg, #E74C3C, #C0392B)'; // Red - High usage
      } else if (meterPercent > 50) {
        meterEl.style.background = 'linear-gradient(90deg, #F39C12, #E67E22)'; // Orange - Medium usage
      } else if (meterPercent > 25) {
        meterEl.style.background = 'linear-gradient(90deg, #F1C40F, #F39C12)'; // Yellow - Low-medium usage
      } else {
        meterEl.style.background = 'linear-gradient(90deg, #2ECC71, #27AE60)'; // Green - Low usage
      }
    }
    
    // Update savings rate display
    totalSavingsPerSecond = calculateSavingsPerSecond();
  }
  
  function handleApplianceClick(appliance) {
    if (!gameActive) return;
    
    const wasActive = appliance.classList.contains('active');
    const consumption = parseInt(appliance.dataset.consumption);
    const applianceName = appliance.querySelector('.appliance-name').textContent;
    
    if (wasActive) {
      // Turn OFF appliance
      appliance.classList.remove('active');
      appliance.style.transform = 'scale(0.95)';
      setTimeout(() => {
        appliance.style.transform = '';
      }, 200);
      
      updateScore('energy', 100);
      showAchievement(`💡 ${applianceName} turned OFF! Saving ${consumption}W!`);
    } else {
      // Turn ON appliance
      appliance.classList.add('active');
      appliance.style.transform = 'scale(1.05)';
      setTimeout(() => {
        appliance.style.transform = '';
      }, 200);
      
      showAchievement(`⚡ ${applianceName} turned ON - using ${consumption}W`);
    }
    
    updateEnergyUI();
  }
  
  document.querySelectorAll('.appliance').forEach(appliance => {
    appliance.addEventListener('click', () => {
      handleApplianceClick(appliance);
    });
  });
  
  window.gameTimer = setInterval(() => {
    timeLeft--;
    
    // Add continuous savings for turned off appliances
    energySaved += totalSavingsPerSecond;
    moneySaved += totalSavingsPerSecond * 0.12;
    gameState.stats.energySaved += totalSavingsPerSecond;
    
    updateEnergyUI();
    
    // Show periodic savings feedback
    if (timeLeft % 10 === 0 && totalSavingsPerSecond > 0) {
      const savingsRate = (totalSavingsPerSecond * 3600).toFixed(1);
      showAchievement(`🌱 Saving ${savingsRate} kWh/hour!`);
    }
    
    if (timeLeft <= 0) {
      gameActive = false;
      clearInterval(window.gameTimer);
      const finalScore = Math.round(energySaved * 1000 + moneySaved * 100);
      endGame('energy', finalScore);
    }
  }, 1000);
  
  updateEnergyUI();
}

// Quiz Game
function initQuizGame() {
  let currentQuestion = 0;
  let score = 0;
  let streak = 0;
  let gameActive = true;
  
  function updateQuizUI() {
    const currentEl = document.getElementById('quiz-current');
    const totalEl = document.getElementById('quiz-total');
    const scoreEl = document.getElementById('quiz-score');
    const streakEl = document.getElementById('quiz-streak');
    const questionNumEl = document.getElementById('question-num');
    const progressEl = document.getElementById('quiz-progress');
    
    if (currentEl) currentEl.textContent = currentQuestion + 1;
    if (totalEl) totalEl.textContent = quizQuestions.length;
    if (scoreEl) scoreEl.textContent = score;
    if (streakEl) streakEl.textContent = streak;
    if (questionNumEl) questionNumEl.textContent = currentQuestion + 1;
    
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    if (progressEl) progressEl.style.width = `${progress}%`;
  }
  
  function showQuestion() {
    if (currentQuestion >= quizQuestions.length) {
      endGame('quiz', score);
      return;
    }
    
    const question = quizQuestions[currentQuestion];
    const questionEl = document.getElementById('quiz-question');
    
    if (questionEl) {
      questionEl.textContent = question.question;
    }
    
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, index) => {
      const textEl = option.querySelector('.option-text');
      if (textEl) {
        textEl.textContent = question.options[index];
      }
      option.classList.remove('correct', 'incorrect', 'disabled');
      option.onclick = () => handleAnswer(index);
    });
    
    const feedbackEl = document.getElementById('quiz-feedback');
    if (feedbackEl) {
      feedbackEl.classList.remove('show');
    }
    
    updateQuizUI();
  }
  
  function handleAnswer(selectedIndex) {
    if (!gameActive) return;
    
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback');
    
    options.forEach(option => {
      option.classList.add('disabled');
      option.onclick = null;
    });
    
    options[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'incorrect');
    if (selectedIndex !== question.correct) {
      options[question.correct].classList.add('correct');
    }
    
    if (selectedIndex === question.correct) {
      const points = 100 + (streak * 50);
      score += points;
      streak++;
      updateScore('quiz', points);
      
      if (feedback) {
        const iconEl = feedback.querySelector('.feedback-icon');
        const titleEl = feedback.querySelector('.feedback-title');
        if (iconEl) iconEl.textContent = '✅';
        if (titleEl) titleEl.textContent = 'Correct!';
      }
    } else {
      streak = 0;
      if (feedback) {
        const iconEl = feedback.querySelector('.feedback-icon');
        const titleEl = feedback.querySelector('.feedback-title');
        if (iconEl) iconEl.textContent = '❌';
        if (titleEl) titleEl.textContent = 'Incorrect';
      }
    }
    
    if (feedback) {
      const textEl = feedback.querySelector('.feedback-text');
      if (textEl) {
        textEl.textContent = question.explanation;
      }
      feedback.classList.add('show');
    }
    
    setTimeout(() => {
      currentQuestion++;
      showQuestion();
    }, 3000);
  }
  
  showQuestion();
}

// Tree Planting Game
function initTreeGame() {
  let treesPlanted = 0;
  let co2Absorbed = 0;
  let selectedTreeType = 'oak';
  let plantingSpots = [];
  
  function updateTreeUI() {
    const treesEl = document.getElementById('trees-planted');
    const co2El = document.getElementById('co2-absorbed');
    const livesEl = document.getElementById('lives-saved');
    const totalCo2El = document.getElementById('total-co2');
    
    if (treesEl) treesEl.textContent = treesPlanted;
    if (co2El) co2El.textContent = Math.round(co2Absorbed);
    if (livesEl) livesEl.textContent = Math.round(co2Absorbed / 11);
    if (totalCo2El) totalCo2El.textContent = Math.round(co2Absorbed) + 'kg';
  }
  
  function createPlantingSpots() {
    const container = document.querySelector('.planting-spots');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
      const spot = document.createElement('div');
      spot.className = 'planting-spot';
      spot.dataset.index = i;
      spot.addEventListener('click', () => plantTree(i));
      container.appendChild(spot);
      plantingSpots.push({ planted: false, treeType: null });
    }
  }
  
  function selectTreeType(type) {
    document.querySelectorAll('.tree-option').forEach(option => {
      option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[data-type="${type}"]`);
    if (selectedOption) {
      selectedOption.classList.add('selected');
    }
    selectedTreeType = type;
  }
  
  function plantTree(spotIndex) {
    if (!selectedTreeType || plantingSpots[spotIndex].planted) return;
    
    const spot = document.querySelector(`[data-index="${spotIndex}"]`);
    const treeData = treeTypes.find(t => t.type === selectedTreeType);
    
    if (!spot || !treeData) return;
    
    spot.innerHTML = treeData.icon;
    spot.classList.add('planted');
    plantingSpots[spotIndex] = { planted: true, treeType: selectedTreeType };
    
    treesPlanted++;
    co2Absorbed += treeData.co2;
    gameState.stats.treesPlanted++;
    gameState.stats.co2Absorbed += treeData.co2;
    
    updateScore('trees', 200);
    updateTreeUI();
    
    showAchievement(`🌱 Tree planted! +${treeData.co2}kg CO₂/year absorbed!`);
  }
  
  document.querySelectorAll('.tree-option').forEach(option => {
    option.addEventListener('click', () => {
      selectTreeType(option.dataset.type);
    });
  });
  
  createPlantingSpots();
  selectTreeType('oak');
  updateTreeUI();
}

// Game Over Modal
function endGame(gameType, finalScore) {
  const modal = document.getElementById('game-over-modal');
  const title = document.getElementById('modal-title');
  const scoreDisplay = document.getElementById('final-score');
  
  if (!modal) return;
  
  if (title) {
    title.textContent = `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Complete!`;
  }
  if (scoreDisplay) {
    scoreDisplay.textContent = finalScore;
  }
  
  modal.style.display = 'flex';
  
  const playAgainBtn = document.getElementById('play-again-btn');
  const menuBtn = document.getElementById('menu-btn');
  
  if (playAgainBtn) {
    playAgainBtn.onclick = () => {
      modal.style.display = 'none';
      initGame(gameType);
    };
  }
  
  if (menuBtn) {
    menuBtn.onclick = () => {
      modal.style.display = 'none';
      showScreen('main-menu');
    };
  }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initMainMenu();
  initBackButtons();
  updateUI();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);