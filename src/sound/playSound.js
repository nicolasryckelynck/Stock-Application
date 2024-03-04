// play sounds if success
export const playSuccessSound = async (successSound) => {
  if (successSound) {
    await successSound.replayAsync();
  }
};

// play sounds if error
export const playErrorSound = async (errorSound) => {
  if (errorSound) {
    await errorSound.replayAsync();
  }
};
