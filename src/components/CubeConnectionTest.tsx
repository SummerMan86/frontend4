import React, { useEffect, useState } from 'react';
import cubejsApi from '../utils/cubeApi';

const CubeConnectionTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Testing connection to Cube.js...');
  const [availableCubes, setAvailableCubes] = useState<string[]>([]);

  useEffect(() => {
    cubejsApi.meta()
      .then(metaResponse => {
        console.log("Meta response:", metaResponse);
        setStatus('success');
        setMessage('Connected successfully to Cube.js API!');
        setAvailableCubes(metaResponse.cubes.map(c => c.name));
      })
      .catch(err => {
        console.error("Connection error:", err);
        setStatus('error');
        setMessage(`Connection failed: ${err.message || 'Unknown error'}`);
      });
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Cube.js Connection Test</h2>
      
      {status === 'loading' && <p>Testing connection...</p>}
      
      {status === 'success' && (
        <div style={{ color: 'green' }}>
          <p>✅ {message}</p>
          <h4>Available Cubes:</h4>
          {availableCubes.length > 0 ? (
            <ul>
              {availableCubes.map(cube => (
                <li key={cube}>{cube}</li>
              ))}
            </ul>
          ) : (
            <p>No cubes found. Check your schema files.</p>
          )}
        </div>
      )}
      
      {status === 'error' && (
        <div style={{ color: 'red' }}>
          <p>❌ {message}</p>
          <h4>Troubleshooting Steps:</h4>
          <ol>
            <li>Verify that your Cube.js server is running</li>
            <li>Check that your API URL and token are correct</li>
            <li>Ensure your schema files are in the correct location</li>
            <li>Check for CORS issues if using different domains</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default CubeConnectionTest;