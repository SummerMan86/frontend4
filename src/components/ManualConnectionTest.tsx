import React, { useState } from 'react';

const ManualConnectionTest = () => {
  console.log(process.env.REACT_APP_CUBEJS_API_URL );
  const [url, setUrl] = useState('http://localhost:4000/cubejs-api/v1');
  const [token, setToken] = useState(process.env.REACT_APP_CUBEJS_TOKEN || 'd9b577e635d6ee667de247059ed6e63b86883a9d974cac06e7465498fd7ea6a6cc9db6f4b3b5024d30055a9f740ed077e653d71febd35e1aca3722bed8918f07');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      const response = await fetch(`${url}/meta`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { rawText: responseText };
      }
      
      setResult(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries([...response.headers.entries()]),
        data
      }, null, 2));
    } catch (error) {
      setResult(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px 0' }}>
      <h2>Manual Connection Test</h2>
      <div>
        <label>
          API URL:
          <input 
            type="text" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Token:
          <input 
            type="text" 
            value={token} 
            onChange={e => setToken(e.target.value)} 
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
        </label>
      </div>
      <button 
        onClick={testConnection}
        disabled={loading}
        style={{ padding: '8px 16px' }}
      >
        Test Connection
      </button>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result:</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ManualConnectionTest;