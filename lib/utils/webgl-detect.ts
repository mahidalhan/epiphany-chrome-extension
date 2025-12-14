/**
 * WebGL Detection Utilities
 *
 * Detects WebGL support for graceful fallback to static placeholder
 * when 3D visualization is not available.
 */

/**
 * Check if WebGL is supported in the current browser.
 * Tests for both WebGL 2 (preferred) and WebGL 1 (fallback).
 *
 * @returns true if WebGL is available, false otherwise
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * WebGL capability information for debugging and analytics.
 */
export interface WebGLInfo {
  version: 1 | 2;
  renderer: string;
  vendor: string;
}

/**
 * Get detailed WebGL information.
 * Useful for debugging and understanding hardware capabilities.
 *
 * @returns WebGL info object or null if not supported
 */
export function getWebGLInfo(): WebGLInfo | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return null;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const version = gl instanceof WebGL2RenderingContext ? 2 : 1;

    return {
      version,
      renderer: debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : 'Unknown',
      vendor: debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : 'Unknown',
    };
  } catch {
    return null;
  }
}
