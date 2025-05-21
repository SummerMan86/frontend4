import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dependencies } from './package.json';


export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
  },
  optimizeDeps: { include: [ 'echarts', 'echarts-for-react', 'ag-grid-community', 'ag-grid-react', ...Object.keys(dependencies).filter(d=>d.startsWith('@mantine')) ] },  
  define: {
    // Using this format ensures proper replacement without extra quotes
    'process.env.REACT_APP_CUBEJS_API_URL': JSON.stringify('http://localhost:4000/cubejs-api/v1'),
    'process.env.REACT_APP_CUBEJS_TOKEN': JSON.stringify('d9b577e635d6ee667de247059ed6e63b86883a9d974cac06e7465498fd7ea6a6cc9db6f4b3b5024d30055a9f740ed077e653d71febd35e1aca3722bed8918f07')
    // If using .env variables:
    // 'process.env.REACT_APP_API_URL': JSON.stringify(import.meta.env.VITE_API_URL),
  }
})