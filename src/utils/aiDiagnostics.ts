/**
 * AI API Diagnostic Utility
 * 
 * Inspects, logs, and parses responses from AI endpoints.
 * Specifically detects and handles non-JSON output (such as HTML 500 error pages,
 * plain text stack traces, gateway timeouts, or empty responses).
 */

export interface AIDiagnosticResult<T = any> {
  ok: boolean;
  status: number;
  statusText: string;
  contentType: string | null;
  isJson: boolean;
  rawBody: string;
  data: T | null;
  nonJsonType?: 'html_error' | 'plain_text' | 'empty' | 'malformed_json' | 'none';
  errorMessage?: string;
  durationMs?: number;
}

/**
 * Diagnostic utility that inspects a Fetch Response specifically for AI endpoints.
 * Safely extracts raw text first, checks if it is valid JSON, and logs detailed diagnostic output.
 */
export async function diagnoseAIResponse<T = any>(
  response: Response,
  endpointLabel: string = 'AI Endpoint'
): Promise<AIDiagnosticResult<T>> {
  const status = response.status;
  const statusText = response.statusText;
  const contentType = response.headers.get('content-type');
  
  let rawBody = '';
  try {
    rawBody = await response.text();
  } catch (err: any) {
    rawBody = `[Failed to read response body: ${err?.message || 'Unknown error'}]`;
  }

  let isJson = false;
  let parsedData: T | null = null;
  let nonJsonType: AIDiagnosticResult['nonJsonType'] = 'none';
  let errorMessage: string | undefined = undefined;

  const trimmed = rawBody.trim();

  if (!trimmed) {
    nonJsonType = 'empty';
    errorMessage = `Empty response body received from ${endpointLabel} with status ${status}.`;
  } else if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.includes('<body') || trimmed.includes('</h1>')) {
    nonJsonType = 'html_error';
    // Extract title or h1 if possible for quick diagnosis
    const titleMatch = trimmed.match(/<title>(.*?)<\/title>/i) || trimmed.match(/<h1>(.*?)<\/h1>/i);
    const htmlTitle = titleMatch ? titleMatch[1] : 'HTML Document';
    errorMessage = `HTML returned instead of JSON (${htmlTitle}) - HTTP ${status}`;
  } else {
    try {
      parsedData = JSON.parse(rawBody);
      isJson = true;
      nonJsonType = 'none';
    } catch (jsonErr: any) {
      isJson = false;
      nonJsonType = trimmed.startsWith('{') || trimmed.startsWith('[') ? 'malformed_json' : 'plain_text';
      errorMessage = `Non-JSON output received: ${trimmed.slice(0, 120)} (Parse error: ${jsonErr.message})`;
    }
  }

  // Visual Diagnostic Logging
  const logStyleHeader = isJson && response.ok
    ? 'color: #10B981; font-weight: bold;'
    : 'color: #EF4444; font-weight: bold;';

  console.groupCollapsed(`%c[AI Diagnostics] ${endpointLabel} -> HTTP ${status} ${statusText}`, logStyleHeader);
  console.log('• Status:', status, statusText);
  console.log('• Content-Type:', contentType || 'Not specified');
  console.log('• Is JSON:', isJson ? '✅ Yes' : `❌ No (${nonJsonType})`);
  
  if (!isJson) {
    console.warn('⚠️ NON-JSON OUTPUT DETECTED:', {
      type: nonJsonType,
      error: errorMessage,
      rawBodyPreview: rawBody.length > 500 ? rawBody.slice(0, 500) + '... (truncated)' : rawBody
    });
  } else {
    console.log('• Parsed Data:', parsedData);
  }
  
  console.log('• Raw Response Body:', rawBody);
  console.groupEnd();

  return {
    ok: response.ok && isJson,
    status,
    statusText,
    contentType,
    isJson,
    rawBody,
    data: parsedData,
    nonJsonType,
    errorMessage
  };
}

/**
 * Convenience wrapper to perform an AI fetch and run comprehensive diagnostics on the result.
 */
export async function fetchAndDiagnoseAI<T = any>(
  url: string,
  options?: RequestInit,
  endpointLabel?: string
): Promise<AIDiagnosticResult<T>> {
  const label = endpointLabel || url;
  const startTime = Date.now();

  try {
    const response = await fetch(url, options);
    const result = await diagnoseAIResponse<T>(response, label);
    result.durationMs = Date.now() - startTime;
    return result;
  } catch (networkError: any) {
    const durationMs = Date.now() - startTime;
    console.error(`%c[AI Diagnostics Error] Network failure calling ${label}`, 'color: #DC2626; font-weight: bold;', {
      error: networkError?.message || networkError,
      durationMs
    });

    return {
      ok: false,
      status: 0,
      statusText: 'Network / Fetch Failure',
      contentType: null,
      isJson: false,
      rawBody: '',
      data: null,
      nonJsonType: 'none',
      errorMessage: `Network request failed: ${networkError?.message || 'Unknown network error'}`,
      durationMs
    };
  }
}
