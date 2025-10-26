// Archivo: pages/api/mcp/sendMessage.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { user_id, user_text } = req.body;

    if (!user_id || !user_text) {
      return res.status(400).json({
        success: false,
        message: 'user_id y user_text son obligatorios'
      });
    }

    const mcpUrl = process.env.MCP_URL;
    const mcpAppToken = process.env.MCP_APP_TOKEN;

    if (!mcpUrl || !mcpAppToken) {
      console.error('MCP_URL or MCP_APP_TOKEN not configured');
      return res.status(500).json({
        success: false,
        message: 'Configuración del servidor incompleta'
      });
    }
    
    const response = await axios.post(`${mcpUrl}/mcp/messages`, {
      user_id,
      user_text,
    }, {
      headers: {
        'Authorization': `Bearer ${mcpAppToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    return res.status(200).json(response.data);

  } catch (error: any) {
    console.error('Error calling MCP message endpoint:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Error al procesar el mensaje en MCP'
    });
  }
}