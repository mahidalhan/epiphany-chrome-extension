/**
 * Epiphany Background Service Worker
 *
 * Phase 1: Empty placeholder
 * Phase 5: Will add message passing between newtab and background
 * Phase 6: Will add browser activity tracking (tabs, idle detection)
 * Phase 8: Will add Bluetooth/EEG data processing
 */

export default defineBackground(() => {
  console.log('[Epiphany] Background service worker initialized');

  // Phase 6: Tab switching detection
  // chrome.tabs.onActivated.addListener(...)

  // Phase 6: Idle state detection
  // chrome.idle.onStateChanged.addListener(...)

  // Phase 8: EEG data processing from Web Worker
  // Will process 256Hz data stream from BLE connection
});
