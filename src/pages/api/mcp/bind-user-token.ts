import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { chat_id, user_jwt, ttl_sec: _ttl_sec = 900 } = req.body;

    if (!chat_id || !user_jwt) {
      return res.status(400).json({
        success: false,
        message: 'chat_id y user_jwt son obligatorios'
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

    console.log('Binding user token to MCP:', { chat_id, mcpUrl });

    const response = await axios.post(`${mcpUrl}/mcp/session/bindUserToken`, {
      chat_id: parseInt(chat_id), // Convertir a número como espera el MCP
      user_jwt,
    }, {
      headers: {
        'Authorization': `Bearer ${mcpAppToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('MCP bind response:', response.data);

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error binding user token to MCP:', error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Error al conectar con MCP'
    });
  }
}